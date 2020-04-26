const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");

admin.initializeApp();

const firestore = admin.firestore();

exports.createDefaultUser = functions.auth.user().onCreate(user => {
  const email = user.email;
  return firestore
    .collection("users")
    .doc(email)
    .set({
      email,
      handle: "",
      bio: "",
      profile_url: "",
      created: Date.now(),
      review_data: new Array(11).fill(0)
    });
});

exports.updateContent = functions.firestore
  .document("reviews/{rid}")
  .onCreate(async (snap, context) => {
    const newReview = snap.data();
    const ref = await firestore.collection("content").doc(newReview.content_id);
    const refContent = await ref.get();
    if (refContent.exists) {
      const content = refContent.data();
      const number_ratings = content.number_ratings + 1;
      const number_reviews = content.number_reviews + Number(content.is_review);
      const sum_reviews = content.sum_reviews + newReview.rating;
      const rating_nums = content.rating_nums;
      rating_nums[Number(newReview.rating)] += 1;
      ref.update({
        number_ratings,
        number_reviews,
        sum_reviews,
        avg: sum_reviews / number_ratings || 0,
        rating_nums
      });
    } else {
      const rating_nums = new Array(11).fill(0);
      rating_nums[Number(newReview.rating)] = 1;
      ref.set({
        number_ratings: 1,
        number_reviews: newReview.is_review ? 1 : 0,
        content_id: newReview.content_id,
        sum_reviews: newReview.rating,
        avg: newReview.rating,
        rating_nums
      });
    }
    //updating the array of the users number of reviews
    const user = await firestore.collection("users").doc(newReview.author);
    const userContent = await user.get().then(res => res.data());
    //TODO: DELETE OR CASE ON LAUNCH
    const review_data = userContent.review_data || new Array(11).fill(0);
    review_data[Number(newReview.rating)] += 1;
    return user.update({
      review_data
    });
  });

exports.updateContentOnEdit = functions.firestore
  .document("reviews/{rid}")
  .onUpdate(async (change, context) => {
    const newReview = change.after.data();
    const oldReview = change.before.data();
    const ref = await firestore.collection("content").doc(oldReview.content_id);
    const content = await ref.get().then(res => res.data());
    const rating_nums = content.rating_nums;
    rating_nums[Number(newReview.rating)] += 1;
    rating_nums[Number(oldReview.rating)] -= 1;
    const number_reviews =
      content.number_reviews -
      Number(oldReview.is_review) +
      Number(newReview.is_review);
    const sum_reviews =
      content.sum_reviews + newReview.rating - oldReview.rating;
    ref.update({
      sum_reviews,
      number_reviews,
      avg: sum_reviews / content.number_ratings || 0,
      rating_nums
    });
    //updating the array of the users number of reviews
    const user = await firestore.collection("users").doc(newReview.author);
    const userContent = await user.get().then(res => res.data());
    //TODO: DELETE OR CASE ON LAUNCH
    const review_data = userContent.review_data || new Array(11).fill(0);
    review_data[Number(newReview.rating)] += 1;
    review_data[Number(oldReview.rating)] -= 1;
    return user.update({
      review_data
    });
  });

exports.updateContentOnDelete = functions.firestore
  .document("reviews/{rid}")
  .onDelete(async (snap, context) => {
    const delReview = snap.data();
    const ref = await firestore.collection("content").doc(delReview.content_id);
    const content = await ref.get().then(res => res.data());
    const sum_reviews = content.sum_reviews - delReview.rating;
    const number_ratings = content.number_ratings - 1;
    const number_reviews = content.number_reviews - Number(delReview.is_review);
    const rating_nums = content.rating_nums;
    rating_nums[Number(delReview.rating)] -= 1;
    ref.update({
      sum_reviews,
      number_ratings,
      number_reviews,
      avg: sum_reviews / number_ratings || 0,
      rating_nums
    });
    //updating the array of the users number of reviews
    const user = await firestore.collection("users").doc(delReview.author);
    const userContent = await user.get().then(res => res.data());
    //TODO: DELETE OR CASE ON LAUNCH
    const review_data = userContent.review_data || new Array(11).fill(0);
    review_data[Number(delReview.rating)] -= 1;
    return user.update({
      review_data
    });
  });

/**
 * @async
 * @function requestAccessToken
 * @param {string} id - client id
 * @param {string} secret - client secret
 * @return {Promise<Object>} - {access_token, token_type, expire_in}
 */

exports.scheduledFunction = functions.pubsub
  .schedule("every 50 minutes")
  .onRun(async context => {
    const requestAccessToken = async (id, secret, backoff = 5000) => {
      try {
        let buff = Buffer.from(id + ":" + secret);
        let base64data = buff.toString("base64");
        const postRequestHeader = {
          Authorization: "Basic " + base64data
        };
        const response = await axios.post(
          "https://accounts.spotify.com/api/token",
          "grant_type=client_credentials",
          {
            headers: postRequestHeader
          }
        );
        return response.data;
      } catch (error) {
        if (error.response.status >= 429) {
          return await setTimeout(
            () => requestAccessToken(id, secret, backoff * 2),
            backoff
          );
        } else {
          console.error("FROM REQUEST TOKEN:", error);
          return error;
        }
      }
    };
    const token = await requestAccessToken();
    return await firestore
      .collection("token")
      .doc("spotify")
      .set(token);
  });

// // Create and Deploy Your First Cloud Functions
// Deploy with: firebase deploy --only functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

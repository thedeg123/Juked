const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const { config } = require("./musicConfig.js");

admin.initializeApp();

const firestore = admin.firestore();

exports.createDefaultUser = functions.auth.user().onCreate(user => {
  const email = user.email;
  const listenlistPersonalId = email + "_personal";
  const listenlistPersonalOutgoingId = email + "_personal" + "_outgoing";
  const listenlistIncomingId = email + "_incoming";
  const batch = firestore.batch();

  const userRef = firestore.collection("users").doc(email);
  const llPersonalRef = firestore
    .collection("listenlist")
    .doc(listenlistPersonalId);
  const llIncomingRef = firestore
    .collection("listenlist")
    .doc(listenlistIncomingId);
  const llPersonalOutgoingRef = firestore
    .collection("listenlist")
    .doc(listenlistPersonalOutgoingId);

  batch.set(userRef, {
    email,
    handle: "",
    bio: "",
    profile_url: "",
    created: Date.now(),
    num_follower: 0,
    num_following: 0,
    review_data: new Array(11).fill(0),
    review_data_songs: new Array(11).fill(0),
    review_data_albums: new Array(11).fill(0),
    review_data_artists: new Array(11).fill(0)
  });
  batch.set(llPersonalRef, {
    items: [],
    personal: true
  });
  batch.set(llIncomingRef, {
    items: [],
    personal: false
  });
  batch.set(llPersonalOutgoingRef, {
    items: [],
    personal: true
  });
  return batch.commit();
});

exports.deleteUser = functions.auth.user().onDelete(async user => {
  // //deleting all reviews
  await firestore
    .collection("reviews")
    .where("author", "==", user.email)
    .get()
    .then(res => {
      var batch = firestore.batch();
      res.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
  //deleting all follows
  await firestore
    .collection("interactons")
    .where("type", "==", "follow")
    .where("author", "==", user.email)
    .get()
    .then(res => {
      var batch = firestore.batch();
      res.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
  await firestore
    .collection("interactons")
    .where("type", "==", "follow")
    .where("review_author", "==", user.email)
    .get()
    .then(res => {
      var batch = firestore.batch();
      res.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
  // delete the user
  return await firestore
    .collection("users")
    .doc(user.email)
    .delete();
});

exports.Onfollow = functions.firestore
  .document("interactions/{iid}")
  .onCreate(async (snap, context) => {
    const newFollow = snap.data();
    if (newFollow.type !== "follow") return;
    var batch = firestore.batch();
    const refFollowing = firestore.collection("users").doc(newFollow.review_author);
    const refFollower = firestore.collection("users").doc(newFollow.author);
    batch.update(refFollowing, {
      num_follower: admin.firestore.FieldValue.increment(1)
    });
    batch.update(refFollower, {
      num_following: admin.firestore.FieldValue.increment(1)
    });
    return batch.commit();
  });

exports.Onunfollow = functions.firestore
  .document("interactions/{fid}")
  .onDelete(async (snap, context) => {
    const delFollow = snap.data();
    if (delFollow.type !== "follow") return;
    var batch = firestore.batch();
    const refFollowing = firestore.collection("users").doc(delFollow.review_author);
    const refFollower = firestore.collection("users").doc(delFollow.author);
    batch.update(refFollowing, {
      num_follower: admin.firestore.FieldValue.increment(-1)
    });
    batch.update(refFollower, {
      num_following: admin.firestore.FieldValue.increment(-1)
    });
    return batch.commit();
  });

  exports.OnReccomend = functions.firestore
    .document("interactions/{iid}")
    .onCreate(async (snap, context) => {
      const newRec = snap.data();
      if (newRec.type !== "listenlist") {
        console.log(`Item not of type listenlist, type ${newRec.type}, doing nothing.`)
        return;
      }

      const refListenlist = firestore
        .collection("listenlist")
        .doc(newRec.review_author + "_incoming");

      firestore.runTransaction(transaction => {
        return transaction.get(refListenlist).then(doc => {
          const oldItems = doc.data().items
          const newItems = [
            ...oldItems,
            { author: newRec.author, content: newRec.content, last_modified: new Date().getTime() }
          ];
          transaction.update(refListenlist, { items: newItems });
          return newItems;
        })
        .then(()=> console.log("Transaction successfully committed!")
        )
        .catch((err) => console.log("Transaction failed: ", err));
      });
    });

  exports.OnUnReccomend = functions.firestore
    .document("interactions/{fid}")
    .onDelete(async (snap, context) => {
      const delRec = snap.data();
      if (delRec.type !== "listenlist") {
        console.log(`Item not of type listenlist, type ${newRec.type}, doing nothing.`)
        return;
      }

      const refListenlist = firestore
      .collection("listenlist")
      .doc(delRec.review_author + "_incoming");
      
      firestore.runTransaction(transaction => {
        return transaction.get(refListenlist).then(doc => {
          const oldItems = doc.data().items
          const newItems = oldItems.filter(
            item =>
              item.author !== delRec.author ||
              item.content.id !== delRec.content.id
          );
          transaction.update(refListenlist, { items: newItems });
          return newItems;
        })
        .then(()=> console.log("Transaction successfully committed!")
        )
        .catch((err) => console.log("Transaction failed: ", err)
        );
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
      const sum_reviews = content.sum_reviews + newReview.rating;
      const rating_nums = content.rating_nums;
      rating_nums[Number(newReview.rating)] += 1;
      ref.update({
        number_ratings: number_ratings,
        number_reviews: admin.firestore.FieldValue.increment(
          Number(newReview.is_review)
        ),
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
    const review_data_songs =
      userContent.review_data_songs || new Array(11).fill(0);
    const review_data_albums =
      userContent.review_data_albums || new Array(11).fill(0);
    const review_data_artists =
      userContent.review_data_artists || new Array(11).fill(0);
    review_data[Number(newReview.rating)] += 1;
    review_data_songs[Number(newReview.rating)] += Number(
      newReview.type === "track"
    );
    review_data_albums[Number(newReview.rating)] += Number(
      newReview.type === "album"
    );
    review_data_artists[Number(newReview.rating)] += Number(
      newReview.type === "artist"
    );
    return user.update({
      review_data,
      review_data_songs,
      review_data_albums,
      review_data_artists
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
    //updating review popularity score
    ref.update({
      sum_reviews,
      number_reviews: number_reviews || 0,
      avg: sum_reviews / content.number_ratings || 0,
      rating_nums
    });
    //updating the array of the users number of reviews
    const user = await firestore.collection("users").doc(newReview.author);
    const userContent = await user.get().then(res => res.data());
    //TODO: DELETE OR CASE ON LAUNCH
    const review_data = userContent.review_data || new Array(11).fill(0);
    const review_data_songs =
      userContent.review_data_songs || new Array(11).fill(0);
    const review_data_albums =
      userContent.review_data_albums || new Array(11).fill(0);
    const review_data_artists =
      userContent.review_data_artists || new Array(11).fill(0);
    review_data[Number(newReview.rating)] += 1;
    review_data[Number(oldReview.rating)] -= 1;
    review_data_songs[Number(newReview.rating)] += Number(
      newReview.type === "track"
    );
    review_data_songs[Number(oldReview.rating)] -= Number(
      newReview.type === "track"
    );
    review_data_albums[Number(newReview.rating)] += Number(
      newReview.type === "album"
    );
    review_data_albums[Number(oldReview.rating)] -= Number(
      newReview.type === "album"
    );
    review_data_artists[Number(newReview.rating)] += Number(
      newReview.type === "artist"
    );
    review_data_artists[Number(oldReview.rating)] -= Number(
      newReview.type === "artist"
    );

    return user.update({
      review_data,
      review_data_songs,
      review_data_albums,
      review_data_artists
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
      number_reviews: number_reviews || 0,
      avg: sum_reviews / number_ratings || 0,
      rating_nums
    });
    //updating the array of the users number of reviews
    const user = await firestore.collection("users").doc(delReview.author);
    const userContent = await user.get().then(res => res.data());
    //TODO: DELETE OR CASE ON LAUNCH
    const review_data = userContent.review_data || new Array(11).fill(0);
    const review_data_songs =
      userContent.review_data_songs || new Array(11).fill(0);
    const review_data_albums =
      userContent.review_data_albums || new Array(11).fill(0);
    const review_data_artists =
      userContent.review_data_artists || new Array(11).fill(0);
    review_data[Number(delReview.rating)] -= 1;
    review_data_songs[Number(delReview.rating)] -= Number(
      delReview.type === "track"
    );
    review_data_albums[Number(delReview.rating)] -= Number(
      delReview.type === "album"
    );
    review_data_artists[Number(delReview.rating)] -= Number(
      delReview.type === "artist"
    );
    user.update({
      review_data,
      review_data_songs,
      review_data_albums,
      review_data_artists
    });
    return await firestore
      .collection("interactions")
      .where("review", "==", snap.id)
      .get()
      .then(res => {
        var batch = firestore.batch();
        res.forEach(doc => batch.delete(doc.ref));
        return batch.commit();
      });
  });

exports.updateReviewOnAddComment = functions.firestore
  .document("comments/{did}")
  .onCreate(async (snap, context) => {
    const newComment = snap.data();
    const ref = await firestore.collection("reviews").doc(newComment.review);
    return ref.update({
      num_comments: admin.firestore.FieldValue.increment(1),
      popularity: admin.firestore.FieldValue.increment(1)
    });
  });

//delete all comments when review is deleted

exports.updateReviewOnDeleteComment = functions.firestore
  .document("comments/{did}")
  .onDelete(async (snap, context) => {
    const delComment = snap.data();
    const ref = await firestore.collection("reviews").doc(delComment.review);
    const refExists = await ref.get().then(res => res.exists);
    if (refExists)
      return ref.update({
        num_comments: admin.firestore.FieldValue.increment(-1),
        popularity: admin.firestore.FieldValue.increment(-1)
      });
    return;
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
    const token = await requestAccessToken(config.id, config.secret);
    return await firestore
      .collection("token")
      .doc("spotify")
      .set(token);
  });

// // Create and Deploy Your First Cloud Functions
//
// Deploy with: firebase deploy --only functions
// Deploy specific functions with: firebase deploy --only functions:myFunction,functions:myOtherFunction
//
// https://firebase.google.com/docs/functions/write-firebase-functions


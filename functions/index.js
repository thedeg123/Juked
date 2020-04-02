const admin = require("firebase-admin");
const functions = require("firebase-functions");

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
      created: Date.now()
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
      const number_reviews = content.number_reviews + 1;
      const sum_reviews = content.sum_reviews + newReview.rating;
      return ref.update({
        number_reviews,
        sum_reviews,
        avg: sum_reviews / number_reviews
      });
    } else {
      return ref.set({
        number_reviews: 1,
        content_id: newReview.content_id,
        sum_reviews: newReview.rating,
        avg: newReview.rating
      });
    }
  });

exports.updateContentOnEdit = functions.firestore
  .document("reviews/{rid}")
  .onUpdate(async (change, context) => {
    const newReview = change.after.data();
    const oldReview = change.before.data();
    const ref = await firestore.collection("content").doc(oldReview.content_id);
    const refContent = await ref.get().then(res => res.data());
    const sum_reviews =
      refContent.sum_reviews + newReview.rating - oldReview.rating;
    return ref.update({
      sum_reviews,
      avg: sum_reviews / refContent.number_reviews
    });
  });

exports.updateContentOnDelete = functions.firestore
  .document("reviews/{rid}")
  .onDelete(async (snap, context) => {
    const delReview = snap.data();
    const ref = await firestore.collection("content").doc(delReview.content_id);
    const refContent = await ref.get().then(res => res.data());
    const sum_reviews = refContent.sum_reviews - delReview.rating;
    const number_reviews = refContent.number_reviews - 1;
    return ref.update({
      sum_reviews,
      number_reviews,
      avg: sum_reviews / number_reviews
    });
  });

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

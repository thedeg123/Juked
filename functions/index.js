const admin = require("firebase-admin");
const functions = require("firebase-functions");
const axios = require("axios");
const { config } = require("./musicConfig.js");
const { Expo } = require("expo-server-sdk");

admin.initializeApp();

let expo = new Expo();

const firestore = admin.firestore();

exports.createDefaultUser = functions.auth.user().onCreate(user => {
  const email = user.email;
  const listenlistPersonalId = email + "_personal";
  const batch = firestore.batch();

  const userRef = firestore.collection("users").doc(email);
  const llPersonalRef = firestore
    .collection("listenlist")
    .doc(listenlistPersonalId);

  batch.set(userRef, {
    email,
    handle: "",
    bio: "",
    profile_url: "",
    created: Date.now(),
    notification_token: "",
    num_follower: 0,
    num_following: 0,
    review_data: new Array(11).fill(0),
    review_data_songs: new Array(11).fill(0),
    review_data_albums: new Array(11).fill(0),
    review_data_artists: new Array(11).fill(0)
  });
  batch.set(llPersonalRef, {
    items: [],
    incoming_item_count: 0,
    incoming_item_count_track: 0,
    incoming_item_count_album: 0,
    incoming_item_count_artist: 0,
    personal: true
  });
  return batch.commit();
});

exports.deleteUser = functions.auth.user().onDelete(async user => {
  // //deleting all reviews
  var batch = firestore.batch();
  await firestore
    .collection("reviews")
    .where("author", "==", user.email)
    .get()
    .then(res => res.forEach(doc => batch.delete(doc.ref)));
  //deleting all interactions
  await firestore
    .collection("interactions")
    .where("author", "==", user.email)
    .get()
    .then(res => res.forEach(doc => batch.delete(doc.ref)));
  await firestore
    .collection("interactions")
    .where("review_author", "==", user.email)
    .get()
    .then(res => res.forEach(doc => batch.delete(doc.ref)));
  // delete thier listenlist
  const llPersonalRef = firestore
    .collection("listenlist")
    .doc(user.email + "_personal");
  batch.delete(llPersonalRef);

  // delete the user data
  await batch.commit();

  // delete the user
  return await firestore
    .collection("users")
    .doc(user.email)
    .delete();
});

const sendPushNotification = async (uid, body) => {
  // sending a push notifcation to the author
  const pushToken = await firestore
    .collection("users")
    .doc(uid)
    .get()
    .then(res => res.data().notification_token);

  // if the user is not signed up for notifications, do nothing
  if (!pushToken || !Expo.isExpoPushToken(pushToken)) return;

  // as cloud functions dont support es6
  body.title = "Juked";
  body.to = pushToken;
  body.sound = "default";
  body.badge = 1;
  const messeges = [body];

  return await expo.sendPushNotificationsAsync(messeges);
};

const onFollow = async newFollow => {
  var batch = firestore.batch();
  const refFollowing = firestore
    .collection("users")
    .doc(newFollow.review_author);
  const refFollower = firestore.collection("users").doc(newFollow.author);
  batch.update(refFollowing, {
    num_follower: admin.firestore.FieldValue.increment(1)
  });
  batch.update(refFollower, {
    num_following: admin.firestore.FieldValue.increment(1)
  });
  batch.commit();

  return await sendPushNotification(newFollow.review_author, {
    body: `${newFollow.author_handle} followed you!`,
    data: { screen: "Profile", data: { uid: newFollow.author } }
  });
};

const onReccomend = async newRec => {
  const lid = newRec.review_author + "_personal";
  firestore
    .collection("listenlist")
    .doc(lid)
    .update({
      incoming_item_count: admin.firestore.FieldValue.increment(1),
      incoming_item_count_track: admin.firestore.FieldValue.increment(
        Number(newRec.content.type === "track")
      ),
      incoming_item_count_album: admin.firestore.FieldValue.increment(
        Number(newRec.content.type === "album")
      ),
      incoming_item_count_artist: admin.firestore.FieldValue.increment(
        Number(newRec.content.type === "artist")
      )
    });
  return await sendPushNotification(newRec.review_author, {
    body: `${newRec.author_handle} added ${newRec.content.name}${
      newRec.content.artists ? ` by ${newRec.content.artists[0].name}` : ""
    } to your listenlist`,
    data: {
      screen: "ListenList",
      data: {
        type: "incoming",
        user: { email: newRec.review_author }
      }
    }
  });
};

const onComment = async commentInteraction => {
  const rid = commentInteraction.review;
  firestore
    .collection("reviews")
    .doc(rid)
    .update({
      num_comments: admin.firestore.FieldValue.increment(1),
      popularity: admin.firestore.FieldValue.increment(1)
    });

  const contentName =
    commentInteraction.content_type === "list"
      ? `list`
      : `review of ${commentInteraction.content.name}`;

  // we dont want to send a notification to someone liking their own review
  if (commentInteraction.review_author === commentInteraction.author) return;

  return await sendPushNotification(commentInteraction.review_author, {
    body: `${commentInteraction.author_handle} commented on your ${contentName}: "${commentInteraction.text}"`,
    data: {
      screen:
        commentInteraction.content_type === "list" ? "UserList" : "Review",
      data: {
        uid: commentInteraction.review_author,
        rid: commentInteraction.review,
        content: commentInteraction.content
      }
    }
  });
};

const onLike = async likeInteraction => {
  const rid = likeInteraction.review;
  firestore
    .collection("reviews")
    .doc(rid)
    .update({
      popularity: admin.firestore.FieldValue.increment(1),
      num_likes: admin.firestore.FieldValue.increment(1)
    });

  const contentName =
    likeInteraction.content_type === "list"
      ? `list`
      : `review of ${likeInteraction.content.name}`;
  // we dont want to send a notification to someone liking their own review
  if (likeInteraction.review_author === likeInteraction.author) return;

  return await sendPushNotification(likeInteraction.review_author, {
    body: `${likeInteraction.author_handle} liked your ${contentName}`,
    data: {
      screen: likeInteraction.content_type === "list" ? "UserList" : "Review",
      data: {
        uid: likeInteraction.review_author,
        rid: likeInteraction.review,
        content: likeInteraction.content
      }
    }
  });
};

exports.onInteract = functions.firestore
  .document("interactions/{iid}")
  .onCreate(async (snap, context) => {
    const newInteraction = snap.data();
    switch (newInteraction.type) {
      case "follow":
        return onFollow(newInteraction);
      case "listenlist":
        return onReccomend(newInteraction);
      case "comment":
        return onComment(newInteraction);
      case "like":
        return onLike(newInteraction);
      default:
        return;
    }
  });

const onUnFollow = delFollow => {
  // we dont want the whole query to fail if the user has been deleted, therefore its not a batch
  firestore
    .collection("users")
    .doc(delFollow.author)
    .update({
      num_following: admin.firestore.FieldValue.increment(-1)
    });

  firestore
    .collection("users")
    .doc(delFollow.review_author)
    .update({
      num_follower: admin.firestore.FieldValue.increment(-1)
    });

  return firestore
    .collection("interactions")
    .where("author", "==", delFollow.review_author)
    .where("type", "==", "listenlist")
    .get()
    .then(res => {
      const batch = firestore.batch();
      res.forEach(doc => batch.delete(doc.ref));
      return batch.commit();
    });
};

const onUnReccomend = delRec => {
  const lid = delRec.review_author + "_personal";
  firestore
    .collection("listenlist")
    .doc(lid)
    .update({
      incoming_item_count: admin.firestore.FieldValue.increment(-1),
      incoming_item_count_track: admin.firestore.FieldValue.increment(
        -1 * Number(delRec.content.type === "track")
      ),
      incoming_item_count_album: admin.firestore.FieldValue.increment(
        -1 * Number(delRec.content.type === "album")
      ),
      incoming_item_count_artist: admin.firestore.FieldValue.increment(
        -1 * Number(delRec.content.type === "artist")
      )
    });
};

const onUnComment = commentInteraction => {
  const rid = commentInteraction.review;
  firestore
    .collection("reviews")
    .doc(rid)
    .update({
      num_comments: admin.firestore.FieldValue.increment(-1),
      popularity: admin.firestore.FieldValue.increment(-1)
    });
};

const onUnLike = likeInteraction => {
  const rid = likeInteraction.review;
  firestore
    .collection("reviews")
    .doc(rid)
    .update({
      popularity: admin.firestore.FieldValue.increment(-1),
      num_likes: admin.firestore.FieldValue.increment(-1)
    });
};

exports.onUnInteract = functions.firestore
  .document("interactions/{fid}")
  .onDelete(async (snap, context) => {
    const delInteract = snap.data();
    switch (delInteract.type) {
      case "follow":
        return onUnFollow(delInteract);
      case "listenlist":
        return onUnReccomend(delInteract);
      case "comment":
        return onUnComment(delInteract);
      case "like":
        return onUnLike(delInteract);
      default:
        return;
    }
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
    if (newReview.review_type === "list") return;
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

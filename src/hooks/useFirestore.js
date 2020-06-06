import firebase from "firebase";
import "firebase/firestore";

class useFirestore {
  constructor() {
    this.db = firebase.firestore();
    this.reviews_db = this.db.collection("reviews");
    this.follow_db = this.db.collection("follow");
    this.users_db = this.db.collection("users");
    this.content_db = this.db.collection("content");
    this.auth = firebase.auth();
    this.comments_db = this.db.collection("comments");
  }

  /**
   * @argument {String} uid - the unique id of the author whos reviews we want to get
   * @argument {String} content_id  - the unique id of the content we  want to get the reviwes of (supplied by spotifty api)
   */
  async batchRequest(db, key, ids) {
    const uids = [...new Set(ids)];
    let ret = [];
    for (let i = 0; i < uids.length; i += 10) {
      await db
        .where(
          key || firebase.firestore.FieldPath.documentId(),
          "in",
          uids.slice(i, i + 10)
        )
        .get()
        .then(res => {
          res.forEach(r => {
            return ret.push({ id: r.id, data: r.data() });
          });
        });
    }
    return ret;
  }

  // -----------------------------------------------------------------------------------------------------------
  // Authentication relations

  /**
   * @argument {String} uid - the unique id of the author whos reviews we want to get
   * @argument {String} content_id  - the unique id of the content we  want to get the reviwes of (supplied by spotifty api)
   */
  async signin(email, password) {
    return await this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => null)
      .catch(err => err.message);
  }
  fetchCurrentUID() {
    return this.auth.currentUser.email;
  }
  async signup(email, password, verifypassword) {
    if (password !== verifypassword) return "Passwords do not Match!";
    return await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => null)
      .catch(err => err.message);
  }
  async signout() {
    return await this.auth.signOut().catch(err => err.message);
  }
  async resetEmail(email) {
    return await this.auth
      .sendPasswordResetEmail(email)
      .then(() => null)
      .catch(err => err.message);
  }

  // -----------------------------------------------------------------------------------------------------------
  // Content relations

  async getContentData(cid) {
    return await this.content_db
      .doc(cid)
      .get()
      .then(content =>
        content.exists
          ? content.data()
          : {
              avg: 0,
              number_reviews: 0,
              review_nums: new Array(11).fill(0)
            }
      );
  }

  // -----------------------------------------------------------------------------------------------------------
  // Like relations

  async likeReview(rid) {
    return await this.reviews_db.doc(rid).update({
      popularity: firebase.firestore.FieldValue.increment(1),
      num_likes: firebase.firestore.FieldValue.increment(1),
      likes: firebase.firestore.FieldValue.arrayUnion(this.fetchCurrentUID())
    });
  }

  async unLikeReview(rid) {
    return await this.reviews_db.doc(rid).update({
      popularity: firebase.firestore.FieldValue.increment(-1),
      num_likes: firebase.firestore.FieldValue.increment(-1),
      likes: firebase.firestore.FieldValue.arrayRemove(this.fetchCurrentUID())
    });
  }

  // -----------------------------------------------------------------------------------------------------------
  // Review relations

  async getReview(rid) {
    return await this.reviews_db
      .doc(rid)
      .get()
      .then(review => review.data());
  }
  async addReview(cid, type, rating, text) {
    return this.reviews_db.doc(cid + this.auth.currentUser.email).set({
      author: this.auth.currentUser.email,
      content_id: cid,
      last_modified: new Date().getTime(),
      rating,
      text,
      type,
      likes: [],
      num_comments: 0,
      num_likes: 0,
      popularity: 0,
      is_review: Boolean(text.length)
    });
  }
  async updateReview(rid, cid, type, rating, text) {
    let body = {};
    typeof text == "string" ? (body["text"] = text) : null;
    rating ? (body["rating"] = rating) : null;
    body["is_review"] = text.length ? true : false;
    body["last_modified"] = new Date().valueOf();
    return this.reviews_db.doc(rid).update(body);
  }

  async deleteReview(rid) {
    return await this.reviews_db.doc(rid).delete();
  }
  async batchReviewRequest(cids) {
    return await this.batchRequest(this.reviews_db, null, cids);
  }
  async batchGetReviewsByAuthorContent(uid, cids) {
    return await this.batchRequest(
      this.reviews_db.where("author", "==", uid),
      "content_id",
      cids
    );
  }

  async getReviewsByAuthor(uid, limit = 100) {
    let ret = [];
    return await this.reviews_db
      .where("author", "==", uid)
      .orderBy("last_modified", "desc")
      .limit(limit)
      .get()
      .then(res => {
        res.forEach(r => ret.push({ id: r.id, data: r.data() }));
        return ret;
      });
  }

  async getReviewsByAuthorContent(uid, content_id) {
    return await this.reviews_db
      .doc(content_id + uid)
      .get()
      .then(res => {
        return { id: res.id, exists: res.exists, data: res.data() };
      });
  }

  async getMostPopularReviewsByType(content_id, limit = 3, start_after = null) {
    let base = this.reviews_db
      .where("content_id", "==", content_id)
      .where("is_review", "==", true)
      .orderBy("popularity", "desc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(r => {
          return { id: r.id, data: r.data() };
        }),
        res.docs.pop()
      ]);
  }

  /**
   * @argument {Boolean} review_type - if True, get reviews, false get ratings, undefined get both
   * @argument {Array} types - an array of at least one "artist", "album", "track"
   */
  async getReviewsByAuthorType(
    uid,
    types,
    limit = 100,
    review_type,
    start_after = null
  ) {
    let base = this.reviews_db
      .where("author", "==", uid)
      .orderBy("last_modified", "desc")
      .where("type", "in", types);

    if (review_type === true) {
      base = base.where("is_review", "==", true);
    } else if (review_type === false) {
      base = base.where("is_review", "==", false);
    }
    if (start_after) {
      base = base.startAfter(start_after);
    }
    return base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(r => {
          return { id: r.id, data: r.data() };
        }),
        res.docs.pop()
      ]);
  }

  /**
   * @argument {Boolean} review_type - if True, get reviews, false get ratings, undefined get both
   * @argument {Array} types - an array of at least one "artist", "album", "track"
   */
  async getReviewsByType(types, limit = 20, review_type, start_after) {
    let base = this.reviews_db
      .orderBy("last_modified", "desc")
      .where("type", "in", types);

    if (review_type === true) {
      base = base.where("is_review", "==", true);
    } else if (review_type === false) {
      base = base.where("is_review", "==", false);
    }
    if (start_after) {
      base = base.startAfter(start_after);
    }
    return base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(r => {
          return { id: r.id, data: r.data() };
        }),
        res.docs.pop()
      ]);
  }

  // -----------------------------------------------------------------------------------------------------------
  // User relations

  async getUser(uid) {
    return await this.users_db
      .doc(uid)
      .get()
      .then(user => (user.exists ? user.data() : null));
  }
  async getUserByHandle(handle) {
    return await this.users_db
      .where("handle", "==", handle)
      .limit(1)
      .get()
      .then(doc => {
        let res = [];
        doc.forEach(d => res.push(d.data()));
        return res.length ? res[0] : null;
      });
  }
  async updateUser(handle, bio, profile_url) {
    let body = {};
    handle ? (body["handle"] = handle) : null;
    bio ? (body["bio"] = bio) : null;
    profile_url ? (body["profile_url"] = profile_url) : null;
    return await this.users_db.doc(this.auth.currentUser.email).update(body);
  }
  async batchAuthorRequest(uids) {
    return await this.batchRequest(this.users_db, null, uids);
  }
  async searchUser(term) {
    return await this.users_db
      .where("handle", ">=", term)
      .where("handle", "<=", term + "\uf8ff")
      .limit(10)
      .get()
      .then(content => {
        let ret = [];
        content.forEach(element => ret.push(element.data()));
        return ret;
      });
  }

  // -----------------------------------------------------------------------------------------------------------
  // Follow relations

  async followUser(uid) {
    return await this.follow_db.doc(this.auth.currentUser.email + uid).set({
      follower: this.auth.currentUser.email,
      following: uid
    });
  }
  async unfollowUser(uid) {
    return await this.follow_db.doc(this.auth.currentUser.email + uid).delete();
  }
  async followingRelationExists(follower_uid, following_uid) {
    return await this.follow_db
      .doc(follower_uid + following_uid)
      .get()
      .then(doc => doc.exists);
  }
  /**
   * @argument {String} uid - the unique id of the user we want to get the followers of
   * @return {Set} - the set of followers UIDs.
   */
  async getFollowers(uid) {
    return await this.follow_db
      .where("following", "==", uid)
      .get()
      .then(res => {
        let ret = [];
        res.forEach(d => ret.push(d.data().follower));
        return ret;
      });
  }
  /**
   * @argument {String} uid - the unique id of the user we want to see who is following
   * @return {Set} - the set of following UIDs.
   */
  async getFollowing(uid) {
    return await this.follow_db
      .where("follower", "==", uid)
      .get()
      .then(res => {
        let ret = [];
        res.forEach(d => ret.push(d.data().following));
        return ret;
      });
  }

  // -----------------------------------------------------------------------------------------------------------
  // Comments relations
  /**
   * @argument {String} rid - the review id to get the comments for
   * @return {Array<Object>} - Array of comment objects
   */
  async getComments(rid) {
    return await this.comments_db
      .where("review", "==", rid)
      .orderBy("last_modified", "desc")
      .get()
      .then(res => {
        let ret = [];
        res.forEach(comment =>
          ret.push({ id: comment.id, data: comment.data() })
        );
        return ret;
      });
  }
  /**
   * @argument {String} rid - the review id to get the comments for
   * @argument {String} text - the text of the comment
   */
  async addComment(rid, text) {
    return await this.comments_db.add({
      author: this.fetchCurrentUID(),
      review: rid,
      last_modified: Date.now(),
      text
    });
  }
  /**
   * @argument {String} did - the unique id of the comment to delete
   */
  async deleteComment(did) {
    return await this.comments_db.doc(did).delete();
  }
}

export default useFirestore;

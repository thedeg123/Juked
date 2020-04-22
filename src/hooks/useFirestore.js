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
  }
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
  async getReviewsByAuthorContent(uid, content_id) {
    return await this.reviews_db
      .doc(content_id + uid)
      .get()
      .then(res => {
        return { id: res.id, exists: res.exists, data: res.data() };
      });
  }
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
  async getReview(rid) {
    return await this.reviews_db
      .doc(rid)
      .get()
      .then(review => review.data());
  }
  async getReviewsByAuthor(uid, limit) {
    let ret = [];
    return await this.reviews_db
      .where("author", "==", uid)
      .orderBy("last_modified", "desc")
      .limit(limit || 100)
      .get()
      .then(res => {
        res.forEach(r => ret.push({ id: r.id, data: r.data() }));
        return ret;
      });
  }
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
  async getMostRecentReviews(limit) {
    return await this.reviews_db
      .orderBy("last_modified", "desc")
      .limit(limit)
      .get()
      .then(content => {
        let ret = [];
        content.forEach(element =>
          ret.push({ id: element.id, data: element.data() })
        );
        return ret;
      });
  }
  async batchAuthorRequest(uids) {
    return await this.batchRequest(this.users_db, null, uids);
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
  async addReview(cid, type, title, rating, text) {
    return this.reviews_db.doc(cid + this.auth.currentUser.email).set({
      author: this.auth.currentUser.email,
      content_id: cid,
      last_modified: new Date().getTime(),
      rating,
      text,
      title,
      type,
      is_review: Boolean(title.length)
    });
  }
  async updateReview(rid, cid, type, title, rating, text) {
    let body = {};
    typeof text == "string" ? (body["text"] = text) : null;
    typeof title == "string" ? (body["title"] = title) : null;
    rating ? (body["rating"] = rating) : null;
    body["is_review"] = title ? true : false;
    body["last_modified"] = new Date().valueOf();
    return this.reviews_db.doc(rid).update(body);
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
  async followUser(uid) {
    return await this.follow_db.doc(this.auth.currentUser.email + uid).set({
      follower: this.auth.currentUser.email,
      following: uid
    });
  }
  async unfollowUser(uid) {
    return await this.follow_db.doc(this.auth.currentUser.email + uid).delete();
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
        let ret = new Set();
        res.forEach(d => ret.add(d.data().follower));
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
        let ret = new Set();
        res.forEach(d => ret.add(d.data().following));
        return ret;
      });
  }
}
export default useFirestore;

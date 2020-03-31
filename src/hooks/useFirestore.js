import firebase from "firebase";
import "firebase/firestore";
import firestore from "../api/firestore";

class useFirestore {
  constructor() {
    this.db = firebase.firestore();
    this.reviews_db = this.db.collection("reviews");
    this.users_db = this.db.collection("users");
    this.auth = firebase.auth();
  }
  /**
   * @argument {String} uid - the unique id of the author whos reviews we want to get
   * @argument {String} content_id  - the unique id of the content we  want to get the reviwes of (supplied by spotifty api)
   */
  async signin(email, password) {
    return await this.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        return null;
      })
      .catch(err => err.message);
  }
  async signup(email, password, verifypassword) {
    //TODO: change creation of profile to cloud function on backend
    if (password !== verifypassword) return "Passwords do not Match!";
    return await this.auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => this.addNewUser(email).catch(err => err.message))
      .then(() => {
        return null;
      })
      .catch(err => err.message);
  }
  async signout() {
    return await this.auth.signOut().catch(err => err.message);
  }
  async addNewUser(email) {
    //TODO: change to cloud function on backend
    return await this.users_db
      .doc(email)
      .set({
        email,
        handle: "",
        bio: "",
        profile_url: "",
        created: Date.now(),
        followers: [],
        following: []
      })
      .catch(err => err.message);
  }
  async getReviewsByAuthorContent(uid, content_id) {
    let ret = [];
    return await this.reviews_db
      .where("author", "==", uid)
      .where("content_id", "==", content_id)
      .get()
      .then(res => {
        res.forEach(r => ret.push({ id: r.id, data: r.data() }));
        return ret;
      });
  }
  async getReview(rid) {
    return await this.reviews_db
      .doc(rid)
      .get()
      .then(review => review.data());
  }
  async getReviewsByAuthor(uid) {
    let ret = [];
    return await this.reviews_db
      .where("author", "==", uid)
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
          ret.push({ id: element.id, review: element.data() })
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
    return this.reviews_db.doc().set({
      author: this.auth.currentUser.email,
      content_id: cid,
      last_modified: new Date().getTime(),
      rating,
      text,
      title,
      type
    });
  }
  async updateReview(rid, cid, type, title, rating, text) {
    let body = {};
    text ? (body["text"] = text) : null;
    title ? (body["title"] = title) : null;
    rating ? (body["rating"] = rating) : null;
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
}
const useFirestore2 = {
  updateUser: (
    uid,
    email,
    handle,
    bio,
    profile_url,
    follow = null,
    unfollow = null
  ) => {
    const body = {};
    email ? (body["email"] = email) : null;
    bio ? (body["bio"] = bio) : null;
    profile_url ? (body["profile_url"] = profile_url) : null;
    handle ? (body["handle"] = handle) : null;
    firestore
      .post("/updateuser", {
        uid,
        body,
        follow,
        unfollow
      })
      .catch(err => console.log(err));
  },
  getUser: async uid => {
    const response = await firestore.get(`/getuser/${uid}`);
    return response.data;
  },
  getUserByHandle: async handle => {
    const response = await firestore.get(`/getuserbyhandle/${handle}`);
    return response.data;
  },
  getReviewsByAuthorContent: (uid, content_id) => {
    return null;
  },
  addReview: (
    text = "",
    type = "",
    content_id = "",
    title = "",
    author = "",
    rating = null
  ) => {
    if (!["album", "artist", "playlist", "track"].includes(type))
      throw 'Value  of type is not valid, ensure it is one of: "album", "artist", "playlist", "track"';
    if (rating > 10 || rating < 0)
      throw "Value  of rating is not valid, ensure it is below 10 and above 0";
    firestore.post("/addreview", {
      body: {
        text,
        last_modified: Date.now(),
        type,
        content_id,
        title,
        author,
        rating: Math.floor(rating)
      }
    });
  },
  updateReview: (rid, text, type, content_id, title, author, rating) => {
    if (!["album", "artist", "playlist", "track"].includes(type))
      throw 'Value  of type is not valid, ensure it is one of: "album", "artist", "playlist", "track"';
    if (rating > 10 || rating < 0)
      throw "Value  of rating is not valid, ensure it is below 10 and above 0";
    const body = {};
    text ? (body["text"] = text) : null;
    type ? (body["type"] = type) : null;
    content_id ? (body["content_id"] = content_id) : null;
    title ? (body["title"] = title) : null;
    author ? (body["author"] = author) : null;
    rating ? (body["rating"] = Math.floor(rating)) : null;
    body["last_modified"] = Date.now();
    firestore.post("/updatereview", {
      rid,
      body
    });
  },
  deleteReview: rid => {
    firestore.post(`/deletereview`, { rid }).catch(err => console.log(err));
  },
  getReviewById: async rid => {
    const response = await firestore.get(`/getreviewbyid/${rid}`);
    return response.data;
  },
  getReviewsByAuthor: async uid => {
    const response = await firestore.get(`/getreviewsbyauthor/${uid}`);
    return response.data.query;
  },
  getReviewsByContent: async content_id => {
    const response = await firestore.get(`/getreviewsbycontent/${content_id}`);
    return response.data.review;
  },
  getMostRecentReviews: async limit => {
    const response = await firestore.get(`/getmostrecentreviews/${limit}`);
    return response.data.query;
  }
};

export default useFirestore;

import firestore from "../api/firestore";

const useFirestore = {
  addUser: (uid, handle = "", bio = "", profile_url = "") => {
    firestore
      .post("/adduser", {
        uid,
        body: {
          following: [],
          handle,
          created: Date.now(),
          email: uid,
          bio,
          followers: [],
          profile_url
        }
      })
      .catch(err => console.log(err));
  },
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
    return response.data.user;
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
    body[last_modified] = Date.now();
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
    return response.data.review;
  },
  getReviewsByAuthor: async uid => {
    const response = await firestore.get(`/getreviewsbyauthor/${uid}`);
    return response.data.review;
  },
  getReviewsByContent: async content_id => {
    const response = await firestore.get(`/getreviewsbycontent/${content_id}`);
    return response.data.review;
  },
  /**
   * @argument {String} uid - the unique id of the author whos reviews we want to get
   * @argument {String} content_id  - the unique id of the content we  want to get the reviwes of (supplied by spotifty api)
   */
  getReviewsByAuthorContent: async (uid, content_id) => {
    const response = await firestore.get(
      `/getreviewsbyauthorcontent/${uid}/${content_id}`
    );
    return response.data.review;
  }
};

export default useFirestore;

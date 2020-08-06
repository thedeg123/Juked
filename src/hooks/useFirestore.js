import firebase from "firebase";
import "firebase/firestore";

class useFirestore {
  constructor() {
    this.db = firebase.firestore();
    this.reviews_db = this.db.collection("reviews");
    this.users_db = this.db.collection("users");
    this.content_db = this.db.collection("content");
    this.interactions_db = this.db.collection("interactions");
    this.auth = firebase.auth();
    this.listen_list_db = this.db.collection("listenlist");
    this.cachedListenList = null;
    this.cachedLiteUsers = {};
    this.userFollowingIds = null;
    this.userFollowerIds = null;
    this.removers = [];
  }

  async disconnect() {
    return this.removers.forEach(async remove =>
      remove ? await remove() : null
    );
  }

  /**
   * @argument {String} uid - the unique id of the author whos reviews we want to get
   * @argument {String} content_id  - the unique id of the content we  want to get the reviwes of (supplied by spotifty api)
   */
  async batchRequest(db, key, ids) {
    if (!ids || !ids.length) return [];
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

  fetchCurrentUser() {
    return this.auth.currentUser;
  }

  async fetchCurrentUserData() {
    return await this.getUser(this.fetchCurrentUID());
  }

  async signup(email, password, verifypassword) {
    if (password !== verifypassword) return "Passwords do not match";
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

  async updatePassword(old_password, new_password) {
    let error = null;
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.auth.currentUser.email,
      old_password
    );
    error = await this.auth.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => null)
      .catch(err => err.message);
    if (!error)
      error = await this.auth.currentUser
        .updatePassword(new_password)
        .then(() => error)
        .catch(err => err.message);
    return error;
  }

  async deleteAccount(old_password) {
    let error = null;
    const credential = firebase.auth.EmailAuthProvider.credential(
      this.auth.currentUser.email,
      old_password
    );
    error = await this.auth.currentUser
      .reauthenticateWithCredential(credential)
      .then(() => null)
      .catch(err => err.message);
    if (!error)
      error = await this.auth.currentUser
        .delete()
        .then(() => error)
        .catch(err => err.message);
    return error;
  }

  // -----------------------------------------------------------------------------------------------------------
  // Helpful listeners
  listenToContentandReview(cid, setContent, setReview) {
    const rid = cid + this.fetchCurrentUID();
    const content_remover = this.content_db
      .doc(cid)
      .onSnapshot(res =>
        setContent(res.exists ? res.data() : this.getDummyContentObject())
      );
    const review_remover = this.reviews_db
      .doc(rid)
      .onSnapshot(res =>
        setReview(res.exists ? { data: res.data(), id: res.id } : null)
      );
    return [content_remover, review_remover];
  }
  // -----------------------------------------------------------------------------------------------------------
  // Content relations

  async getContentData(cid) {
    return await this.content_db
      .doc(cid)
      .get()
      .then(content =>
        content.exists ? content.data() : this.getDummyContentObject()
      );
  }

  getDummyContentObject() {
    return {
      avg: 0,
      number_reviews: 0,
      review_nums: new Array(11).fill(0)
    };
  }

  // -----------------------------------------------------------------------------------------------------------
  // Interaction relations

  /**
   * @argument {Number} limit - the number of items to return per batch
   * @argument {Object} start_after - pagination object
   */
  async getUserInteractions(limit = 10, start_after = null) {
    let base = this.interactions_db
      .where("review_author", "==", this.fetchCurrentUID())
      .orderBy("last_modified", "desc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(interaction => {
          return { id: interaction.id, data: interaction.data() };
        }),
        res.docs.pop()
      ]);
  }

  // -----------------------------------------------------------------------------------------------------------
  // Like relations

  /**
   * @argument {String} rid - the review id to get the comments for
   * @return {Array<Object>} - Array of comment objects
   */
  async getLikes(rid) {
    return await this.interactions_db
      .where("type", "==", "like")
      .where("review", "==", rid)
      .orderBy("last_modified", "desc")
      .get()
      .then(res => {
        let ret = [];
        res.forEach(like => ret.push({ id: like.id, data: like.data() }));
        return ret;
      });
  }
  /**
   * @argument {Number} limit - the number of items to return per batch
   * @argument {Object} start_after - pagination object
   */
  async getUserLikes(limit = 10, start_after = null) {
    let base = this.interactions_db
      .where("type", "==", "like")
      .where("review_author", "==", this.fetchCurrentUID())
      .orderBy("last_modified", "desc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(like => {
          return { id: like.id, data: like.data() };
        }),
        res.docs.pop()
      ]);
  }
  async userLikesReview(rid) {
    const lid = rid + this.fetchCurrentUID();
    return await this.interactions_db
      .doc(lid)
      .get()
      .then(res => res.exists);
  }

  likeReview(rid, review_author, content = {}) {
    const lid = rid + this.fetchCurrentUID();
    this.reviews_db.doc(rid).update({
      popularity: firebase.firestore.FieldValue.increment(1),
      num_likes: firebase.firestore.FieldValue.increment(1)
    });
    return this.interactions_db.doc(lid).set({
      author: this.fetchCurrentUID(),
      last_modified: Date.now(),
      review: rid,
      type: "like",
      review_author,
      content
    });
  }

  unLikeReview(rid) {
    const lid = rid + this.fetchCurrentUID();
    this.reviews_db.doc(rid).update({
      popularity: firebase.firestore.FieldValue.increment(-1),
      num_likes: firebase.firestore.FieldValue.increment(-1)
    });
    return this.interactions_db.doc(lid).delete();
  }

  // -----------------------------------------------------------------------------------------------------------
  // ListenList relations

  async establishCachedContent() {
    this._establishUserFollowIds("author");
    this._establishUserFollowIds("review_author");
    return await this._establisCachedListenList();
  }

  _establishUserFollowIds(type) {
    const remover = this.interactions_db
      .where("type", "==", "follow")
      .where(type, "==", this.fetchCurrentUID())
      .onSnapshot(snap => {
        const ret = [];
        snap.forEach(d =>
          ret.push(d.data()[type === "author" ? "review_author" : "author"])
        );
        if (type === "author") {
          this.userFollowingIds = ret;
        } else {
          this.userFollowerIds = ret;
        }
      });
    return this.removers.push(remover);
  }

  async _establisCachedListenList() {
    return (this.cachedListenList = await this.listen_list_db
      .doc(this.fetchCurrentUID() + "_personal")
      .get()
      .then(res => res.data()));
  }

  getCachedListenList() {
    return this.cachedListenList;
  }

  contentInlistenList(cid) {
    const list = this.getCachedListenList();
    return !!list.items.find(item => item.content.id === cid);
  }

  /**
   * @description returns if the current user has added this piece of content to a follower's listenlist
   * @param {String} cid - the unique id of the content in question
   * @param {String} uid - the follower's unique Id
   * @return {Boolean} - if the user has reccomended this content to a follower
   */
  async contentReccomendedToFollower(cid, uid) {
    const id = cid + uid;
    return await this.interactions_db
      .doc(id)
      .get()
      .then(res => res.exists);
  }

  /**
   * @description reccomends the given content to the follower by adding it to their incoming listenlist and updating
   * their outgoing listenlist on the backend we and the personal listenlist on the successful write
   * @param {Object} content - the content object we're reccomending
   * @param {String} uid - the follower's unique Id
   */
  async reccomendContentToFollower(content, uid) {
    const lid = content.id + uid;
    const notification_item = {
      author: this.fetchCurrentUID(),
      last_modified: Date.now(),
      type: "listenlist",
      review_author: uid,
      genres: content.genres,
      content_type: content.type,
      content: content
    };

    return await this.interactions_db.doc(lid).set(notification_item);
  }

  /**
   * @description deletes the reccomendation of the given content to the follower by removing it from their outgoing
   * listenlist and deleting the notification object on the backend we update the incoming listenlist
   * of this object
   * @param {Object} content - the content object we're reccomending
   * @param {String} uid - the follower's unique Id
   */
  async unreccomendContentToFollower(content, uid) {
    const lid = content.id + uid;
    return await this.interactions_db.doc(lid).delete();
  }

  async _updatePersonalListenList(content, remove) {
    const uid = this.fetchCurrentUID() + "_personal";
    const item = {
      content,
      genres: content.genres,
      content_type: content.type,
      last_modified: new Date().getTime()
    };
    this.cachedListenList.items = this.cachedListenList.items.filter(
      item => item.content.id != content.id
    );
    if (!remove) {
      this.cachedListenList.items = [...this.cachedListenList.items, item];
    }
    return this.listen_list_db.doc(uid).update({
      items: this.cachedListenList.items
    });
  }

  async getIncomingListenlist(
    uid,
    limit = 3,
    start_after = null,
    newestFirst = true,
    filterTypes = ["track", "album", "artist"]
  ) {
    let base = this.interactions_db
      .where("type", "==", "listenlist")
      .where("review_author", "==", uid)
      .where("content_type", "in", filterTypes)
      .orderBy("last_modified", newestFirst ? "desc" : "asc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [res.docs.map(r => r.data()), res.docs.pop()]);
  }

  async getPersonalListenlist(
    uid = firestore.fetchCurrentUID(),
    newestFirst = true,
    filterTypes = ["track", "album", "artist"]
  ) {
    // If we dont want to update numbers on prof screen
    // if (uid === this.fetchCurrentUID()) return this.getCachedListenList();
    const type = "personal";
    const lid = uid + "_" + type;
    return await this.listen_list_db
      .doc(lid)
      .get()
      .then(res => {
        const ret = res.data();
        ret.items = ret.items
          .sort((a, b) =>
            newestFirst
              ? a.last_modified < b.last_modified
              : a.last_modified > b.last_modified
          )
          .filter(item => filterTypes.includes(item.content_type));
        return ret;
      });
  }
  async addToPersonalListenlist(content) {
    return await this._updatePersonalListenList(content, false);
  }

  async removeFromPersonalListenlist(content) {
    return await this._updatePersonalListenList(content, true);
  }

  // -----------------------------------------------------------------------------------------------------------
  // List relations
  async addList(title, description, items, itemKeys) {
    const body = {
      author: this.auth.currentUser.email,
      last_modified: new Date().getTime(),
      num_comments: 0,
      num_likes: 0,
      popularity: 0,
      type: "list",
      title,
      description: description || "",
      itemKeys: [...itemKeys],
      items,
      review_type: "list"
    };
    return this.reviews_db.add(body);
  }

  async getList(lid) {
    return await this.reviews_db
      .doc(lid)
      .get()
      .then(list => {
        list.exists ? (list["itemKeys"] = new Set(list["itemKeys"])) : null;
        return { id: list.id, data: list.data() };
      });
  }

  async updateList(lid, title, description, items, itemKeys) {
    let body = {};
    typeof title == "string" ? (body["title"] = title) : null;
    typeof description == "string" ? (body["description"] = description) : null;
    items ? (body["items"] = items) : null;
    itemKeys ? (body["itemKeys"] = [...itemKeys]) : null;
    body["last_modified"] = new Date().valueOf();
    return this.reviews_db.doc(lid).update(body);
  }

  async deleteList(rid) {
    return await this.reviews_db.doc(lid).delete();
  }
  // -----------------------------------------------------------------------------------------------------------
  // Review relations

  async getReview(rid) {
    return await this.reviews_db
      .doc(rid)
      .get()
      .then(review => {
        return { id: review.id, data: review.data() };
      });
  }

  async addReview(cid, type, content, rating, text) {
    const is_review = Boolean(text.length);
    const review_type = type + "_" + (is_review ? "review" : "rating");
    return this.reviews_db.doc(cid + this.auth.currentUser.email).set({
      author: this.auth.currentUser.email,
      content_id: cid,
      content,
      last_modified: new Date().getTime(),
      rating,
      text,
      type,
      num_comments: 0,
      num_likes: 0,
      popularity: 0,
      is_review,
      review_type
    });
  }

  async updateReview(rid, cid, type, rating, text) {
    const is_review = Boolean(text.length);
    const review_type = type + "_" + (is_review ? "review" : "rating");
    let body = {};
    typeof text == "string" ? (body["text"] = text) : null;
    rating || rating === 0 ? (body["rating"] = rating) : null;
    body["is_review"] = is_review;
    body["review_type"] = review_type;
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

  _processDocs = res =>
    res.docs.map(r => {
      return { id: r.id, data: r.data() };
    });
  /**
   * @argument {Boolean} review_type - if True, get reviews, false get ratings, undefined get both
   * @argument {Array} types - an array of at least one "artist", "album", "track"
   */
  async getReviewsByAuthorType(uid, types, limit = 20, start_after = null) {
    let base = this.reviews_db
      .where("author", "==", uid)
      .orderBy("last_modified", "desc")
      .where("review_type", "in", types);

    if (start_after) {
      base = base.startAfter(start_after);
    }

    return await base
      .limit(limit)
      .get()
      .then(res => [this._processDocs(res), res.docs.pop()]);
  }

  /**
   * @argument {Boolean} review_type - if True, get reviews, false get ratings, undefined get both
   * @argument {Array} types - an array of at least one "artist", "album", "track"
   */
  listenToReviewsByAuthorType(uid, types, limit = 20, setReviews) {
    let base = this.reviews_db
      .where("author", "==", uid)
      .orderBy("last_modified", "desc")
      .where("review_type", "in", types);

    return base
      .limit(limit)
      .onSnapshot(snap => setReviews(this._processDocs(snap)));
  }

  /**
   * @argument {Boolean} review_type - if True, get reviews, false get ratings, undefined get both
   * @argument {Array} types - an array of at least one "artist", "album", "track"
   */
  async getReviewsByType(types, limit = 20, start_after) {
    let base = this.reviews_db
      .orderBy("last_modified", "desc")
      .where("review_type", "in", types);
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

  saveLiteUser(user) {
    this.cachedLiteUsers[user.email] = {
      handle: user.handle,
      email: user.email,
      profile_url: user.profile_url
    };
  }

  async getUser(uid, liteUser = true) {
    if (this.cachedLiteUsers[uid] && liteUser) {
      return this.cachedLiteUsers[uid];
    }
    const user = await this.users_db
      .doc(uid)
      .get()
      .then(res => (res.exists ? res.data() : null));
    if (user) this.saveLiteUser(user);
    return user;
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
    typeof handle === "string" ? (body["handle"] = handle) : null;
    typeof bio === "string" ? (body["bio"] = bio) : null;
    typeof profile_url === "string"
      ? (body["profile_url"] = profile_url)
      : null;
    return await this.users_db.doc(this.auth.currentUser.email).update(body);
  }
  async batchAuthorRequest(uids, liteUser = true, returnObj = true) {
    const set_uids = new Set(uids);
    const ret_list = [];
    const ret = {};
    if (liteUser) {
      uids.forEach(id => {
        if (this.cachedLiteUsers[id]) {
          if (returnObj) {
            ret[id] = this.cachedLiteUsers[id];
          } else {
            ret_list.push(this.cachedLiteUsers[id]);
          }
          set_uids.delete(id);
        }
      });
    }
    return await this.batchRequest(
      this.users_db,
      null,
      Array.from(set_uids)
    ).then(res => {
      res.forEach(r => this.saveLiteUser(r.data));
      if (!returnObj) return [...ret_list, ...res];
      res.forEach(r => (ret[r.id] = r.data));
      return ret;
    });
  }
  async searchUser(term) {
    return await this.users_db
      .where("handle", ">=", term)
      .where("handle", "<=", term + "\uf8ff")
      .limit(10)
      .get()
      .then(content => {
        let ret = [];

        content.forEach(element => {
          const user = element.data();
          if (user) this.saveLiteUser(user);
          ret.push(user);
        });
        return ret;
      });
  }

  // -----------------------------------------------------------------------------------------------------------
  // Follow relations

  // follower = author
  // following = review_author
  async followUser(uid) {
    return await this.interactions_db
      .doc(this.auth.currentUser.email + uid)
      .set({
        author: this.auth.currentUser.email,
        review_author: uid,
        last_modified: Date.now(),
        type: "follow"
      });
  }
  async unfollowUser(uid) {
    return await this.interactions_db
      .doc(this.auth.currentUser.email + uid)
      .delete();
  }
  async followingRelationExists(follower_uid, following_uid) {
    return await this.interactions_db
      .doc(follower_uid + following_uid)
      .get()
      .then(doc => doc.exists);
  }

  /**
   * @description - returns the complete user objects for each person the user is following
   * @argument {Number} user - the user unique ID
   * @argument {Object} start_after - pagination object
   */
  async getUserFollowingObjects(user, liteUser = true) {
    return await this.getFollowing(user).then(res =>
      this.batchAuthorRequest(res, liteUser, false)
    );
  }

  /**
   * @description - returns the complete user objects for each follower
   * @argument {Number} user - the user unique ID
   * @argument {Object} start_after - pagination object
   */
  async getUserFollowersObjects(user, liteUser = true) {
    return await this.getFollowers(user).then(res =>
      this.batchAuthorRequest(res, liteUser, false)
    );
  }

  /**
   * @argument {Number} limit - the number of items to return per batch
   * @argument {Object} start_after - pagination object
   */
  async getUserFollows(limit = 10, start_after = null) {
    let base = this.follow_db
      .where("review_author", "==", this.fetchCurrentUID())
      .orderBy("last_modified", "desc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(follow => {
          return { id: follow.id, data: follow.data() };
        }),
        res.docs.pop()
      ]);
  }
  /**
   * @argument {String} uid - the unique id of the user we want to get the followers of
   * @return {Set} - the set of followers UIDs.
   */
  async getFollowers(uid) {
    if (uid === this.fetchCurrentUID() && this.userFollowerIds) {
      console.log("using cache2");
      return this.userFollowerIds;
    }
    return await this.interactions_db
      .where("type", "==", "follow")
      .where("review_author", "==", uid)
      .get()
      .then(res => {
        let ret = [];
        res.forEach(d => ret.push(d.data().author));
        return ret;
      });
  }
  /**
   * @argument {String} uid - the unique id of the user we want to see who is following
   * @return {Set} - the set of following UIDs.
   */
  async getFollowing(uid) {
    if (uid === this.fetchCurrentUID() && this.userFollowingIds) {
      console.log("using cache");
      return this.userFollowingIds;
    }
    return await this.interactions_db
      .where("type", "==", "follow")
      .where("author", "==", uid)
      .get()
      .then(res => {
        let ret = [];
        res.forEach(d => ret.push(d.data().review_author));
        return ret;
      });
  }

  // -----------------------------------------------------------------------------------------------------------
  // Comments relations
  /**
   * @argument {String} rid - the review id to get the comments for
   * @return {Array<Object>} - Array of comment objects
   */
  getComments(rid, setComments) {
    const base = this.interactions_db
      .where("type", "==", "comment")
      .where("review", "==", rid)
      .orderBy("last_modified", "desc");

    const processRes = res => {
      let ret = [];
      res.forEach(comment =>
        ret.push({ id: comment.id, data: comment.data() })
      );
      return ret;
    };

    if (!setComments) {
      return base.get().then(res => processRes(res));
    }

    return base.onSnapshot(res => setComments(processRes(res)));
  }
  /**
   * @argument {Number} limit - the number of items to return per batch
   * @argument {Object} start_after - pagination object
   */
  async getUserComments(limit = 10, start_after = null) {
    let base = this.interactions_db
      .where("type", "==", "like")
      .where("review_author", "==", this.fetchCurrentUID())
      .orderBy("last_modified", "desc");
    if (start_after) base = base.startAfter(start_after);
    return await base
      .limit(limit)
      .get()
      .then(res => [
        res.docs.map(comment => {
          return { id: comment.id, data: comment.data() };
        }),
        res.docs.pop()
      ]);
  }
  /**
   * @argument {String} rid - the review id to get the comments for
   * @argument {String} text - the text of the comment
   * @argument {Object} content - the assoceated content object
   */
  async addComment(rid, review_author, text, content = {}) {
    return await this.interactions_db.add({
      author: this.fetchCurrentUID(),
      review: rid,
      type: "comment",
      last_modified: Date.now(),
      content,
      review_author,
      text
    });
  }
  /**
   * @argument {String} did - the unique id of the comment to delete
   */
  async deleteComment(did) {
    return await this.interactions_db.doc(did).delete();
  }
}

export default useFirestore;

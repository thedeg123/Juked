const express = require("express");
const admin = require("firebase-admin");
const credentials = require("../../api/juked-1-firebase-admin-cred");

const router = express.Router();

//hooking up to firestore
admin.initializeApp({ credential: admin.credential.cert(credentials) });
let db = admin.firestore();
let users = db.collection("users");

/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key }
 * @param {Object} req - the outgoing response
 */
router.get("/getuserbyhandle/:handle", async (req, res) => {
  const usersByHandle = await users
    .where("handle", "==", req.params.handle)
    .get();
  let ret = [];
  usersByHandle.forEach(user => ret.push(user.data()));
  return res.status(200).send(ret);
});

/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key }
 * @param {Object} req - the outgoing response
 */
router.get("/getuser/:uid", async (req, res) => {
  const user = await users
    .doc(req.params.uid)
    .get()
    .then(user => user.data());
  return res.status(200).send(user);
});
/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key }
 * @param {Object} req - the outgoing response
 */
router.post("/deleteuser", (req, res) => {
  // TODO
  return res.send('{"status": 404}');
});
/**
 * @param {Object} res - the incoming HTTP request - { uid: database_key, #REQUIRED
 *                                                     body: information to add, #OPTIONAL
 *                                                     follow: uid, #OPTIONAL
 *                                                     unfollow: uid, #OPTIONAL
 *                                                    }
 * @param {Object} req - the outgoing response
 */
router.post("/updateuser", async (req, res) => {
  const user = users.doc(req.body.uid);
  if (req.body.body) user.update(req.body.body);

  const [to_follow, to_unfollow] = [req.body.follow, req.body.unfollow];
  let RESPONSE = '{"status": 200}';
  if (to_follow) {
    user.update({
      following: admin.firestore.FieldValue.arrayUnion(to_follow)
    });
    await users
      .doc(to_follow)
      .update({
        followers: admin.firestore.FieldValue.arrayUnion(req.body.uid)
      })
      .catch(err => {
        switch (err.code) {
          case 5:
            RESPONSE = `{"error": "No user found with id:${to_follow ||
              to_unfollow}", "code": 404}`;
            break;
          default:
            RESPONSE = '{"error": something went wrong :(, "code": 400)}';
            break;
        }
      });
  }
  if (to_unfollow) {
    user.update({
      following: admin.firestore.FieldValue.arrayRemove(to_unfollow)
    });
    await users
      .doc(to_unfollow)
      .update({
        followers: admin.firestore.FieldValue.arrayRemove(req.body.uid)
      })
      .catch(err => {
        switch (err.code) {
          case 5:
            RESPONSE = `{"error": "No user found with id:${to_follow ||
              to_unfollow}", "code": 404}`;
            break;
          default:
            RESPONSE = '{"error": "something went wrong :(", "code": 400)}';
            break;
        }
      });
  }
  return res.status(200).send(RESPONSE);
});
/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key, body: information to add }
 * @param {Object} req - the outgoing response
 */
router.post("/adduser", (req, res) => {
  users.doc(req.body.uid).set(req.body.body);
  return res.status(200).send('{"status": 200}');
});

module.exports = router;

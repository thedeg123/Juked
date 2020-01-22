const express = require("express");
const admin = require("firebase-admin");
const credentials = require("../../api/juked-1-firebase-admin-cred.json");

const router = express.Router();

//hooking up to firestore
let db = admin.firestore();

let reviews = db.collection("reviews");

/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key<as given by user id>,content_id: database_key<as given by spotify content> }
 * @param {Object} req - the outgoing response
 */
router.get("/getreviewsbyauthorcontent/:uid/:content_id", async (req, res) => {
  const content = await reviews
    .where("author", "==", req.params.uid)
    .where("content_id", "==", req.params.content_id)
    .get();
  let ret = [];
  content.forEach(element =>
    ret.push({ id: element.id, review: element.data() })
  );
  return res.status(200).send({ query: ret });
});

/**
 * @param {Object} res - the incoming HTTP request - {content_id: database_key<as given by spotify content> }
 * @param {Object} req - the outgoing response
 */
router.get("/getreviewsbycontent/:content_id", async (req, res) => {
  const content = await reviews
    .where("content_id", "==", req.params.content_id)
    .get();
  let ret = [];
  content.forEach(element =>
    ret.push({ id: element.id, review: element.data() })
  );
  return res.status(200).send({ query: ret });
});
/**
 * @param {Object} res - the incoming HTTP request - {uid: database_key<as given by user id>  }
 * @param {Object} req - the outgoing response
 */
router.get("/getreviewsbyauthor/:uid", async (req, res) => {
  const content = await reviews.where("author", "==", req.params.uid).get();
  let ret = [];
  content.forEach(element =>
    ret.push({ id: element.id, review: element.data() })
  );
  return res.status(200).send({ query: ret });
});
/**
 * @param {Object} res - the incoming HTTP request - {rid: database_key }
 * @param {Object} req - the outgoing response
 */
router.get("/getreviewbyid/:rid", async (req, res) => {
  reviews
    .doc(req.params.rid)
    .get()
    .then(review =>
      res.status(200).send(`{review: ${JSON.stringify(review.data())}}`)
    );
});
/**
 * @param {Object} res - the incoming HTTP request - {rid: database_key }
 * @param {Object} req - the outgoing response
 */
router.post("/deletereview", (req, res) => {
  reviews
    .doc(req.body.rid)
    .delete()
    .catch(err =>
      res.status(400).send('{"error": something went wrong :(, "code": 400)}')
    )
    .then(() => res.status(200).send("{status: 200}"));
});
/**
 * @param {Object} res - the incoming HTTP request - {rid: database_key, body: information to update }
 * @param {Object} req - the outgoing response
 */
router.post("/updatereview", (req, res) => {
  const review = reviews.doc(req.body.rid);
  if (req.body.body && Object.keys(req.body.body).length) {
    review
      .update(req.body.body)
      .then(() => res.status(200).send('{"status": 200}'));
  } else {
    return res
      .status(400)
      .send('{"error": No content to replace was given, "code": 400)}');
  }
});
/**
 * @param {Object} res - the incoming HTTP request - {body: information to add }
 * @param {Object} req - the outgoing response
 */
router.post("/addreview", (req, res) => {
  reviews
    .add(req.body.body)
    .then(() => res.status(200).send('{"status": 200}'));
});

module.exports = router;

import { Buffer } from "buffer";
const axios = require("axios").default;

/**
 * @async
 * @function requestAccessToken
 * @param {string} id - client id
 * @param {string} secret - client secret
 * @return {Promise<Object>} - {access_token, token_type, expire_in}
 */
const requestAccessToken = async (id, secret) => {
  try {
    let buff = Buffer.from(id + ":" + secret);
    let base64data = buff.toString("base64");
    const postRequestBody = {
      grant_type: "client_credentials"
    };
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
    return error;
  }
};

/**
 * @async
 * @function requestAPI
 * @param {Object} accessToken - accessToken object resolved from requestAccessToken
 * @param {string} path - request path
 * @return {Promise<Object>} - the data object of the request
 */
const requestAPI = async (accessToken, path) => {
  try {
    const authHeader = {
      Authorization: accessToken.token_type + " " + accessToken.access_token
    };
    const response = await axios.get(path, { headers: authHeader });
    return response.data;
  } catch (error) {
    return error;
  }
};

// Example: get the data of a track(the same as the docs, step 2)
const id = "CLIENT_ID";
const secret = "CLIENT_SECRET";
requestAccessToken(id, secret)
  .then(accessToken =>
    requestAPI(
      accessToken,
      "https://api.spotify.com/v1/tracks/2TpxZ7JUBn3uw46aR7qd6V"
    )
  )
  .then(result => console.log(result));

export { requestAccessToken, requestAPI };

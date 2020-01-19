import { useState, useEffect, useReducer } from "react";
import config from "../api/musicConfig";
import { Buffer } from "buffer";
import axios from "axios";

export default () => {
  const [songs, setSongs] = useState(null);
  const [search, setSearch] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [err, setErr] = useState("");
  const BASE_PATH = "https://api.spotify.com/v1";

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
      console.error("FROM REQUEST TOKEN:", error);
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

  const requestAPI = async (accessToken, path, params) => {
    try {
      const authHeader = {
        Authorization: accessToken.token_type + " " + accessToken.access_token
      };
      const response = await axios.get(path, {
        headers: authHeader,
        params: { params }
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  /**
   * @async
   * @function findTracks
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findTracks = async id => {
    const result = await requestAccessToken(config.id, config.secret)
      .then(accessToken =>
        requestAPI(accessToken, `${BASE_PATH}/tracks/${id}`, {})
      )
      .catch(err => setErr(err));
    setSongs(result);
  };
  /**
   * @async
   * @function findAlbums
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findAlbums = async id => {
    const result = await requestAccessToken(config.id, config.secret)
      .then(accessToken =>
        requestAPI(accessToken, `${BASE_PATH}/albums/${id}`, {})
      )
      .catch(err => setErr(err));
    setAlbums(result);
  };
  /**
   * @async
   * @function searchAPI
   * @param {Object} searchTerm - a query term
   * @param {Object} catagory - a song's unique ID
   * @description - updates the value of search with found object
   * @return {null}
   */
  const searchAPI = async (searchTerm, category) => {
    searchTerm = searchTerm.replace(/ /g, "+"); //replacing spaces with "+" for api
    const result = await requestAccessToken(config.id, config.secret)
      .then(accessToken =>
        requestAPI(accessToken, `${BASE_PATH}/search`, {
          q: searchTerm,
          type: category
        })
      )
      .catch(err => setErr(err));
    setSearch(result);
  };
  //this code runs only once, not every time the state vars are updated
  useEffect(() => {
    searchAPI("howlin wolf", "artists");
  }, []);
  return { songs, err, requestAccessToken };
};

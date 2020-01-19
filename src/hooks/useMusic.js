import { useState, useEffect, useReducer } from "react";
import config from "../api/musicConfig";
import { Buffer } from "buffer";
import axios from "axios";

export default () => {
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
        params: params
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const reducer = async (state, action) => {
    const accessToken = await requestAccessToken(config.id, config.secret);
    switch (action.RequestType) {
      case await "find_tracks":
        return {
          ...state,
          tracks: await requestAPI(
            accessToken,
            `${BASE_PATH}/tracks/${action.id}`,
            {}
          )
        };
      case "find_albums":
        return {
          ...state,
          albums: await requestAPI(
            accessToken,
            `${BASE_PATH}/albums/${action.id}`,
            {}
          )
        };
      case "find_artists":
        console.log("here");
        return await {
          ...state,
          artists: await requestAPI(
            accessToken,
            `${BASE_PATH}/artists/${action.id}`,
            {}
          )
        };
      case "search_api":
        return {
          ...state,
          search: await requestAPI(accessToken, `${BASE_PATH}/search`, {
            q: action.searchTerm,
            type: action.catagory
          })
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = useReducer(reducer, {
    tracks: null,
    albums: null,
    artists: null,
    search: null
  });
  const [err, setErr] = useState("");
  const BASE_PATH = "https://api.spotify.com/v1";

  /**
   * @async
   * @function findTracks
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findTracks = async id => {
    await dispatch({ RequestType: "find_tracks", id });
  };
  /**
   * @async
   * @function findAlbums
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findAlbums = async id => {
    await dispatch({ RequestType: "find_albums", id });
  };
  /**
   * @async
   * @function findArtists
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findArtists = async id => {
    await dispatch({ RequestType: "find_artists", id });
  };
  /**
   * @async
   * @function searchAPI
   * @param {String} searchTerm - a query term
   * @param {String} catagory - Valid types are: "album" , "artist", "playlist", and "track".
   * @description - updates the value of search with found object
   * @return {null}
   */
  const searchAPI = async (searchTerm, catagory) => {
    await dispatch({
      RequestType: "search_api",
      searchTerm: searchTerm.replace(/ /g, "+"), //because the api must have searches replaced with +
      catagory
    });
  };
  //this code runs only once, not every time the state vars are updated
  useEffect(() => {}, []);
  return [state, findAlbums, findArtists, findTracks, searchAPI];
};

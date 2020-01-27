import { useState } from "react";
import config from "../api/musicConfig";
import { Buffer } from "buffer";
import axios from "axios";

const BASE_PATH = "https://api.spotify.com/v1";

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
        params
      });
      return response.data;
    } catch (error) {
      return error;
    }
  };

  const reducer = async (updateState, action) => {
    const accessToken = await requestAccessToken(config.id, config.secret);
    switch (action.RequestType) {
      case "find_tracks":
        updateState(
          await requestAPI(accessToken, `${BASE_PATH}/tracks/${action.id}`, {})
        );
        break;
      case "find_albums":
        updateState(
          await requestAPI(accessToken, `${BASE_PATH}/albums/${action.id}`, {})
        );
        break;
      case "find_albums_of_a_track":
        const track = await requestAPI(
          accessToken,
          `${BASE_PATH}/tracks/${action.id}`,
          {}
        );
        updateState(
          await requestAPI(
            accessToken,
            `${BASE_PATH}/albums/${track.album.id}`,
            {}
          )
        );
        break;
      case "find_albums_of_an_artist":
        updateState(
          await requestAPI(
            accessToken,
            `${BASE_PATH}/artists/${action.id}/albums`,
            {}
          )
        );
        break;
      case "find_artists": {
        updateState(
          await requestAPI(accessToken, `${BASE_PATH}/artists/${action.id}`, {})
        );
        break;
      }
      case "search_api":
        console.log(action);
        updateState(
          await requestAPI(accessToken, `${BASE_PATH}/search`, {
            q: action.searchTerm,
            type: action.catagory
          })
        );
        break;
      default:
        break;
    }
  };
  const [tracks, setTracks] = useState(null);
  const [albums, setAlbums] = useState(null);
  const [artists, setArtists] = useState(null);
  const [search, setSearch] = useState(null);
  const [err, setErr] = useState("");

  /**
   * @async
   * @function findTracks
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findTracks = async id => {
    await reducer(setTracks, { RequestType: "find_tracks", id });
  };
  /**
   * @async
   * @function findAlbums
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findAlbums = async id => {
    await reducer(setAlbums, { RequestType: "find_albums", id });
  };
  const findAlbumsOfATrack = async id => {
    await reducer(setAlbums, { RequestType: "find_albums_of_a_track", id });
  };
  const findAlbumsOfAnArtist = async id => {
    await reducer(setTracks, { RequestType: "find_albums_of_an_artist", id });
  };
  /**
   * @async
   * @function findArtists
   * @param {Object} id - a song's unique ID
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findArtists = async id => {
    await reducer(setArtists, { RequestType: "find_artists", id });
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
    await reducer(setSearch, {
      RequestType: "search_api",
      searchTerm: searchTerm.replace(/ /g, "+"), //because the api must have searches replaced with +
      catagory
    });
  };
  return {
    tracks,
    albums,
    artists,
    search,
    findAlbums,
    findAlbumsOfATrack,
    findAlbumsOfAnArtist,
    findArtists,
    findTracks,
    searchAPI
  };
};

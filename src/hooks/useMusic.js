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
    let response = null;
    switch (action.RequestType) {
      case "find_tracks":
        response = await requestAPI(accessToken, `${BASE_PATH}/tracks`, {
          ids: action.ids
        });
        updateState(response);
        return response;
      case "find_albums":
        response = await requestAPI(accessToken, `${BASE_PATH}/albums`, {
          ids: action.ids
        });
        updateState(response);
        return response;
      case "find_artists": {
        response = await requestAPI(accessToken, `${BASE_PATH}/artists`, {
          ids: action.ids
        });
        updateState(response);
        return response;
      }
      case "search_api":
        response = await requestAPI(accessToken, `${BASE_PATH}/search`, {
          q: action.searchTerm,
          type: action.catagory
        });
        updateState(response);
        return response;
      default:
        return;
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
   * @param {Array} ids - an array of 1+ unique IDs for tracks
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findTracks = async ids => {
    if (!ids) return;
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await reducer(setTracks, {
      RequestType: "find_tracks",
      ids
    }).then(tracks => tracks.tracks);
  };
  /**
   * @async
   * @function findAlbums
   * @param {Array} ids - an array of 1+ unique IDs for albums
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findAlbums = async ids => {
    if (!ids) return;
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await reducer(setAlbums, {
      RequestType: "find_albums",
      ids
    }).then(albums => albums.albums);
  };
  /**
   * @async
   * @function findArtists
   * @param {Array} ids - an array of 1+ unique IDs for artists
   * @description - updates the value of songs with found track
   * @return {null}
   */
  const findArtists = async ids => {
    if (!ids) return;
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await reducer(setArtists, {
      RequestType: "find_artists",
      ids
    }).then(artists => artists.artists);
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
    if (!searchTerm) return;
    return await reducer(setSearch, {
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
    searchAPI,
    setSearch
  };
};

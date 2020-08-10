import axios from "axios";
import firebase from "firebase";
import "firebase/firestore";
import simplifyContent from "../helpers/simplifyContent";

export default class useMusic {
  constructor() {
    this.db = firebase.firestore();
    this.token = null;
    this.remover = null;
    this.country_code = "US";
    this.base_path = "https://api.spotify.com/v1";
    this.cached_content = { track: {}, album: {}, artist: {} };
    this.errorPrompt =
      "There was a problem loading the page. Please try again.";

    this.set_play = () => {};
    this.set_content = () => {};
  }

  async connectToken() {
    //setting update of token
    this.remover = await this.db
      .collection("token")
      .doc("spotify")
      .onSnapshot(doc => (this.token = doc.data()));
    //setting initial value of token
    this.token = await this.db
      .collection("token")
      .doc("spotify")
      .get()
      .then(doc => doc.data());
    return this.token;
  }

  async disconnect() {
    console.log("disconnecting token");
    return this.remover ? await this.remover() : null;
  }

  /**
   *
   * @param {Object} content - the content object to play
   */
  playContent(content) {
    this.set_content(content);
    this.set_play(true);
  }

  stopContent() {
    this.set_play(false);
  }

  establishMusicPlayer(listener, contentListener) {
    this.set_play = listener;
    this.set_content = contentListener;
  }
  /**
   * @async
   * @function requestAPI
   * @param {Object} accessToken - accessToken object resolved from requestAccessToken
   * @param {string} path - request path
   * @return {Promise<Object>} - the data object of the request
   */
  async requestAPI(path, params) {
    if (!this.token) await this.connectToken();
    const fullPath = this.base_path + path;
    try {
      const authHeader = {
        Authorization: this.token.token_type + " " + this.token.access_token
      };
      const response = await axios.get(fullPath, {
        headers: authHeader,
        params
      });
      return response.data;
    } catch (error) {
      return alert(this.errorPrompt);
    }
  }
  /**
   * @async
   * @function findTracks
   * @param {Array} ids - an array of 1+ unique IDs for tracks
   * @description - querys spotify API for the given track
   * @return {Object} - returns a track object for the given track
   */
  async findTracks(ids) {
    if (!ids) console.error("Find tracks should be passed ids");
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await this.requestAPI("/tracks", {
      ids: ids,
      market: this.country_code
    }).then(tracks =>
      tracks.tracks.map(track => simplifyContent(track, "track"))
    );
  }
  /**
   * @async
   * @function findTrack
   * @param {String} - the unique ID for the track
   * @description - updates the value of songs with found track
   * @return {null}
   */
  async findTrack(id) {
    if (!id) console.error("Find track should be passed id");
    let content;
    if (this.cached_content.track[id]) {
      content = this.cached_content["track"][id];
    } else {
      content = await this.requestAPI(`/tracks/${id}`, {
        market: this.country_code
      }).then(track => simplifyContent(track, "track"));
      this.cached_content.track[id] = content;
    }
    return content;
  }
  /**
   * @async
   * @function findAlbums
   * @param {Array} ids - an array of 1+ unique IDs for albums
   * @description - updates the value of songs with found track
   * @return {null}
   */
  async findAlbums(ids) {
    if (!ids) console.error("Find albums should be passed ids");
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await this.requestAPI("/albums", {
      ids: ids,
      market: this.country_code
    }).then(albums =>
      albums.albums.map(album => simplifyContent(album, "album"))
    );
  }
  /**
   * @async
   * @function findAlbum
   * @param {String} - the unique ID for the aalbum
   * @description - updates the value of songs with found track
   * @return {null}
   */
  async findAlbum(id) {
    if (!id) console.error("Find albums should be passed id");
    let content;
    if (this.cached_content.album[id]) {
      content = this.cached_content.album[id];
    } else {
      content = await this.requestAPI(`/albums/${id}`, {
        market: this.country_code
      }).then(album => simplifyContent(album, "album"));
      this.cached_content.album[id] = content;
    }
    return content;
  }
  async findAlbumsOfAnArtist(id) {
    if (!id) console.error("Find albums of artist should be passed id");
    return await this.requestAPI(`/artists/${id}/albums`, {
      country: this.country_code,
      limit: 50
    }).then(albums =>
      albums.items.map(album => simplifyContent(album, "album"))
    );
  }
  /**
   * @async
   * @function findArtists
   * @param {Array} ids - an array of 1+ unique IDs for artists
   * @description - updates the value of songs with found track
   * @return {null}
   */
  async findArtists(ids) {
    if (!ids) console.error("Find artists should be passed ids");
    ids = Array.isArray(ids) ? ids.join(",") : ids;
    return await this.requestAPI("/artists", {
      ids: ids
    }).then(artists =>
      artists.artists.map(artist => simplifyContent(artist, "artist"))
    );
  }
  /**
   * @async
   * @function findTrack
   * @param {String} - the unique ID for the artist
   * @description - updates the value of songs with found artist
   * @return {null}
   */
  async findArtist(id) {
    if (!id) console.error("Find artist should be passed id");
    let content;
    if (this.cached_content.artist[id]) {
      content = this.cached_content.artist[id];
    } else {
      content = await this.requestAPI(`/artists/${id}`, {
        market: this.country_code
      }).then(artist => simplifyContent(artist, "artist"));
      this.cached_content.artist[content.id] = content;
    }
    return content;
  }
  async findContent(ids, type) {
    switch (type) {
      case "artist":
        return this.findArtists(ids);
      case "album":
        return this.findAlbums(ids);
      case "track":
        return this.findTracks(ids);
      default:
        console.error("Content must be one of type: track, album, artist");
    }
  }

  async findOneContent(id, type) {
    switch (type) {
      case "artist":
        return this.findArtist(id);
      case "album":
        return this.findAlbum(id);
      case "track":
        return this.findTrack(id);
      default:
        console.error("Content must be one of type: track, album, artist");
    }
  }

  /**
   * @async
   * @function searchAPI
   * @param {String} searchTerm - a query term
   * @param {String} catagory - Valid types are: "album" , "artist", "playlist", and "track".
   * @description - updates the value of search with found object
   * @return {null}
   */
  async searchAPI(searchTerm, catagory) {
    if (!catagory) console.error("Search should be passed category");
    return await this.requestAPI("/search", {
      q: searchTerm.replace(/ /g, "+"), //because the api must have searches replaced with +
      type: catagory,
      market: this.country_code,
      limit: 20
    }).then(res =>
      res[catagory + "s"].items.map(r => simplifyContent(r, catagory))
    );
  }
}

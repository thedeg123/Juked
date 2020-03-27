/**
 * @description - Simplifies the objects returned from spotify API
 *
 */
export default simplifyContent = (content, type) => {
  switch (type) {
    case "track": {
      return {
        artist_name: content.album.artists[0].name,
        album_name: content.album.name,
        album_id: content.album.id,
        image: content.album.images[0]["url"],
        name: content.name,
        id: content.id
      };
    }
    case "album": {
      return {
        artist_name: content.artists[0].name,
        artist_id: content.artists[0].id,
        image: content.images[0]["url"],
        name: content.name,
        id: content.id
      };
    }
    case "artist": {
      return {
        name: content.name,
        id: content.id,
        image: content.images[0]["url"]
      };
    }
  }
};

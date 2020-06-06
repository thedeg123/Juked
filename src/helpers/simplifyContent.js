/**
 * @description - Simplifies the objects returned from spotify API
 *
 */
import images from "../constants/images";

export default simplifyContent = (content, type) => {
  const toStringDate = num_date => {
    const date = new Date(num_date);
    return `${date.toLocaleString("default", {
      month: "long"
    })} ${date.getDate()}, ${date.getFullYear()}`;
  };
  switch (type) {
    case "track": {
      return {
        artists: content.artists.map(artist => {
          return { name: artist.name, id: artist.id };
        }),
        url: content.external_urls.spotify,
        album_name: content.album.name,
        album_id: content.album.id,
        image: content.album.images.length
          ? content.album.images[0]["url"]
          : images.artistDefault,
        name: content.name,
        release_date: content.album.release_date,
        string_release_date: toStringDate(content.album.release_date),
        id: content.id,
        type: "track"
      };
    }
    case "track_album": {
      return {
        artists: content.artists.map(artist => {
          return { name: artist.name, id: artist.id };
        }),
        name: content.name,
        id: content.id,
        track_number: content.track_number,
        image: content.image,
        url: content.url,
        type: "track"
      };
    }
    case "album": {
      return {
        artists: content.artists.map(artist => {
          return { name: artist.name, id: artist.id };
        }),
        image: content.images.length
          ? content.images[0]["url"]
          : images.artistDefault,
        name: content.name,
        release_date: content.release_date,
        string_release_date: toStringDate(content.release_date),
        id: content.id,
        url: content.external_urls.spotify,
        album_type: content.album_type,
        tracks: content.tracks
          ? content.tracks.items.map(track =>
              simplifyContent(
                {
                  ...track,
                  image: content.images.length
                    ? content.images[0]["url"]
                    : images.artistDefault,
                  url: content.external_urls.spotify
                },
                "track_album"
              )
            )
          : null,
        type: "album"
      };
    }
    case "artist": {
      return {
        name: content.name,
        id: content.id,
        url: content.external_urls.spotify,
        image: content.images.length
          ? content.images[0]["url"]
          : images.artistDefault,
        type: "artist"
      };
    }
  }
};

/**
 * @description - Simplifies the objects returned from spotify API
 *
 */
import images from "../constants/images";

export const getAbreveatedTimeDif = time => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - time);
  if (diffTime < 1000) return "now";
  if (diffTime < 1000 * 60) return `${Math.ceil(diffTime / 1000)}s`;
  if (diffTime < 1000 * 60 * 60) return `${Math.ceil(diffTime / (1000 * 60))}m`;
  if (diffTime < 1000 * 60 * 60 * 24)
    return `${Math.ceil(diffTime / (1000 * 60 * 60))}h`;
  if (diffTime < 1000 * 60 * 60 * 24 * 14)
    return `${Math.ceil(diffTime / (1000 * 60 * 60 * 24))}d`;
  else return `${Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))}w`;
};

const stringifyTime = (time_ms)=>{
  const time = time_ms/60000
  const mins = Math.floor(time)
  const secs = Math.floor((time - mins)*60)
  return `${mins}:${secs<10? "0":""}${secs}`
}

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
        duration: stringifyTime(content.duration_ms) ,
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
        type: "track",
        genres: content.genres ? content.genres : null
      };
    }
    case "track_album": {
      return {
        artists: content.artists.map(artist => {
          return { name: artist.name, id: artist.id };
        }),
        name: content.name,
        id: content.id,
        album_id: content.album_id,
        track_number: content.track_number,
        image: content.image,
        url: content.url,
        type: "track",
        duration: stringifyTime(content.duration_ms),
        genres: content.genres
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
        genres: content.genres ? content.genres : null,
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
                  album_id: content.id,
                  image: content.images.length
                    ? content.images[0]["url"]
                    : images.artistDefault,
                  url: content.external_urls.spotify,
                  genres: content.genres ? content.genres : null
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
        genres: content.genres ? content.genres : null,
        url: content.external_urls.spotify,
        image: content.images.length
          ? content.images[0]["url"]
          : images.artistDefault,
        type: "artist"
      };
    }
  }
};

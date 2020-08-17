/**
 * @description - Simplifies the objects returned from spotify API
 *
 */
import images from "../constants/images";
import { Platform } from "react-native";

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

export const capitalizeWord = word =>
  word.charAt(0).toUpperCase() + word.slice(1);

export const toDisplayType = type => {
  return type === "track" ? "Song" : capitalizeWord(type);
};

const stringifyTime = time_ms => {
  const time = time_ms / 60000;
  const mins = Math.floor(time);
  const secs = Math.floor((time - mins) * 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

export const getStringDate = (date, fullDate = false) => {
  const diffTime = Math.abs(new Date().getTime() - date);
  if (diffTime < 1000 * 60 * 60 * 24) return "Today";
  if (diffTime < 2 * 1000 * 60 * 60 * 24) return "Yesterday";
  return fullDate
    ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
    : `${date.toLocaleString("default", {
        month: "long"
      })} ${date.getDate()}, ${date.getFullYear()}`;
};

export default simplifyContent = (content, type) => {
  const toStringDate = num_date => {
    const date = new Date(num_date);
    return Platform.OS === "android"
      ? `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      : `${date.toLocaleString("default", {
          month: "long"
        })} ${date.getDate()}, ${date.getFullYear()}`;
  };

  const dateToYear = date => new Date(date).getFullYear();

  switch (type) {
    case "track": {
      return {
        artists: content.artists.map(artist => {
          return { name: artist.name, id: artist.id };
        }),
        duration: stringifyTime(content.duration_ms),
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
        genres: content.genres ? content.genres : null,
        preview_url: content.preview_url,
        year: dateToYear(content.album.release_date),
        popularity: content.popularity
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
        genres: content.genres,
        preview_url: content.preview_url,
        popularity: content.popularity ? content.popularity : null,
        year: content.year
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
        year: dateToYear(content.release_date),
        string_release_date: toStringDate(content.release_date),
        id: content.id,
        url: content.external_urls.spotify,
        album_type: content.album_type,
        popularity: content.popularity ? content.popularity : null,
        preview_url:
          content.tracks && content.tracks.items
            ? content.tracks.items[0].preview_url
            : null,
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
                  popularity: content.popularity,
                  year: dateToYear(content.release_date),
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
        popularity: content.popularity,
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

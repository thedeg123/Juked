import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import Container from "../components/Container";
import ButtonFilter from "../components/HomeScreenComponents/ButtonFilter";
import HomeScreenItem from "../components/HomeScreenComponents/HomeScreenItem";
import useFirestore from "../hooks/useFirestore";
import useMusic from "../hooks/useMusic";
import zip from "../helpers/zip";

const HomeScreen = ({ navigation }) => {
  const [Tab1, Tab2] = ["All", "Friends"];
  const [filter, setFilter] = useState(Tab1);
  const [stream, setStream] = useState(null);
  const { findTracks, findAlbums, findArtists } = useMusic();

  // if yk sql, this is what were doing here:
  // select * from (select content_id from Reviews sortby changed limit 1)
  // groupby type theta join type==content_id on (select * from Music);
  const fetchHomeScreenData = async (limit = 20) => {
    // const reviews = await useFirestore.getMostRecentReviews(limit);
    // let reviewByType = {};
    // let content_idsByType = {};
    // for (r of reviews) {
    //   if (!(r.review.type in reviewByType)) {
    //     reviewByType[r.review.type] = [];
    //     content_idsByType[r.review.type] = [];
    //   }
    //   r.review.changed = new Date(r.review.changed._seconds * 1000); //converting to date object
    //   reviewByType[r.review.type].push(r.review);
    //   content_idsByType[r.review.type].push(r.review.content_id);
    // }
    // if (content_idsByType["artist"]) {
    //   let resultsArtist = await findArtists(content_idsByType["artist"]).then(
    //     artists => {
    //       let simpleArtists = [];
    //       artists.forEach(artist =>
    //         simpleArtists.push({
    //           name: artist.name,
    //           id: artist.id,
    //           image: artist.images.pop()["url"]
    //         })
    //       );
    //       return simpleArtists;
    //     }
    //   );
    //   reviewByType["artist"] = zip([reviewByType["artist"], resultsArtist]);
    // }
    // if (content_idsByType["album"]) {
    //   let resultsAlbums = await findAlbums(content_idsByType["album"]).then(
    //     albums => {
    //       let simpleAlbums = [];
    //       albums.forEach(album =>
    //         simpleAlbums.push({
    //           artist_name: album.artists[0].name,
    //           artist_id: album.artists[0].id,
    //           image: album.images[0]["url"],
    //           name: album.name,
    //           id: album.id,
    //           release_date: new Date(album.release_date)
    //         })
    //       );
    //       return simpleAlbums;
    //     }
    //   );
    //   reviewByType["album"] = zip([reviewByType["album"], resultsAlbums]);
    // }
    // if (content_idsByType["track"]) {
    //   let resultsTracks = await findTracks(content_idsByType["track"]).then(
    //     tracks => {
    //       let simpleTracks = [];
    //       tracks.forEach(track =>
    //         simpleTracks.push({
    //           artist_name: track.album.artists[0].name,
    //           artist_id: track.album.artists[0].id,
    //           album_name: track.album.name,
    //           album_id: track.album.id,
    //           image: track.album.images[0]["url"],
    //           name: track.name,
    //           id: track.id,
    //           release_date: new Date(track.album.release_date)
    //         })
    //       );
    //       return simpleTracks;
    //     }
    //   );
    //   reviewByType["track"] = zip([reviewByType["track"], resultsTracks]);
    // }
    // let content = (reviewByType["artist"] || [])
    //   .concat(reviewByType["album"] || [])
    //   .concat(reviewByType["track"] || [])
    //   .sort((a, b) => !(a.changed > b.changed));
    // return content;

    return [
      {
        author: "d",
        changed: new Date("2020-01-22"),
        content_id: "0oSGxfWSnnOXhD2fKuz2Gy",
        rating: 0,
        text: "d",
        title: "d",
        type: "artist"
      },
      {
        id: "0oSGxfWSnnOXhD2fKuz2Gy",
        image:
          "https://i.scdn.co/image/30eb99590bd150728b1287f103d61c9dc5375189",
        name: "David Bowie"
      }
    ];
  };
  useEffect(() => {
    fetchHomeScreenData(1).then(res => {
      res.forEach(element => {
        console.log(element);
      });
    });
  }, []);
  return (
    <Container>
      <ButtonFilter options={[Tab1, Tab2]} setSelected={setFilter} />
      <HomeScreenItem tracks={"hello_world"} />
    </Container>
  );
};

HomeScreen.navigationOptions = () => {
  return {
    title: "Stream"
  };
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60,
    alignSelf: "center"
  }
});
export default HomeScreen;

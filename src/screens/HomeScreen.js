import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import useMusic from "../hooks/useMusic";
import Container from "../components/Container";
import ButtonFilter from "../components/ButtonFilter";
import HomeScreenItem from "../components/HomeScreenItem";
import useFirestore from "../hooks/useFirestore";

const HomeScreen = ({ navigation }) => {
  const [Tab1, Tab2] = ["All", "Friends"];
  const [filter, setFilter] = useState(Tab1);
  const [stream, setStream] = useState(null);
  const { tracks, findTracks } = useMusic();
  useEffect(() => {
    setStream(null);
    findTracks("11dFghVXANMlKmJXsNCbNl");
  }, []);
  return (
    <Container>
      <View>
        <Text style={styles.headerStyle}>HomeScreen</Text>
        <ButtonFilter options={[Tab1, Tab2]} setSelected={setFilter} />
        <HomeScreenItem tracks={tracks} />
      </View>
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

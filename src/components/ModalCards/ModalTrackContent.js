import React, { useEffect, useState, useContext } from "react";
import { StyleSheet, Button, Text, View } from "react-native";
import context from "../../context/context";
import { withNavigation } from "react-navigation";
import colors from "../../constants/colors";
import BarGraph from "../Graphs/BarGraph";
import TextRatings from "../TextRatings";

const ModalTrackContent = ({ navigation, onClose, content }) => {
  const { firestore } = useContext(context);
  const [contentData, setContentData] = useState(null);
  const [review, setReview] = useState("waiting");

  const init = () => {
    firestore.getContentData(content.id).then(v => setContentData(v));
    firestore
      .getReviewsByAuthorContent(firestore.fetchCurrentUID(), content.id)
      .then(r => setReview(r.exists ? r : null));
  };

  useEffect(() => {
    init();
    const listener = navigation.addListener("didFocus", () => init()); //any time we return to this screen we do another fetch
    return () => listener.remove();
  }, []);
  return (
    <View style={styles.card}>
      <Text style={styles.contentTitle}>{content.name}</Text>
      <View style={styles.content}>
        <View style={styles.buttonWrapper}>
          <Button onPress={onClose} title="Done" />
          <Button
            onPress={() => {
              onClose();
              navigation.navigate("WriteReview", {
                content,
                review
              });
            }}
            title={review ? "Edit Review" : "Add Review"}
          />
        </View>
        <View style={{ alignSelf: "stretch" }}>
          <BarGraph
            data={contentData ? contentData.rating_nums : null}
          ></BarGraph>
          <TextRatings
            review={review}
            averageReview={contentData ? contentData.avg : 0}
          ></TextRatings>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingTop: 5,
    backgroundColor: colors.background,
    paddingBottom: 50,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    borderRadius: 5,
    borderColor: colors.heat
  },
  card: {
    alignItems: "center",
    alignSelf: "stretch"
  },
  contentTitle: {
    fontSize: 25,
    color: colors.primary,
    fontWeight: "bold",
    marginBottom: 10
  },
  buttonWrapper: {
    alignSelf: "stretch",
    justifyContent: "space-between",
    flexDirection: "row"
  }
});

export default withNavigation(ModalTrackContent);

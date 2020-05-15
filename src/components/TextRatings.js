//Provides margin on components
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../constants/colors";

const TextRatings = ({ review, averageReview }) => {
  return (
    <View style={{ flexDirection: "row", alignSelf: "center" }}>
      {review ? (
        <Text style={styles.subtitle}>
          Your rating:{" "}
          <Text style={styles.rating}>
            {review.data ? review.data.rating : 0}
          </Text>
        </Text>
      ) : null}
      <Text style={styles.subtitle}>
        Average rating:{" "}
        <Text style={styles.rating}>{Math.round(averageReview * 10) / 10}</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  rating: {
    color: colors.primary,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 20,
    color: colors.text,
    padding: 10
  }
});

export default TextRatings;

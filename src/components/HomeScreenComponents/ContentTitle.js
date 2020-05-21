import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import ArtistNames from "../ArtistNames";

const ContentTitle = ({ header, subheader, date, review }) => {
  return (
    <View style={styles.containerStyle}>
      <View style={{ justifyContent: "center", flex: 1 }}>
        <Text numberOfLines={2} style={styles.headerStyle}>
          {header}
        </Text>
        {subheader ? (
          <ArtistNames
            artists={subheader}
            allowPress={false}
            textStyle={styles.subheaderStyle}
          ></ArtistNames>
        ) : null}
      </View>

      <Text numberOfLines={1} style={styles.dateStyle}>
        {review ? "Reviewed" : "Rated"}: {date.getMonth() + 1}/{date.getDate()}/
        {date.getFullYear()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: 95,
    justifyContent: "space-between",
    flex: 2,
    marginTop: 5,
    marginLeft: 5
  },
  headerStyle: {
    fontSize: 20,
    marginBottom: 5,
    fontWeight: "bold",
    color: colors.white
  },
  subheaderStyle: {
    fontSize: 18,
    color: colors.white
  },
  dateStyle: {
    marginBottom: 5,
    fontSize: 14,
    color: colors.white
  }
});

ContentTitle.defaultProps = {
  header: "",
  subheader: "",
  rating: Date(),
  review: false
};

export default ContentTitle;

import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import ArtistNames from "../ArtistNames";
import { getStringDate } from "../../helpers/simplifyContent";

const ContentTitle = ({ header, subheader, date, review, fontScaling }) => {
  const [titleFont, subtitleFont, dateFont] = [20, 18, 14].map(
    size => size * fontScaling
  );

  return (
    <View style={styles.containerStyle}>
      <View style={{ flex: 1 }}>
        <Text
          numberOfLines={2}
          style={[styles.headerStyle, { fontSize: titleFont }]}
        >
          {header}
        </Text>
        {subheader ? (
          <ArtistNames
            artists={subheader}
            allowPress={false}
            textStyle={[styles.subheaderStyle, { fontSize: subtitleFont }]}
          ></ArtistNames>
        ) : null}
      </View>

      {date && (
        <Text
          numberOfLines={1}
          style={[styles.dateStyle, { fontSize: dateFont }]}
        >
          {review ? "Reviewed" : "Rated"} {getStringDate(date)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerStyle: {
    height: 95,
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
  fontScaling: 1,
  review: false
};

export default ContentTitle;

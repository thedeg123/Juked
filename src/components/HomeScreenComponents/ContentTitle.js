import React from "react";
import { Text, View, StyleSheet } from "react-native";
import colors from "../../constants/colors";

const ContentTitle = ({ header, subheader, date, review }) => {
  return (
    <View style={styles.containerStyle} onPress={() => {}}>
      <View>
        <Text numberOfLines={2} style={styles.headerStyle}>
          {header}
        </Text>
        <Text numberOfLines={2} style={styles.subheaderStyle}>
          {subheader}
        </Text>
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
    justifyContent: "space-between",
    flex: 2,
    marginTop: 5,
    marginBottom: 20,
    marginLeft: 5
  },
  headerStyle: {
    fontSize: 22,
    marginBottom: 5,
    fontWeight: "bold",
    color: colors.white
  },
  subheaderStyle: {
    fontSize: 20,
    color: colors.white
  },
  dateStyle: {
    fontSize: 16,
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

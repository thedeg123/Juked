import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../BaseButton";
import ContentTypeRow from "./ContentTypeRow";
import colors from "../../constants/colors";
import ModalFilterButton from "./ModalFilterButton";

const ModalSortContent = ({
  newestFirst,
  setNewestFirst,
  filterTypes,
  setFilterTypes,
  onClose
}) => {
  return (
    <View style={styles.content}>
      <View style={{ alignItems: "flex-start" }}>
        <Button onPress={onClose} title="Done" />
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginVertical: 10
        }}
      >
        <ModalFilterButton
          show={!newestFirst}
          title="Oldest"
          onPress={() => setNewestFirst(!newestFirst)}
        />
        <ModalFilterButton
          show={newestFirst}
          title="Newest"
          onPress={() => setNewestFirst(!newestFirst)}
        />
      </View>
      <ContentTypeRow
        showSongs={filterTypes.includes("track")}
        showAlbums={filterTypes.includes("album")}
        showArtists={filterTypes.includes("artist")}
        shouldDisable
        onPress={(type, has_type) =>
          has_type
            ? setFilterTypes(filterTypes.filter(t => t !== type))
            : setFilterTypes([...filterTypes, type])
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.cardColor,
    paddingBottom: 50,
    borderRadius: 5
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12
  }
});

export default ModalSortContent;

//Provides margin on components
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity
} from "react-native";
import colors, { blurRadius } from "../../constants/colors";
import ContentPic from "../HomeScreenComponents/ContentPic";
import navigateContent from "../../helpers/navigateContent";
import { withNavigation } from "react-navigation";
import { MaterialIcons } from "@expo/vector-icons";

const UserListPreviewItem = ({
  navigation,
  list,
  user,
  onPress,
  showCheck
}) => {
  const getMiniPic = (content, style) => (
    <ContentPic imageStyle={style} content={content} width={50}></ContentPic>
  );
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() =>
        onPress
          ? onPress()
          : navigateContent(navigation, null, null, list, null, user)
      }
      style={styles.wrapper}
    >
      <View style={list ? styles.shadow : null}>
        {list.data.items.length < 4 ? (
          <ContentPic content={list.data.items[0]} width={100}></ContentPic>
        ) : (
          <View>
            <View style={{ flexDirection: "row" }}>
              {getMiniPic(list.data.items[0], {
                borderRadius: 0,
                borderWidth: 0,
                borderTopLeftRadius: 5
              })}
              {getMiniPic(list.data.items[1], {
                borderRadius: 0,
                borderWidth: 0,
                borderTopRightRadius: 5
              })}
            </View>
            <View style={{ flexDirection: "row" }}>
              {getMiniPic(list.data.items[2], {
                borderRadius: 0,
                borderWidth: 0,
                borderBottomLeftRadius: 5
              })}
              {getMiniPic(list.data.items[3], {
                borderRadius: 0,
                borderWidth: 0,
                borderBottomRightRadius: 5
              })}
            </View>
          </View>
        )}
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text
          numberOfLines={1}
          style={{
            textAlign: "center",
            color: colors.darkShadow,
            fontWeight: "bold",
            fontSize: 18,
            width: showCheck ? 80 : 100
          }}
        >
          {list.data.title}
        </Text>
        {showCheck && (
          <MaterialIcons
            style={{ marginTop: 2 }}
            name="check"
            size={18}
            color={colors.secondary}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingLeft: 10
  },
  shadow: {
    shadowColor: colors.shadow,
    shadowOpacity: 1,
    shadowOffset: { width: 3, height: 2 },
    shadowRadius: 2
  },
  contentContainer: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: colors.darkener
  },
  rightContent: {
    justifyContent: "center",
    flex: 1,
    alignSelf: "center",
    alignContent: "center"
  },
  imageBackgroundStyle: {
    borderRadius: 5,
    width: 150,
    flex: 1,
    resizeMode: "cover",
    overflow: "hidden",
    alignSelf: "stretch",
    borderWidth: 0.5,
    borderColor: colors.lightShadow
  },
  textStyle: {
    color: colors.veryTranslucentWhite,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default withNavigation(UserListPreviewItem);

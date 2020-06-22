import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  StyleSheet
} from "react-native";
import colors from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CommentBar = ({ keyboardIsActive, submitComment }) => {
  const [comment, setComment] = useState("");
  const numberOfLines = 5;
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <TextInput
        style={{
          borderWidth: keyboardIsActive ? 3 : 1,
          flex: 1,
          borderRadius: 10,
          color: colors.white,
          fontSize: 18,
          padding: 10,
          paddingTop: 10, //you need both for the placeholder text
          borderColor: keyboardIsActive
            ? colors.primary
            : colors.veryTranslucentWhite
        }}
        numberOfLines={Platform.OS === "ios" ? null : numberOfLines}
        maxHeight={
          Platform.OS === "ios" && numberOfLines ? 26 * numberOfLines : null
        }
        placeholder={"Add a Comment"}
        placeholderTextColor={colors.veryTranslucentWhite}
        value={comment}
        multiline={true}
        onChangeText={setComment}
        onSubmitEditing={() => {
          comment.length ? submitComment(comment) : null;
          return setComment("");
        }}
        returnKeyType="send"
        blurOnSubmit
      ></TextInput>
      <TouchableOpacity
        style={{
          marginLeft: 5,
          justifyContent: "center"
        }}
        onPress={() => {
          comment.length ? submitComment(comment) : null;
          return setComment("");
        }}
      >
        <MaterialCommunityIcons
          name="send"
          size={24}
          color={colors.veryTranslucentWhite}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({});

export default CommentBar;

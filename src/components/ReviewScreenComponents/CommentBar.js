import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import colors from "../../constants/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CommentBar = ({ keyboardIsActive, submitComment }) => {
  const [comment, setComment] = useState("");
  const rawHeight = 30;
  const [inputHeight, setInputHeight] = useState(rawHeight);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <TextInput
        style={{
          borderWidth: keyboardIsActive ? 3 : 1,
          flex: 1,
          height: inputHeight,
          borderRadius: 10,
          color: colors.white,
          fontSize: 18,
          padding: 10,
          paddingTop: 10, //you need both for the placeholder text
          borderColor: keyboardIsActive ? colors.primary : colors.white
        }}
        onContentSizeChange={e => {
          if (e.nativeEvent.contentSize.height > rawHeight) {
            setInputHeight(inputHeight + rawHeight);
          } else if (e.nativeEvent.contentSize.height < rawHeight) {
            setInputHeight(inputHeight - rawHeight);
          }
        }}
        placeholder={"Add a Comment"}
        placeholderTextColor={colors.veryTranslucentWhite}
        value={comment}
        multiline={true}
        onChangeText={setComment}
        onSubmitEditing={() => {
          comment ? submitComment(comment) : null;
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

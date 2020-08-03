import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from "react-native";
import UserPreview from "../HomeScreenComponents/UserPreview";
import colors from "../../constants/colors";
import { Feather } from "@expo/vector-icons";
import { getAbreveatedTimeDif } from "../../helpers/simplifyContent";

const CommentSection = ({
  headerComponent,
  comments,
  commentUsers,
  currentUser,
  deleteComment
}) => {
  const dateComponent = time => (
    <Text
      style={{
        color: colors.translucentWhite,
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 5
      }}
    >
      {getAbreveatedTimeDif(time)}
    </Text>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        contentContainerStyle={{ paddingBottom: 85 }}
        ListHeaderComponent={headerComponent}
        showsVerticalScrollIndicator={false}
        data={comments}
        renderItem={({ item }) => (
          <View style={styles.itemWrapper}>
            <View
              style={{
                marginLeft: 10,
                marginRight: 5,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingBottom: 5,
                  flex: 1
                }}
              >
                {commentUsers[item.data.author] ? (
                  <UserPreview
                    img={commentUsers[item.data.author].profile_url}
                    username={commentUsers[item.data.author].handle}
                    uid={commentUsers[item.data.author].id}
                    color={colors.translucentWhite}
                    size={35}
                    containerStyle={{
                      alignSelf: "flex-start",
                      alignItems: "flex-start"
                    }}
                  ></UserPreview>
                ) : null}
                <Text
                  style={{
                    color: colors.translucentWhite,
                    fontSize: 16,
                    marginLeft: 10,
                    flex: 1
                  }}
                >
                  {item.data.text}
                </Text>
                {dateComponent(item.data.last_modified)}
                {item.data.author === currentUser ? (
                  <TouchableOpacity
                    onPress={() => deleteComment(item.id)}
                    style={{ marginLeft: 5 }}
                  >
                    <Feather name="trash" size={24} color={colors.primary} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      ></FlatList>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  itemWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.veryTranslucentWhite,

    marginTop: 5
  }
});

export default CommentSection;

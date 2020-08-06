import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  Image
} from "react-native";
import colors from "../../constants/colors";
import images from "../../constants/images";
import UserSelectorScrollItem from "./UserSelectorScrollItem";

const UserSelectorScroll = ({ data, selected, onUserPress }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={data}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserSelectorScrollItem
            containerStyle={{
              borderColor:
                selected && (selected === item.id || selected === item.email)
                  ? colors.primary
                  : "transparent"
            }}
            textStyle={{ fontWeight: selected === item.id ? "bold" : "normal" }}
            onPress={() => onUserPress(item)}
            image={{
              uri:
                (item.data ? item.data.profile_url : item.profile_url) ||
                images.profileDefault
            }}
            text={item.data ? item.data.handle : item.handle}
          />
        )}
        keyExtractor={item => item.id || item.email}
      ></FlatList>
    </View>
  );
};

export default UserSelectorScroll;

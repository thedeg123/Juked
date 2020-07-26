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
            containerStyle={{ borderColor: selected === item.id ? colors.primary : "transparent" }}
            textStyle={{ fontWeight: selected === item.id ? "bold" : "normal" }}
            onPress={() =>  onUserPress(item)}
            image={{
                uri: item.data.profile_url || images.profileDefault
              }}
            text={item.data.handle}
          />
        )}
        keyExtractor={item => item.id}
      ></FlatList>
    </View>
  );
};

export default UserSelectorScroll;

import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import SearchPreview from "./SearchPreview";
import UserPreview from "./UserPreview";
import colors from "../constants/colors";
import { paddingBottom } from "../constants/heights";

const ResultsList = ({
  users,
  searchType,
  search,
  containerStyle,
  showAddItems,
  onItemAdd,
  onItemRemove,
  itemKeys
}) => {
  return (
    <View
      style={[
        {
          marginTop: 10,
          borderTopWidth: 0.5,
          borderColor: colors.lightShadow
        },
        containerStyle
      ]}
    >
      {users && searchType === "user" ? (
        <FlatList
          contentContainerStyle={{ paddingBottom }}
          data={users}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          keyExtractor={user => user.handle + user.created}
          renderItem={({ item }) => <UserPreview user={item} />}
        />
      ) : (
        search && (
          <FlatList
            contentContainerStyle={{ paddingBottom }}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
            data={search}
            keyExtractor={(searchItem, index) => searchItem.id + index}
            renderItem={({ item }) => (
              <SearchPreview
                type={searchType}
                object={item}
                cid={item.id}
                addItem={showAddItems}
                onItemAdd={onItemAdd}
                onItemRemove={onItemRemove}
                itemKeys={itemKeys}
              />
            )}
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ResultsList;

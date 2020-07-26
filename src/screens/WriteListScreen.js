import React, { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Button,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import colors from "../constants/colors";
import context from "../context/context";
import DraggableFlatList from "react-native-draggable-flatlist";
import SearchItem from "../components/SearchItem";
import { listSearchButtonOptions } from "../constants/buttonOptions";
import ResultsList from "../components/ResultsList";
import UserListItem from "../components/UserList/UserListItem";

/**
 *
 * @param {string} content_id - the type of  content to be displayed, sent if this is first time were writing list
 * @param {string} content_type - the type of  contetn to be displayed, sent if this is first time were writing list
 * @param {string} rid - the list's unique id. Sent if were updating a list.
 */

const WriteListScreen = ({ navigation }) => {
  const list = navigation.getParam("list");
  const { firestore } = useContext(context);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState([]);
  const [itemKeys, setItemKeys] = useState(new Set());
  const [stagedItems, setStagedItems] = useState([]);
  const [stagedItemKeys, setStagedItemKeys] = useState(new Set());
  const [showSearch, setShowSearch] = useState(false);
  const { useMusic } = useContext(context);
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [search, setSearch] = useState(null);

  const submitList = () => {
    list
      ? firestore.updateList(list.id, title, description, items, itemKeys)
      : firestore.addList(title, description, items, itemKeys);
    return navigation.pop();
  };
  useEffect(() => {
    if (list) {
      setTitle(list.data.title);
      setDescription(list.data.description ? list.data.description : "");
      setItems(list.data.items);
    }
  }, []);

  const bottomRowButtons = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-evenly"
      }}
    >
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          disabled={!showSearch && !title.length}
          style={[
            styles.submitButtonStyle,
            {
              backgroundColor:
                !showSearch && !title.length
                  ? colors.lightShadow
                  : colors.primary,
              left: showSearch ? 30 : 40
            }
          ]}
          onPress={() => {
            if (showSearch) {
              setItems(stagedItems);
              setItemKeys(stagedItemKeys);
              setShowSearch(!showSearch);
            } else {
              submitList();
            }
          }}
        >
          <Text style={styles.submitButtonTextStyle}>
            {showSearch
              ? `${
                  stagedItems.length - items.length >= 0 ? "Add" : "Remove"
                } ${Math.abs(stagedItems.length - items.length)} Items`
              : list
              ? "Update"
              : "Submit"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={{ justifyContent: "center", top: 5, marginRight: 10 }}
        onPress={() => {
          setStagedItemKeys(itemKeys);
          setTerm("");
          setStagedItems(items);
          setShowSearch(!showSearch);
        }}
      >
        <Text style={{ fontSize: 16, color: colors.primary }}>
          {showSearch ? "Cancel" : "Add Items"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const listView = () => (
    <View style={{ flex: 1 }}>
      <TextInput
        placeholder="Add a Title"
        blurOnSubmit
        returnKeyType="done"
        placeholderTextColor={colors.lightShadow}
        value={title}
        onChangeText={setTitle}
        multiline
        style={styles.titleTextStyle}
      ></TextInput>

      <TextInput
        placeholder="Add a Description"
        blurOnSubmit
        returnKeyType="done"
        placeholderTextColor={colors.lightShadow}
        value={description}
        numberOfLines={
          Platform.OS === "ios" ? null : Dimensions.get("window").height * 0.005
        }
        maxHeight={
          Platform.OS === "ios" ? Dimensions.get("window").height * 0.2 : null
        }
        onChangeText={setDescription}
        multiline
        style={styles.descriptionTextStyle}
      ></TextInput>
      <View
        style={{
          flex: 1,
          borderTopWidth: 0.5,
          borderBottomWidth: 0.5,
          borderColor: colors.lightShadow
        }}
      >
        <DraggableFlatList
          data={items}
          autoscrollThreshold={50}
          renderItem={({ item, index, drag, isActive }) => (
            <UserListItem
              content={item}
              index={index}
              forWriteList
              onLongPress={drag}
              showGrip
              containerStyle={
                isActive ? { shadowOffset: { width: 5, height: 5 } } : null
              }
            ></UserListItem>
          )}
          keyExtractor={item => `${item.id}`}
          onDragEnd={({ data }) => setItems(data)}
        />
      </View>
    </View>
  );

  const searchView = () => (
    <View style={{ flex: 1 }}>
      <Text style={styles.searchText}>Add Items</Text>
      <SearchItem
        containerStyle={{ marginHorizontal: 10 }}
        keyboardIsActive={true}
        term={term}
        setTerm={setTerm}
        searchForTerm={async (term, type) =>
          term.length ? setSearch(await useMusic.searchAPI(term, type)) : null
        }
        searchType={searchType}
        setSearchType={setSearchType}
        optionButtons={listSearchButtonOptions}
      ></SearchItem>
      {term.length ? (
        <ResultsList
          searchType={searchType}
          search={search}
          showAddItems={true}
          onItemAdd={item => {
            stagedItemKeys.add(item.id);
            return setStagedItems([...stagedItems, item]);
          }}
          onItemRemove={item => {
            stagedItemKeys.delete(item.id);
            return setStagedItems(
              stagedItems.filter(staged_item => staged_item.id !== item.id)
            );
          }}
          itemKeys={stagedItemKeys}
          containerStyle={{
            marginBottom: 125,
            borderBottomWidth: 0.5,
            borderBottomColor: colors.lightShadow
          }}
        />
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, marginBottom: 80 }}>
          <View style={{ flex: 1 }}>
            {showSearch ? searchView() : listView()}
          </View>
          {bottomRowButtons()}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  submitButtonStyle: {
    alignSelf: "center",
    marginTop: 10,
    padding: 10,
    marginTop: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },

  submitButtonTextStyle: {
    fontWeight: "bold",
    color: colors.white,
    fontSize: 18
  },
  headerText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 30
  },
  searchText: {
    margin: 10,
    fontSize: 26,
    color: colors.text,
    fontWeight: "bold"
  },
  descriptionTextStyle: {
    margin: 10,
    color: colors.text,
    padding: 10,
    borderRadius: 5,
    borderColor: colors.primary,
    borderWidth: 3,
    fontSize: 20
  },
  titleTextStyle: {
    marginHorizontal: 10,
    color: colors.text,
    padding: 10,
    borderRadius: 5,
    fontWeight: "bold",
    fontSize: 40
  }
});

WriteListScreen.navigationOptions = () => {
  return {
    headerTitle: "My List"
  };
};

export default WriteListScreen;
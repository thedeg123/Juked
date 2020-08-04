import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Text,
  Keyboard
} from "react-native";
import ResultsList from "../components/ResultsList";
import context from "../context/context";
import colors from "../constants/colors";
import SearchItem from "../components/SearchItem";
import { Octicons } from "@expo/vector-icons";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState(null);
  const [keyboardIsActive, setKeyboardIsActive] = useState(false);
  const { firestore, useMusic } = useContext(context);

  useEffect(() => {
    const keyboardOpenListenter = Keyboard.addListener("keyboardWillShow", () =>
      setKeyboardIsActive(true)
    );
    const keyboardCloseListenter = Keyboard.addListener(
      "keyboardWillHide",
      () => setKeyboardIsActive(false)
    );
    return () => {
      keyboardOpenListenter.remove();
      keyboardCloseListenter.remove();
    };
  }, []);

  const searchForTerm = async (term, type) => {
    if (term.length) {
      type === "user"
        ? firestore.searchUser(term).then(myUsers => setUsers(myUsers))
        : setSearch(await useMusic.searchAPI(term, type));
    } else {
      setSearch(null);
      setUsers(null);
    }
  };

  const searchHelp = (
    <KeyboardAvoidingView behavior="padding" style={styles.searchHelpContainer}>
      <View style={{ bottom: keyboardIsActive ? 15 : 0, alignItems: "center" }}>
        <Octicons
          name="search"
          size={60}
          color={keyboardIsActive ? colors.primary : colors.shadow}
        />
        <Text style={{ marginTop: 20, color: colors.darkShadow }}>
          Find albums, reviews, lists and more
        </Text>
      </View>
    </KeyboardAvoidingView>
  );

  return (
    <View style={{ flex: 1, marginBottom: 85 }}>
      <View style={styles.topContainerStyle}>
        <SearchItem
          keyboardIsActive={keyboardIsActive}
          term={term}
          setTerm={setTerm}
          searchForTerm={searchForTerm}
          searchType={searchType}
          setSearchType={setSearchType}
        ></SearchItem>
      </View>
      {search && search.length === 0 && term.length !== 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: colors.secondary }}>
            No {searchType === "track" ? "song" : searchType}s found matching "
            {term}"
          </Text>
        </View>
      ) : keyboardIsActive || users || search ? (
        <ResultsList users={users} searchType={searchType} search={search} />
      ) : null}
      {!search && searchHelp}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainerStyle: {
    margin: 10,
    marginBottom: 0
  },
  searchHelpContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

SearchScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Explore"
  };
};

export default SearchScreen;

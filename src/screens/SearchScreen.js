import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import KeyboardAvoidingView from "../components/KeyboardAvoidingViewWrapper";
import { paddingBottom } from "../constants/heights";
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
    const show =
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow";
    const hide =
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide";
    const keyboardOpenListenter = Keyboard.addListener(show, () =>
      setKeyboardIsActive(true)
    );
    const keyboardCloseListenter = Keyboard.addListener(hide, () =>
      setKeyboardIsActive(false)
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
    <View style={{ flex: 1, paddingBottom }}>
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
      {((search && search.length === 0) || (users && users.length === 0)) &&
      term.length !== 0 ? (
        <View style={styles.erorrViewStyle}>
          <Text style={styles.errorTextStyle}>
            No {searchType === "track" ? "song" : searchType}s found matching "{" "}
            {term}"
          </Text>
        </View>
      ) : keyboardIsActive || users || search ? (
        <ResultsList users={users} searchType={searchType} search={search} />
      ) : null}
      {!term.length && searchHelp}
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
  },
  erorrViewStyle: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorTextStyle: { fontSize: 16, color: colors.secondary }
});

SearchScreen.navigationOptions = ({ navigation }) => {
  return {
    title: "Explore"
  };
};

export default SearchScreen;

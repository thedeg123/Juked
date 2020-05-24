import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, Text, Keyboard } from "react-native";
import SearchBar from "../components/SearchBar";
import SearchStyle from "../components/SearchStyle";
import ResultsList from "../components/ResultsList";
import context from "../context/context";
import colors from "../constants/colors";

const SearchScreen = ({ navigation }) => {
  const [term, setTerm] = useState("");
  const [searchType, setSearchType] = useState("track");
  const [users, setUsers] = useState(null);
  const [search, setSearch] = useState(null);
  const [keyboardIsActive, setKeyboardIsActive] = useState(false);
  const { firestore, useMusic } = useContext(context);
  const [waitTime, setWaitTime] = useState(null);

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

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.topContainerStyle}>
        <SearchBar
          term={term}
          onTermChange={new_term => {
            setTerm(new_term);
            waitTime ? clearTimeout(waitTime) : null;
            setWaitTime(
              setTimeout(() => searchForTerm(new_term, searchType), 500)
            );
          }}
          onTermSubmit={async new_term => {
            setTerm(new_term);
            waitTime ? clearTimeout(waitTime) : null;
            searchForTerm(new_term, searchType);
          }}
          keyboardIsActive={keyboardIsActive}
        />
        {keyboardIsActive || term.length ? (
          <SearchStyle
            onPress={new_type => {
              setSearchType(new_type);
              waitTime ? clearTimeout(waitTime) : null;
              searchForTerm(term, new_type);
            }}
            searchType={searchType}
          ></SearchStyle>
        ) : null}
      </View>
      {search && search.length === 0 && term.length !== 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontSize: 16, color: colors.heat }}>
            No {searchType === "track" ? "song" : searchType}s found matching "
            {term}"
          </Text>
        </View>
      ) : keyboardIsActive || users || search ? (
        <ResultsList users={users} searchType={searchType} search={search} />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  topContainerStyle: {
    margin: 10,
    marginBottom: 0
  }
});

export default SearchScreen;

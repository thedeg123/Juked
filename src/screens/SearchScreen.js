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
  const [Tab1, Tab2, Tab3, Tab4] = ["Songs", "Albums", "Artists", "Users"];
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

  const searchForTerm = async term => {
    if (term.length) {
      searchType === "user"
        ? firestore.searchUser(term).then(myUsers => setUsers(myUsers))
        : setSearch(await useMusic.searchAPI(term, searchType));
    } else {
      setSearch(null);
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
            setWaitTime(setTimeout(() => searchForTerm(new_term), 500));
          }}
          onTermSubmit={async new_term => {
            setTerm(new_term);
            searchForTerm(new_term);
          }}
          setSearchType={setSearchType}
          keyboardIsActive={keyboardIsActive}
        />
        {keyboardIsActive || term.length ? (
          <SearchStyle
            options={[Tab1, Tab2, Tab3, Tab4]}
            searchType={searchType}
            setSearchType={setSearchType}
            onChangeButton={async newType => {
              if (newType !== searchType) {
                setSearch(null);
                setSearchType(newType);
                if (term !== "") {
                  if (newType === "user") {
                    firestore.searchUser(term).then(myUsers => {
                      setUsers(myUsers);
                    });
                  } else {
                    setSearch(await useMusic.searchAPI(term, newType));
                  }
                }
              }
            }}
          />
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
      ) : (
        <ResultsList users={users} searchType={searchType} search={search} />
      )}
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

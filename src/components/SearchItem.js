import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import SearchBar from "../components/SearchBar";
import OptionBar from "../components/OptionBar";
import { searchButtonOptions } from "../constants/buttonOptions";

const SearchItem = ({
  keyboardIsActive,
  term,
  setTerm,
  searchForTerm,
  searchType,
  setSearchType,
  optionButtons,
  containerStyle
}) => {
  const [waitTime, setWaitTime] = useState(null);
  optionButtons = optionButtons || searchButtonOptions;
  return (
    <View style={containerStyle}>
      <SearchBar
        term={term}
        onTermChange={new_term => {
          setTerm(new_term);
          waitTime && clearTimeout(waitTime);
          setWaitTime(
            setTimeout(() => searchForTerm(new_term, searchType), 500)
          );
        }}
        onTermSubmit={async new_term => {
          setTerm(new_term);
          waitTime && clearTimeout(waitTime);
          searchForTerm(new_term, searchType);
        }}
        keyboardIsActive={keyboardIsActive}
      />
      {keyboardIsActive || term.length ? (
        <OptionBar
          onPress={new_type => {
            setSearchType(new_type);
            waitTime && clearTimeout(waitTime);
            searchForTerm(term, new_type);
          }}
          options={optionButtons}
          searchType={searchType}
        ></OptionBar>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({});

export default SearchItem;

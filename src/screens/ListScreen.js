import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import ScrollViewPadding from "../components/ScrollViewPadding";

const ListScreen = ({ navigation }) => {
  const fetchData = navigation.getParam("fetchData");
  const renderItem = navigation.getParam("renderItem");
  const keyExtractor = navigation.getParam("keyExtractor");
  let notPaginated = navigation.getParam("notPaginated");
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [allowRefresh, setAllowRefresh] = useState(true);
  const [startAfter, setStartAfter] = useState(null);

  const fetch = (limit, start_after) =>
    fetchData(limit, start_after).then(res => {
      setData(data ? [...data, ...res[0]] : res[0]);
      if (!res[0].length || notPaginated) return setAllowRefresh(false);
      return setStartAfter(res[1]);
    });

  useEffect(() => {
    setData(null);
    fetch(10, null);
  }, []);
  if (!data) return <View style={{ flex: 1, alignItems: "center" }}></View>;
  return (
    <View style={styles.containerStyle}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={async () => {
          if (!allowRefresh || refreshing) return;
          setRefreshing(true);
          await fetch(10, startAfter);
          setRefreshing(false);
        }}
        onEndReachedThreshold={0.3}
        initialNumToRender={10}
        ListFooterComponent={() =>
          refreshing ? (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small"></ActivityIndicator>
            </View>
          ) : null
        }
      ></FlatList>
      <ScrollViewPadding></ScrollViewPadding>
    </View>
  );
};

const styles = StyleSheet.create({
  headerStyle: {
    fontSize: 60
  },
  containerStyle: { flex: 1 }
});

ListScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam("title")
  };
};
export default ListScreen;

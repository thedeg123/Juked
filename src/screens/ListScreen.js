import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import ScrollViewPadding from "../components/ScrollViewPadding";

const ListScreen = ({ navigation }) => {
  const title = navigation.getParam("title"); // name of page
  const ids = navigation.getParam("ids");
  const fetchData = navigation.getParam("fetchData");
  const renderItem = navigation.getParam("renderItem");
  const keyExtractor = navigation.getParam("keyExtractor");
  const [data, setData] = useState(null);
  const headerComponent = () => <Text style={styles.headerStyle}>{title}</Text>;
  useEffect(() => {
    fetchData(ids).then(data => setData(data));
  }, []);
  if (!data) return <View style={{ flex: 1, alignItems: "center" }}></View>;
  return (
    <View style={styles.containerStyle}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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

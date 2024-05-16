import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {  Card } from "../constant/import";
import { ScrollView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const Phrase = () => {
  const router = useRouter();
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));

  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);

  const isLoadingFun = () => {
    if (isLoading) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text>Loading Category...</Text>
        </View>
      );
    } else {
      return "";
    }
  };

  /**
   * @desc get all data
   */

  const showData = () => {
    return (
      <>
        {phrases.map((item) => {
          return (
            <Card
              page="/(phrase)/Phrases"
              category="phrase"
              key={item.id}
              id={item.id}
              ctgType={item.type}
              ctgName={item.name}
              ctgPhoto={item.photo}
            />
          );
        })}
      </>
    );
  };

  useEffect(() => {
    db.transaction((tx) => {
      //  get all data in names table and push it names variable

      tx.executeSql(
        "SELECT * FROM category WHERE type = ?;",
        ["phrase"],
        (txObj, resultSet) => setPhrases(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    // if done set IsLoading = false ( finish loading )
    setIsLoading(false);
  });

  return (
    <ScrollView style={{ backgroundColor: "#eee", marginBottom: 10 }}>
      <Text> {isLoadingFun()}</Text>
      <SafeAreaView
        style={[
          { flex: 1, flexDirection: "row", flexWrap: "wrap", marginTop: -25 },
        ]}
      >
        {showData()}
      </SafeAreaView>
    </ScrollView>
  );
};

export default Phrase;

const styles = StyleSheet.create({});

import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
  ScrollView
} from "react-native";
import React, { useState, useEffect } from "react";
import { Msj, ModalPage, ModalWordQuiz } from "../../constant/import";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
const router = useRouter();

const { height, width } = Dimensions.get("window");

const Words = () => {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));
  const { ctgId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [words, setWords] = useState([]);

  const isLoadingFun = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <ActivityIndicator
          size="large"
          hidesWhenStopped={false}
          animating={true}
          color="#00ADEF"
        />
      </View>
    );
  };

  /**
   * @desc show data
   */

  const showData = () => {
    return (
      <>
        {words.map((item) => {
          return (
            <Msj
              key={item.id}
              id={item.id}
              word={item.word}
              translate={item.translate}
              ctgId={ctgId}
            />
          );
        })}
      </>
    );
  };

  /**
   * @desc get all words
   */

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM word WHERE category_id = ?;",
        [ctgId],
        (txObj, resultSet) => setWords(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
    });
    // if done set IsLoading = false ( finish loading )
  });

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, [ctgId]);


  return (
    <>
      <>
        <View
          style={{
            paddingTop: 5,
            marginHorizontal: 10,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <ModalPage ctgId={ctgId} />
          <ModalWordQuiz ctgId={ctgId} AllWords={words} />
        </View>
        {isLoading ? (
          isLoadingFun()
        ) : (
          <ScrollView style={{ flex: 1, margin: 10 }}>{showData()}</ScrollView>
        )}
      </>
    </>
  );
};

export default Words;


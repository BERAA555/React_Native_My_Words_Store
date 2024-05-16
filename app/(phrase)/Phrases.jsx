import {
  Dimensions,
  ActivityIndicator,
  Text,
  View,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { MsjPhrase, ModalPagePhrase , ModalPhraseQuiz } from "../../constant/import";
import * as SQLite from "expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
const router = useRouter();

const { height, width } = Dimensions.get("window");

const Phrases = () => {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));
  const { ctgId, isDBLoading } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setphrases] = useState([]);

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
        {phrases.map((item) => {
          return (
            <MsjPhrase
              key={item.id}
              id={item.id}
              phrase={item.phrase}
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
      //  get all data in names table and push it names variable
      tx.executeSql(
        "SELECT * FROM phrase WHERE category_id = ?;",
        [ctgId],
        (txObj, resultSet) => setphrases(resultSet.rows._array),
        (txObj, error) => console.log(error)
      );
      // setIsLoading(false);
    });
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
          <ModalPagePhrase ctgId={ctgId} />
          <ModalPhraseQuiz ctgId={ctgId} AllPhrases={phrases} />

        </View>

        {isLoading ? (
          isLoadingFun()
        ) : (
          <ScrollView style={{ flex: 1, margin: 10, display: "flex" }}>
            {showData()}
          </ScrollView>
        )}
      </>
    </>
  );
};

export default Phrases;

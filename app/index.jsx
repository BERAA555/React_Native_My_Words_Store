import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const { height, width } = Dimensions.get("window");

const index = () => {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));

  useEffect(() => {
    db.transaction((tx) => {
      //  get all data in names table and push it names variable

      tx.executeSql(`CREATE TABLE IF NOT EXISTS "category" (
      "id"	INTEGER NOT NULL,
      "name"	TEXT NOT NULL,
      "type"	TEXT NOT NULL,
      "photo"	TEXT NOT NULL,
      PRIMARY KEY("id" AUTOINCREMENT)
    );`);

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "word" (
           "id"	INTEGER NOT NULL,
           "word"	TEXT NOT NULL UNIQUE,
           "translate"	TEXT NOT NULL,
           "category_id"	INTEGER NOT NULL,
           PRIMARY KEY("id" AUTOINCREMENT)
         );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "phrase" (
        "id"	INTEGER NOT NULL,
        "phrase"	TEXT NOT NULL UNIQUE,
        "translate"	TEXT NOT NULL,
        "category_id"	INTEGER NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`
      );
    });
  },[db]);


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={logo} resizeMode="cover" style={styles.logo} />
        <Text style={styles.logoText}>My Words Store</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.bodyTextOne}>
          My Words Store Application was built to enable you to store the words
          and phrases which you have memorized.
        </Text>
        <Text style={styles.bodyTextTwo}>
          and enable you to make quiz for it.{" "}
        </Text>
        <Text style={styles.bodyTextThree}>enjoy studying</Text>
      </View>
      <View style={styles.footer}>
        <View style={{ flex: 0.5 }}></View>
        <Text style={styles.footerTextOne}>
          this applications make By
          <Text style={styles.footerTextOneMy}> Baraa Jaza</Text>
        </Text>
        <Text style={styles.footerTextTwo}>www.beraaceze@gmail.ocm</Text>
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
  },
  logoText: {
    marginTop: 5,
    color: "#4d4d4d",
  },
  body: {
    flex: 1,
    width: width * 0.9,
    backgroundColor: "#00ADEF",
    padding: 20,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  bodyTextOne: {
    color: "#eee",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 18,
    textTransform: "capitalize",
  },
  bodyTextTwo: {
    color: "#eee",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 15,
    textTransform: "capitalize",
  },
  bodyTextThree: {
    color: "#eee",
    fontSize: 18,
    textAlign: "center",
    marginVertical: 15,
    textTransform: "capitalize",
  },

  footer: {
    flex: 1,
    width: width * 0.8,
    alignItems: "center",
  },
  footerTextOne: {
    marginBottom: 10,
    textTransform: "capitalize",
  },
  footerTextOneMy: {
    color: "#00ADEF",
    textTransform: "capitalize",
  },
  footerTextTwo: {
    color: "#00ADEF",
  },
});

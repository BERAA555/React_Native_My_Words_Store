import react, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  Pressable,
  Alert,
  Platform,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drawer } from "expo-router/drawer";
import { DrawerItemList } from "@react-navigation/drawer";
import logo from "../assets/logo.png";
import { ModalPageAddCtg, ModalPageAddPhraseCtg } from "../constant/import";

// *********************************************************

import * as Sharing from "expo-sharing";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";

/**
 *
 *
 * @export
 * @return
 */
export default function Layout() {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));
  const [isLoading, setIsLoading] = useState(false);

  const importDb = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.type === "success" || result.assets[0].name) {
      setIsLoading(true);
      if (
        !(
          await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")
        ).exists
      ) {
        await FileSystem.makeDirectoryAsync(
          FileSystem.documentDirectory + "SQLite"
        );
      }

      const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await FileSystem.writeAsStringAsync(
        FileSystem.documentDirectory + "SQLite/MyWordsStore.db",
        base64,
        { encoding: FileSystem.EncodingType.Base64 }
      );
      await db.closeAsync();
      setDb(SQLite.openDatabase("MyWordsStore.db"));
    }

    const timerId = setTimeout(() => {
      Alert.alert("Warn! ", "Please Return Your App", [
        { text: "OK", onPress: () => BackHandler.exitApp() },
      ]);
    }, 1000);
  };
  //
  const exportDb = async () => {
    if (Platform.OS === "android") {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + "SQLite/MyWordsStore.db",
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        await FileSystem.StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          "MyWordsStore.db",
          "application/octet-stream"
        )
          .then(async (uri) => {
            await FileSystem.writeAsStringAsync(uri, base64, {
              encoding: FileSystem.EncodingType.Base64,
            });
          })
          .catch((e) => console.log(e));
      } else {
        console.log("Permission not granted");
      }
    } else {
      await Sharing.shareAsync(
        FileSystem.documentDirectory + "SQLite/MyWordsStore.db"
      );
    }
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS "category" (
        "id"    INTEGER NOT NULL,
        "name"  TEXT NOT NULL,
        "type"  TEXT NOT NULL,
        "photo" TEXT NOT NULL,
        PRIMARY KEY("id" AUTOINCREMENT)
      );`);

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "word" (
             "id"       INTEGER NOT NULL,
             "word"     TEXT NOT NULL UNIQUE,
             "translate"        TEXT NOT NULL,
             "category_id"      INTEGER NOT NULL,
             PRIMARY KEY("id" AUTOINCREMENT)
           );`
      );

      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS "phrase" (
          "id"  INTEGER NOT NULL,
          "phrase"      TEXT NOT NULL UNIQUE,
          "translate"   TEXT NOT NULL,
          "category_id" INTEGER NOT NULL,
          PRIMARY KEY("id" AUTOINCREMENT)
        );`
      );
    });

    setIsLoading(false);
  }, [db]);

  if (isLoading) {
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
  }

  return (
    <Drawer
      drawerContent={
        // to make design for Drawer
        (props) => {
          return (
            <SafeAreaView style={styles.container}>
              <View style={styles.header}>
                <Image source={logo} resizeMode="cover" style={styles.logo} />
                <Text style={styles.logoText}>My Words Store</Text>
              </View>

              <DrawerItemList {...props} />
              <View>
                <Pressable style={styles.importButton} onPress={importDb}>
                  <MaterialCommunityIcons
                    name="database-import-outline"
                    size={20}
                    color="#808080"
                  />
                  <Text style={styles.importText}>Import Data</Text>
                </Pressable>

                <Pressable
                  style={[styles.importButton, { marginTop: 30 }]}
                  onPress={exportDb}
                >
                  <MaterialCommunityIcons
                    name="database-export-outline"
                    size={20}
                    color="#808080"
                  />
                  <Text style={styles.importText}>Export Data</Text>
                </Pressable>
              </View>
            </SafeAreaView>
          );
        }
      }
    >
      <Drawer.Screen // we add all screen here in layout page
        name="index"
        options={{
          drawerLabel: "Home",
          title: "Welcome",
          drawerIcon: () => <AntDesign name="home" size={20} color="#808080" />,
        }}
        // component={Home}
      />
      <Drawer.Screen
        name="Word"
        options={{
          drawerLabel: "Words",
          title: "Words",
          drawerIcon: () => (
            <AntDesign name="wordfile1" size={20} color="#808080" />
          ),
          headerRight: () => <ModalPageAddCtg />,
        }}
      />

      <Drawer.Screen
        name="Phrase"
        // component={Profile}
        options={{
          drawerLabel: "Phrases",
          title: "Phrases",
          drawerIcon: () => (
            <MaterialCommunityIcons
              name="file-table"
              size={20}
              color="#808080"
            />
          ),
          headerRight: () => <ModalPageAddPhraseCtg />,
        }}
      />

      <Drawer.Screen
        name="(word)"
        style={{}}
        options={{
          drawerLabel: () => {
            null;
          },
          title: null,
          headerShown: false,
          drawerItemStyle: { height: 0 },
        }}
      />

      <Drawer.Screen
        name="(phrase)"
        style={{}}
        options={{
          drawerLabel: () => {
            null;
          },
          title: null,
          headerShown: false,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 0.7,
    justifyContent: "center",
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoText: {
    marginTop: 10,
    color: "#4d4d4d",
  },
  importButton: {
    flexDirection: "row",
    marginLeft: 20,
    //
  },

  importText: {
    marginLeft: 30,
    color: "#656566",
    fontWeight: "500",
  },
});

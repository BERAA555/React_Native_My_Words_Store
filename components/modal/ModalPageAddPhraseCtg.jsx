import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";

const { height, width } = Dimensions.get("window");

const ModalPageAddPhraseCtg = (props) => {
  // open database
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));

  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [categories, setCatagories] = useState([]);
  const closeModal = () => {
    setText("");
    setModalVisible(!modalVisible);
  };

  const addPhrase = () => {
    if (text.length == 0 ) {
      return Alert.alert("Warn!", "Please Enter Category Name");
    } 

    if (text.length > 15 ) {
      return Alert.alert("Warn!", "Category Name Is Very Larg ,Should Be Less Than 15 Letters");
    
    } else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            "INSERT INTO category (name , type , photo ) values (? ,? , ? )",
            [text, "phrase", "asd"],
            (txObj, resultSet) => {
              Alert.alert("Successfuly!", "The Category Added Successfuly");
              setText("");
              setModalVisible(!modalVisible);
            },
            (txObj, error) => console.warn(error)
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              autoFocus={true}
              onChangeText={(text) => {
                setText(text.trimStart());
              }}
              value={text}
              textAlign="center"
              placeholder="Add Category"
            />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { backgroundColor: "#ff3333" },
                ]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={addPhrase}
              >
                <Text style={styles.textStyle}>Add </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Add Category</Text>
      </Pressable>
    </View>
  );
};

export default ModalPageAddPhraseCtg;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",

    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.7,
    height: width * 0.4,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    width: width * 0.3,
    height: width * 0.1,
    margin: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#00ADEF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    marginBottom: 20,
    borderWidth: 1,
    padding: 5,
    width: width * 0.5,
    borderRadius: 20,
    borderColor: "#808080",
    color: "#808080",
  },
});

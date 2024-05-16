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
import React, { useState } from "react";
import * as SQLite from "expo-sqlite";

const { height, width } = Dimensions.get("window");
const ModalPagePhrase = (props) => {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));
  const [modalVisible, setModalVisible] = useState(false);
  const [text, setText] = useState("");
  const [translate, setTranslate] = useState("");

  const addPhrase = () => {
    if (text.length == 0 || translate.length == 0) {
      return Alert.alert("Warn!", "Please Enter Write Phrase And Translate");
    } 
    
    if (text.length > 45 || translate.length > 45){
      return Alert.alert("Warn!", "The Phrase Or Translate Is Very Long");
    }else {
      try {
        db.transaction((tx) => {
          tx.executeSql(
            `SELECT phrase FROM phrase WHERE phrase = ? `,
            [text],
            (txObj, resultSet) => {
              if (resultSet.rows._array[0] === undefined) {
                tx.executeSql(
                  "INSERT INTO phrase (phrase , translate , category_id ) values (? ,? , ? )",
                  [text, translate, props.ctgId],
                  (txObj, resultSet) => {
                    Alert.alert("Successfuly!", "The Phrase Added Successfuly");
                    setText("");
                    setTranslate("");
                    setModalVisible(!modalVisible);
                  },
                  (txObj, error) => console.warn(error)
                );
              } else {
                Alert.alert("Warn!", "There Is Same Phrase");
                setText("");
                setTranslate("");
                setModalVisible(!modalVisible);
              }
            },
            (txObj, error) => {
              console.warn(error);
            }
          );
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  const closeModal = () => {
    setText("");
    setTranslate("");
    setModalVisible(!modalVisible);
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
              placeholder="Phrase"
            />
            <TextInput
              style={styles.input}
              onChangeText={(translate) => {
                setTranslate(translate.trimStart());
              }}
              value={translate}
              textAlign="center"
              placeholder="Translate"
            />
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  { backgroundColor: "#00ADEF" },
                ]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={addPhrase}
              >
                <Text style={styles.textStyle}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Add Phrase </Text>
      </Pressable>
    </View>
  );
};

export default ModalPagePhrase;

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
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.7,
    height: width * 0.6,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    width: width * 0.25,
    height: width * 0.1,
    margin: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#00ADEF",
  },
  buttonClose: {
    backgroundColor: "#00b300",
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

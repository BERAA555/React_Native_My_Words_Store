import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from "react-native";
import React, { useState } from "react";
import * as SQLite from "expo-sqlite";

const { height, width } = Dimensions.get("window");

const MsjPhrase = (props) => {
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));
  const [modalVisible, setModalVisible] = useState(false);

  const DeletePhrase = (id) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM phrase WHERE id = ? ",
          [props.id],
          (txObj, resultSet) => {
            Alert.alert("Successfuly!", "The Phrase Deleted Successfuly");
          },
          (txObj, error) => console.warn(error)
        );
      });
      setModalVisible(!modalVisible);
    } catch (error) {
      console.log(error);
    }
  };

  const openCloseModal = () => {
    setModalVisible(!modalVisible);
  };
  return (
    <View>
      <Pressable style={styles.cardView} onLongPress={openCloseModal}>
        <View style={styles.leftViewWord}>
          <Text style={styles.leftTextWord}>- {props.phrase} </Text>
        </View>
        <View style={styles.rightViewWord}>
          <Text style={styles.rightTextWord}>- {props.translate} </Text>
        </View>
      </Pressable>
      <View>
        <Modal animationType="fade" transparent={true} visible={modalVisible}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "#00ADEF" },
                  ]}
                  onPress={openCloseModal}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={DeletePhrase}
                >
                  <Text style={styles.textStyle}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default MsjPhrase;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
  },
  cardView: {
    flex: 1,
    backgroundColor: "#00ADEF",
    padding: 15,
    justifyContent: "space-between",
    borderRadius: 15,
    marginVertical: 10,
  },

  leftViewWord: {},
  leftTextWord: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
  },
  rightViewWord: {},
  rightTextWord: {
    color: "#fff",
    fontSize: 16,
    textTransform: "capitalize",
  },

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
    width: width * 0.6,
    height: width * 0.3,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    width: width * 0.22,
    height: (width * 0.22) / 2,
    margin: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#4d4dff",
  },
  buttonClose: {
    backgroundColor: "#ff3333",
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

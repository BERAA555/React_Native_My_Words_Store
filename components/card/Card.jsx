import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  Pressable,
  Modal,
  Alert,
} from "react-native";
import FoodPhoto from "../../assets/images/photo1.jpg";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SQLite from "expo-sqlite";

const { height, width } = Dimensions.get("window");
const Card = (props) => {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCatagories] = useState([]);
  const [db, setDb] = useState(SQLite.openDatabase("MyWordsStore.db"));

  const DeleteCatagory = (id) => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `DELETE FROM ${props.ctgType} WHERE category_id = ? `,
          [id],
          (txObj, resultSet) => {
          },
          (txObj, error) => console.log(error)
        );
      });
      db.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM category WHERE id = ? ",
          [id],
          (txObj, resultSet) => {
            Alert.alert("Successfuly!", "The Category Deleted Successfuly");
          },
          (txObj, error) => console.log(error)
        );
      });

      setModalVisible(!modalVisible);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModal = () => {
    setModalVisible(!modalVisible);
  };

  return (
    <View>
      <Pressable
        onPress={() =>
          router.push({
            pathname: props.page,
            params: { ctgId: props.id, isDBLoading: "none" },
          })
        }
        onLongPress={() => {
          setModalVisible(true);
        }}
      >
        <LinearGradient colors={["#fff", "#fff"]} style={styles.card}>
          <View style={styles.cardBorderImage}>
            <Image
              style={styles.cardImage}
              source={FoodPhoto}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.cardText}> {props.ctgName} </Text>
        </LinearGradient>
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
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => DeleteCatagory(props.id)}
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

export default Card;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: width * 0.6,
    height: width * 0.3,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: width * 0.22,
    height: (width * 0.22) / 2,
    margin: 5,
    elevation: 2,
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

  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  card: {
    margin: 6,
    width: width * 0.47,
    height: width * 0.48,
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  cardBorderImage: {
    width: width * 0.3,
    height: width * 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderRadius: 20,
  },

  cardImage: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 50,
  },
  cardText: {
    textTransform: "capitalize",
    color: "#666",
    fontSize: 16,
  },
});

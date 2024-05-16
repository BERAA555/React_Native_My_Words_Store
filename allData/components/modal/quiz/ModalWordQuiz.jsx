import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Alert,
  FlatList,
  Animated,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { MaterialIcons, AntDesign, EvilIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

const ModalQuiz = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [exitVisible, setExitVisible] = useState("flex");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [check, setCheck] = useState("#eee");
  const [text, setText] = useState("");
  const [wordMean, setWordMean] = useState("");
  const [visibleScore, setVisibleScore] = useState("none");
  const [visibleQuiz, setVisibleQuiz] = useState("flex");

  const [score, setScore] = useState(0);

  const [indexNumber, setIndexNumber] = useState(1);

  const [words, setWords] = useState(props.AllWords);
  const [refFlatList, setRefFlatList] = useState();

  //  close model
  const closeModal = () => {
    setIndexNumber(1);
    fadeOut(0);
    setText("");
    setCheck("#eee");
    setScore(0);
    setVisibleQuiz("flex");
    setVisibleScore("none");
    setModalVisible(!modalVisible);
  };

  // change border shadow color when check
  const Chack = (color) => {
    setCheck(color);
  };

  // setting heighi of page
  getItemLayout = (data, index) => ({
    length: height,
    offset: height * index,
    index,
  });

  const fadeIn = (speed) => {
    // function to change fadeAnim value to 1 during 5 second
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: speed,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = (speed) => {
    // function to change fadeAnim value to 0 during 5 second
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: speed,
      useNativeDriver: true,
    }).start();
  };

  //  scroll to index
  scrollToIndex = () => {
    if (text.trim() == "") {
      Alert.alert("Warn!", "You Should Write Answer");
    } else {
      if (text.trim().toLowerCase() == wordMean.trim().toLowerCase()) {
        Chack("#00cc00");
        setScore(score + 1);
        fadeIn(1000);
        setExitVisible("none");
      } else {
        Chack("#ff8080");
        setExitVisible("none");
        fadeIn(1000);
      }

      const timerId = setTimeout(() => {
        fadeOut(0);
        setExitVisible("flex");
        setCheck("#eee");

        if (indexNumber == props.AllWords.length) {
          setVisibleQuiz("none");
          setVisibleScore("flex");
        } else {
          refFlatList.scrollToIndex({ animated: true, index: indexNumber });
          setIndexNumber(indexNumber + 1);
          setText("");
        }
      }, 2000);
    }
  };

  const showData = () => {
    return (
      <FlatList
        data={props.AllWords}
        style={{ height: 600 }}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        horizontal={false}
        ref={(ref) => setRefFlatList(ref)}
        getItemLayout={getItemLayout}
        renderItem={({ item }) => {
          return (
            <>
              <View
                style={[
                  styles.centeredView,
                  { height: height, display: visibleQuiz },
                ]}
              >
                <View
                  style={[
                    styles.modalView,
                    {
                      shadowColor: check,
                      borderColor: check,
                      borderWidth: 5,
                      marginBottom: height * 0.3,
                    },
                  ]}
                >
                  <ScrollView
                    scrollEnabled={true}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginBottom: -100 }}
                  >
                    <Text
                      style={{
                        marginBottom: 30,
                        color: "#808080",
                        fontSize: 20,
                        textTransform: "capitalize",
                      }}
                    >
                      - {item.translate} -
                    </Text>
                  </ScrollView>

                  <TextInput
                    style={styles.input}
                    onChangeText={(text) => {
                      setText(text.trimStart());
                      setWordMean(item.word);
                    }}
                    value={text}
                    textAlign="center"
                    placeholder="Translate"
                  />

                  <View
                    style={{ flex: 1, flexDirection: "row", marginBottom: 10 }}
                  >
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={scrollToIndex}
                    >
                      <Text style={styles.textStyle}>Next</Text>
                    </Pressable>
                  </View>

                  <Animated.View
                    style={[
                      styles.answer,
                      { opacity: fadeAnim, backgroundColor: check },
                    ]}
                  >
                    <Text style={styles.answerText}>{item.word}</Text>
                  </Animated.View>
                </View>
              </View>
            </>
          );
        }}
        keyExtractor={(item) => item.id}
        contentContainserStyle={{ columnGap: 12 }} // style for FlatList content
      />
    );
  };

  // last page in quiz where show score

  const showScore = () => {
    return (
      <View
        style={[
          styles.centeredView,
          {
            height: height,
            display: visibleScore,
            position: "absolute",
            flex: 1,
            alignSelf: "center",
          },
        ]}
      >
        <View
          style={[
            styles.modalView,
            {
              shadowColor: "black",
              height: width * 0.4,
            },
          ]}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignSelf: "center" }}
          >
            <Text
              style={{
                justifyContent: "center",
                textAlign: "center",
                color: "#808080",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              {(score * 100) / props.AllWords.length > 85
                ? "Excellent"
                : (score * 100) / props.AllWords.length > 65
                ? "Good"
                : (score * 100) / props.AllWords.length > 50
                ? "Not Bad"
                : "Try Again"}
            </Text>

            <Text
              style={{
                alignContent: "center",
                color: "#fff",
                fontSize: 20,
                textAlign: "center",
                backgroundColor:
                  (score * 100) / props.AllWords.length > 50
                    ? "#00cc00"
                    : "#ff8080",
                paddingHorizontal: 40,
                paddingVertical: 15,
                borderRadius: 20,
              }}
            >
              {((score * 100) / props.AllWords.length).toFixed(0)} %
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View>
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}>
          <Pressable
            onPress={closeModal}
            style={{
              alignItems: "center",
              position: "absolute",
              right: 20,
              display: exitVisible,
            }}
          >
            <AntDesign name="closecircleo" size={24} color="#808080" />
          </Pressable>
          <Text style={{ color: "#808080", fontSize: 20 }}>Good Luck</Text>
        </View>
        {showData()}
        {showScore()}
      </Modal>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Quiz</Text>
      </Pressable>
    </View>
  );
};

export default ModalQuiz;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: height * 0.9,
  },
  modalView: {
    backgroundColor: "#eee",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 30,
    width: width * 0.8,
    height: width * 0.72,
  },
  button: {
    borderRadius: 10,
    justifyContent: "center",
    width: width * 0.22,
    height: width * 0.1,
    margin: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#00ADEF",
  },
  buttonClose: {
    backgroundColor: "#00ADEF",
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
    width: width * 0.6,
    borderRadius: 20,
    borderColor: "#808080",
    color: "#808080",
  },

  answer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    position: "absolute",
    bottom: -120,
    borderRadius: 20,
    // borderTopRightRadius: 0,
    // borderTopLeftRadius: 0,
    height: 80,
  },
  answerText: {
    color: "#fff",
    width: width * 0.7,
    textAlign: "center",
    padding: 15,
    fontSize: 18,
    textTransform: "capitalize",
    fontWeight: "600",
  },
});

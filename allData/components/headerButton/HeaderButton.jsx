import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import {  useRouter } from "expo-router";

const HeaderButton = (props) => {

  const router = useRouter(); 

  return (
    <Pressable
      onPress={props.handleButton}
    >
      <Text style>Add Wordsssssssssssssss</Text>
    </Pressable>
  );
};

export default HeaderButton;

const styles = StyleSheet.create({});

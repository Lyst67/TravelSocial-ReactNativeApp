import {
  View,
  ImageBackground,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React from "react";
import RegisterComponent from "@/components/registerComponent";
import { useLocalSearchParams } from "expo-router";

export default function RegisterScreen() {
  const { userEmail } = useLocalSearchParams<{ userEmail: string }>();

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/images/photo-bg.png")}
          resizeMode="cover"
          style={styles.backgroundImage}
        >
          <RegisterComponent userEmail={userEmail} />
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgray",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

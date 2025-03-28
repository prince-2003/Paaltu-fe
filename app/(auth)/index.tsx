import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {images} from "@/constants/Images"
import { useAuthStore } from "@/store/authStore";

// Adjust the path to match where your image is stored
// For example, if the image is in `assets/` folder, use: require("../assets/index-dog.png")


export default function Index() {
  const router = useRouter();
  
  

  return (
    <View style={styles.container}>
     
      <Image source={images.indexdog} style={styles.image} />

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={()=>router.push("/(auth)/login")}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      {/* Terms and Conditions Link */}
      <TouchableOpacity onPress={() => router.push("/terms")}>
        <Text style={styles.termsText}>Terms and Conditions</Text>
      </TouchableOpacity>
    </View>
  );
}

// Basic styling to center content
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 30,
    resizeMode: "contain",
  },
  button: {
    width: "80%",
    padding: 15,
    marginVertical: 8,
    backgroundColor: "#000",
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  termsText: {
    marginTop: 20,
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
  },
});

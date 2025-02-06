import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function LoadingScreen() {
  const [fadeOut, setFadeOut] = useState(false);
  const navigation = useNavigation();

  // Trigger the fade-out effect and navigate to HomeScreen after the fade duration
  useEffect(() => {
    // Trigger the fade-out after 2 seconds
    const fadeTimeout = setTimeout(() => {
      setFadeOut(true);
    }, 2000);

    // Navigate to HomeScreen after 4 seconds (matching the fade-out duration)
    const navigationTimeout = setTimeout(() => {
      navigation.replace("HomeScreen");
    }, 2000); // Match this timeout with your fade-out time

    // Cleanup timeouts on component unmount
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(navigationTimeout);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        fadeDuration={2000} // Fade duration for the logo image
        style={[styles.logo, fadeOut && styles.fadeOut]} // Apply fadeOut style after timeout
        source={require("../assets/gopal-dairy-high-resolution-logo.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 250,
    height: 250,
    opacity: 1, // Initial opacity (fully visible)
    transition: "opacity 2s ease-out", // Smooth transition effect for opacity
  },
  fadeOut: {
    opacity: 0, // Fade out the logo by reducing its opacity
  },
});

export default LoadingScreen;

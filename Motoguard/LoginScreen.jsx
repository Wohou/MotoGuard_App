import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { db } from "./GetData";
import { ref, set, get } from "firebase/database";
import './App';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);

  const togglePasswordVisibility = () => {
    setIsPasswordHidden(!isPasswordHidden);
  };

  const checkData = async () => {
    console.log("checkData TODO");
    navigation.navigate("Map");
    if (!global.email) {
      global.email = email;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motoguard</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#e6e6e6"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#e6e6e6"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={isPasswordHidden}
        style={styles.input}
      />

      <TouchableOpacity onPress={togglePasswordVisibility}>
        <Text style={styles.togglePasswordText}>
          {isPasswordHidden ? "Afficher" : "Cacher"} le mot de passe
        </Text>
      </TouchableOpacity>

      <Pressable title="Se connecter" onPress={checkData} style={styles.button}>
        <Text style={styles.buttontext}> Connexion </Text>
      </Pressable>

      <Text style={styles.textUnderButton}>
        <TouchableOpacity onPress={() => navigation.navigate("Create")}>
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "#C1121F" }}>
            Pas de compte ? Créez en un ici
          </Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#343330",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 40,
    color: "red",
    fontWeight: "bold",
    marginBottom: "10%",
  },
  input: {
    marginBottom: "5%",
    backgroundColor: "#432e2e",
    width: Dimensions.get("window").width - 60,
    alignItems: "center",
    height: 50,
    borderColor: "#000",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  },
  button: {
    width: Dimensions.get("window").width - 40,
    marginTop: "5%",
    height: 40,
    backgroundColor: "#C1121F",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttontext: {
    fontSize: 30,
  },
  textUnderButton: {
    marginTop: "2%",
    fontSize: 15,
    color: "#C1121F",
  },
  togglePasswordText: {
    fontSize: 15,
    color: "#C1121F",
    marginTop: "2%",
  },
});

export default LoginScreen;

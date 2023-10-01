import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, Dimensions} from "react-native";
import { db } from "./GetData";
import { ref, set, get } from 'firebase/database';
import { encode } from 'base-64';
import uuid from 'react-native-uuid';

const CreateLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const checkEmailExists = async () => {
    const encodedMail = btoa(email.trim().toLowerCase());
    const snapshot = await get(ref(db, `posts/${encodedMail}`));
    return snapshot.exists();
  };

  const addData = async () => {
    if (!global.btoa) {
      global.btoa = encode;
    }
    const trimmedEmail = email.trim().toLowerCase();
    const emailExist = await checkEmailExists();
    if (!email || !password) {
        alert("Veuilez verifiez vos informations");
        return;
    }
    if (emailExist) {
        alert('L\'adresse mail existe déjà.');
        return;
    }
    const encodedMail = btoa(email);
    set(ref(db, `posts/${encodedMail}`), {
      email: trimmedEmail,
      password: password,
      uuid: uuid.v1(),
    });
    setEmail('')
    setPassword('')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Motoguard</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#e6e6e6" 
        value={email}
        onChangeText= {(text) => setEmail(text)}
        style={styles.input}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#e6e6e6" 
        value={password}
        onChangeText= {(text) => setPassword(text)}
        style={styles.input}
      />

      <Pressable
        title="Se connecter"
        onPress={addData}
        style={styles.button}
        >
        <Text style={styles.buttontext}> Créez </Text>
        </Pressable>
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
    marginTop: "30%",
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
  }
});

export default CreateLogin;
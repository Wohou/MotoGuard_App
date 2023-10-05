import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { ref, set, get, update } from 'firebase/database';
import { db } from './GetData';
import {encode as btoa} from 'base-64';
import {global} from './App';

const ProfilePage = () => {
  const [pseudo, setPseudo] = useState('Utilisateur');
  const [NewPseudo, setNewPseudo] = useState(pseudo);
  const [ProfilePhoto, setProfilePhoto] = useState("https://images.caradisiac.com/images/1/7/4/6/191746/S0-honda-presente-la-cbr500r-2022-688481.jpg");

    useEffect(() => {
        const getPseudoFromDb =  async () => {
            encodeMail = btoa("user@example.com");
            // encodeMail = btoa(global.mail.trim().toLowerCase());
            const response = await get(ref(db, `posts/${encodeMail}`));
            console.log("Get pseudo:", response.exportVal().pseudo);
            setPseudo(response.exportVal().pseudo);
        };
        getPseudoFromDb();
    }, []);


    const changePseudoDb = async () => {
        try {
          encodeMail = btoa("user@example.com")
          // encodeMail = btoa(global.mail.trim().toLowerCase());

          const currentData = await get(ref(db, `posts/${encodeMail}`));
          const currentPseudo = currentData.exportVal().pseudo;

          if (currentPseudo !== NewPseudo) {
            await update(ref(db, `posts/${encodeMail}`), {
              pseudo: NewPseudo.trim(),
            });

            setPseudo(NewPseudo.trim());

            console.log("Pseudo mis à jour avec succès !");
          } else {
            console.log("Le pseudo est le même. Aucune mise à jour nécessaire.");
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour du pseudo :", error);
        }
      };

  return (
    <View style={styles.container}>
      <Image
        source={{uri :ProfilePhoto}}
        style={styles.profileImage}
      />
      <Text style={styles.welcomeText}>
        Bienvenue
        <Text style={styles.PseudoText}> {pseudo}</Text>
        </Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre pseudo"
        placeholderTextColor="white"
        onChangeText={(newPseudo) => setNewPseudo(newPseudo)}
        />
        <Text onPress={() => {changePseudoDb()}} style={{ fontWeight: "bold", fontSize: 20, color: "#C1121F" }}>
            Ajouter
        </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#343330",
  },
  welcomeText: {
    marginTop: "2%",
    fontSize: 20,
    marginBottom: 20,
    color: "white",
  },
  PseudoText: {
    marginTop: "2%",
    fontSize: 20,
    marginBottom: 20,
    color: "white",
    fontWeight: "bold",
  },
  profileImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  input: {
    marginTop: 20,
    height: 40,
    width: '80%',
    borderColor: 'red',
    borderRadius: 5,
    borderWidth: 1,
    paddingLeft: 10,
    color: "white",
  },
});

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import { ref, set, get, update } from 'firebase/database';
import { db } from './GetData';
import {encode as btoa} from 'base-64';
import {global} from './App';

const ProfilePage = () => {
  const [pseudo, setPseudo] = useState('Utilisateur');
  const [NewPseudo, setNewPseudo] = useState(pseudo);
  const [ProfilePhoto, setProfilePhoto] = useState('');

    useEffect(() => {
        const getPseudoFromDb =  async () => {
            encodeMail = btoa("user@example.com");
            // encodeMail = btoa(global.mail.trim().toLowerCase());
            const response = await get(ref(db, `posts/${encodeMail}`));
            console.log("Get pseudo:", response.exportVal().pseudo);
            setProfilePhoto(response.exportVal().pdp)
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

      const changeImageDb = async () => {
        try {
          encodeMail = btoa("user@example.com")
          // encodeMail = btoa(global.mail.trim().toLowerCase());

          const currentData = await get(ref(db, `posts/${encodeMail}`));
          const currentImage = currentData.exportVal().pdp;

          if (currentImage !== NewImage) {
            await update(ref(db, `posts/${encodeMail}`), {
              pseudo: NewImage.trim(),
            });

            setPseudo(NewImage.trim());

            console.log("Image mis à jour avec succès !");
          } else {
            console.log("L'image est la même. Aucune mise à jour nécessaire.");
          }
        } catch (error) {
          console.error("Erreur lors de la mise à jour de l'image :", error);
        }
      };

  return (
    <View style={styles.container}>
      {ProfilePhoto && (
        <Image
          source={{ uri: ProfilePhoto }}
          style={styles.profileImage}
        />
      )}
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
        <Text onPress={() => {changeImageDb()}} style={{ fontWeight: "bold", fontSize: 20, color: "#C1121F", marginTop: 50}}>
        ✏️ Changer La Photo de profil
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

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, get, update } from 'firebase/database';
import { db } from './GetData';
import {encode as btoa} from 'base-64';

const ProfilePage = () => {
  encodeMail = btoa(window.email);
  const [pseudo, setPseudo] = useState('Utilisateur');
  const [ProfilePhoto, setProfilePhoto] = useState('https://www.poleposition77.com/wp-content/uploads/2021/06/KTM-390-Duke-grise.jpg');

  const [NewPDP, SetNewPDP] = useState(ProfilePhoto);
  const [NewPseudo, setNewPseudo] = useState(pseudo);

    useEffect(() => {
        const getDataFromDb =  async () => {
            const response = await get(ref(db, `posts/${encodeMail}`));
            setProfilePhoto(response.exportVal().pdp)
            setPseudo(response.exportVal().pseudo);
        };
        getDataFromDb();
    }, []);

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        SetNewPDP(result.uri);
        changeImageDB(result.uri);
      }
    };

    const changeImageDB = (newPDP) => {
      update(ref(db, `posts/${encodeMail}`), {
        pdp: newPDP,
      })
        .then(() => {
          setProfilePhoto(newPDP);
          console.log("Image mise à jour avec succès !");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour de l'image :", error);
        });
    };

    const changePseudoDb = async () => {
        try {
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
        placeholder="Changez votre pseudo"
        placeholderTextColor="white"
        onChangeText={(newPseudo) => setNewPseudo(newPseudo)}
        />
        <Text onPress={() => {changePseudoDb()}} style={{ fontWeight: "bold", fontSize: 20, color: "#C1121F", marginTop: 5}}>
            Envoyez
        </Text>
        <Text onPress={() => {pickImage()}} style={{ fontWeight: "bold", fontSize: 20, color: "#C1121F", marginTop: 30}}>
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
    marginBottom: 5,
    color: "white",
  },
  PseudoText: {
    marginTop: "2%",
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
  },
  profileImage: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  input: {
    marginTop: 10,
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

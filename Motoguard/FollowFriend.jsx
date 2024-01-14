import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput } from "react-native";
import { encode as btoa } from 'base-64';
import { ref, get, update } from 'firebase/database';
import { db } from './GetData';

const FollowFriend = ({ navigation }) => {
    const encodeMail = btoa(window.email)
    const [NumberFriend, setNumberFriend] = useState(0);
    let [FriendsArray, setFriendsArray] = useState([]);
    const [FriendToAdd, SetFriendToADd] = useState('');
    const [FriendData, SetDataFriend] = useState([]);

    useEffect(() => {
        GetFriendFromDB();
    }, []);

    const GetDBResponse = async (MailTest) => {
        try {
            const response = await get(ref(db, `posts/${MailTest}`));
            const data = response.exportVal();
            if (data) {
                SetDataFriend([data.pdp, data.pseudo, data.email]);
            } else {
                alert("Friend Not Found.");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const AddFriendToDB = (Friend_Name) => {
        let FriendExist = false;
        const email_to_test = Friend_Name.toLocaleLowerCase().trim()
        const email_to_test_encoded = btoa(email_to_test);
        console.log(email_to_test_encoded);
        if (encodeMail === email_to_test_encoded) {
            alert("You cannot friend yourself !")
            return
        }
        else {
            const response = GetDBResponse(email_to_test_encoded);
            if (response != false) {
                FriendExist = true;
            }
        }
        if (FriendData && FriendData[2] && !FriendsArray.includes(FriendData[2])) {
            FriendsArray.push(FriendData[2])
            console.log("here", FriendsArray);
        }
        update(ref(db, `posts/${encodeMail}`), {
            friend: FriendsArray,
        })
          .then(() => {
            alert("Added Friend Successfully");
            setNumberFriend(NumberFriend + 1);
          })
    }

    const handleFriendPress = (friendName) => {
        window.friend_followed = friendName;
        console.log(`Friend clicked : ${window.friend_followed}`);
        navigation.navigate("MapFriend");
    }

    const GetFriendFromDB = async () => {
        try {
            const response = await get(ref(db, `posts/${encodeMail}`));
            const userData = response.exportVal();

            if (userData && userData.friend) {
                const friendsArray = Object.values(userData.friend);
                setNumberFriend(friendsArray.length);
                setFriendsArray(friendsArray);
                console.log("Liste d'amis :", friendsArray);
                console.log("Nombre d'amis :", friendsArray.length);
            } else {
                console.log("Aucune donnée d'amis trouvée dans la base de données.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des amis depuis la base de données :", error);
        }
    };

    return (
        <View>
            <Text style={styles.click}>Cliquez sur la personne que vous voulez suivre</Text>
            <Text style={styles.add}>Ajoutez des amis ici</Text>
            <TextInput
                style={styles.input}
                placeholder="Ajoutez l'adresse mail de votre ami"
                placeholderTextColor="black"
                onChangeText={(Friend_Name) => SetFriendToADd(Friend_Name)}
            />
            <Text onPress={() => AddFriendToDB(FriendToAdd)} style={styles.button_add}>Add Friend</Text>
            <Text onPress={() => GetFriendFromDB()} style={styles.buttonDB}>↻</Text>
            {NumberFriend > 1 ? (
                <View style={styles.friendsContainer}>
                <Text style={styles.friendsTitle}>Liste d'amis :</Text>
                {FriendsArray.length > 1 &&
                    Array.from({ length: FriendsArray.length }, (_, index) => index + 1).map((friendIndex) => (
                        <Text
                            key={friendIndex}
                            style={{ ...styles.friendItem, marginBottom: friendIndex * 30 }}
                            onPress={() => handleFriendPress(FriendsArray[friendIndex])}
                        >
                            {FriendsArray[friendIndex]}
                        </Text>
                    ))}
            </View>
            ) : (
                <Text style={styles.noFriendText}>Aucun ami à afficher :(</Text>
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    button_add: {
        fontWeight: "bold",
        position: "absolute",
        top: 140,
        left: 160,
    },
    buttonDB: {
        position: "absolute",
        top: 180,
        left: 170,
        fontSize: 40,
    },
    click: {
        fontWeight: "bold",
        fontSize: 17,
        position: "absolute",
        top: 10,
        left: 20,
    },
    input: {
        position: "absolute",
        top: 80,
        left: 40,
        marginTop: 10,
        height: 40,
        width: '80%',
        borderColor: 'red',
        borderRadius: 5,
        borderWidth: 1,
        paddingLeft: 10,
        color: "black",
    },
    add: {
        fontWeight: "bold",
        fontSize: 17,
        position: "absolute",
        top: 60,
        left: 120,
    },
    friendsContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    friendsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        position: "absolute",
        top: 220,
        left: 120,
    },
    friendItem: {
        fontSize: 16,
        marginBottom: 5,
        position: "absolute",
        top: 260,
        left: 50,
    },
    noFriendText: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        textAlign: 'center',
        position: "absolute",
        top: 250,
        left: 120,
    },
});

export default FollowFriend;

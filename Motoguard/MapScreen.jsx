import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";
import {encode as btoa} from 'base-64';
import { ref, get, update } from 'firebase/database';
import { db } from './GetData';

const  MapScreen = ({navigation}) => {
  const [Pseudo, setPseudo] = useState(null);
  const InMotion = false;
  const [userLocation, setUserLocation] = useState({
    latitude: 43.669584,
    longitude: 7.215500,
    latitudeDelta: 0.001,
    longitudeDelta: 0.001,
  });

  const mapRef = useRef(null);

  const getPseudoFromDb = async () => {
    try {
      encodeMail = btoa("user@example.com");
      const response = await get(ref(db, `posts/${encodeMail}`));
      const response_pseudo = response.exportVal();
      if (response) {
        setPseudo(response_pseudo.pseudo);
      } else {
        console.log("User not found or missing data in the response.");
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du pseudo depuis la base de données :', error);
    }
  };

  const logLocation = async () => {
    await updateUserLocation();
    encodeMail = btoa(window.email);
    update(ref(db, `posts/${encodeMail}`), {
      Latitude: userLocation.latitude,
      Longitude: userLocation.longitude,
    });
  };

  useEffect(() => {
    updateUserLocation();

    const intervalId = setInterval(() => {
      if (InMotion != false) {
        logLocation();
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const loadPseudo = async () => {
      await getPseudoFromDb();
    };

    loadPseudo();
  }, [Pseudo]);


  const updateUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true });
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération de la localisation :', error);
    }
  };


  const goToUserLocation = () => {
    const region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.010,
      longitudeDelta: 0.006,
    };
    mapRef.current.animateToRegion(region, 500);
  };

  const FollowFriend = () => {
    navigation.navigate("Follow");
  }

  const ProfilePress = () => {
    navigation.navigate("Profile");
  };
  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onRegionChangeComplete={() => {}}
      >
        {userLocation && (
          <Marker onPress={() => setPseudo(Pseudo)} coordinate={userLocation} title={`${Pseudo}'s marker`} isPreselected={true} />
        )}
      </MapView>
      <Text onPress={() => { ProfilePress(), console.log("Profile clicked") }} style={styles.profile}> Profile </Text>
      {userLocation && (
        <Text onPress={() => { goToUserLocation(), getPseudoFromDb() }} style={styles.GoBack}> Go to </Text>
      )}
      <Text onPress={() => { updateUserLocation(), getPseudoFromDb() }} style={styles.Update_Button}> Update </Text>

        <Text onPress={() => FollowFriend()} style={styles.Follow_Button}> Follow </Text>

      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>Latitude: {userLocation.latitude.toFixed(6)}</Text>
        <Text style={styles.coordinatesText}>Longitude: {userLocation.longitude.toFixed(6)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: "#000",
    position: 'absolute',
    top: 60,
    left: 10,
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  GoBack: {
    backgroundColor: "#000",
    position: 'absolute',
    top: 115,
    left: 10,
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  Follow_Button: {
    backgroundColor: "#000",
    position: 'absolute',
    top: 230,
    left: 10,
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  Update_Button: {
    backgroundColor: "#000",
    position: 'absolute',
    top: 170,
    left: 10,
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    height: "10%",
    backgroundColor: "#ffffff",
  },
  coordinatesContainer: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
  coordinatesText: {
    color: 'white',
    fontSize: 12,
  },
});

export default MapScreen;


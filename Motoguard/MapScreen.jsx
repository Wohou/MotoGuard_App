import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";
import {encode as btoa} from 'base-64';
import { ref, get } from 'firebase/database';
import { db } from './GetData';

const  MapScreen = ({navigation}) => {
  const [Pseudo, setPseudo] = useState(null);
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

  useEffect(() => {
    updateUserLocation();
  }, []);

  useEffect(() => {
    // Get user's location
    const loadPseudo = async () => {
      await getPseudoFromDb();
    };

    loadPseudo();
  }, [Pseudo]);


  const updateUserLocation = async () => {
    let { status } = Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    console.log(location.coords.latitude, location.coords.longitude);
    }


  const goToUserLocation = () => {
    const region = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      latitudeDelta: 0.010,
      longitudeDelta: 0.006,
    };
    mapRef.current.animateToRegion(region, 500);
  };

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
        <Marker onPress={() => setPseudo(Pseudo) } coordinate={userLocation} title={`${Pseudo}'s marker`} isPreselected={true} />
        )}
      </MapView>
        <Text onPress={() => {ProfilePress(), console.log("Profile clicked")}} style={styles.profile}> Profile </Text>
        {userLocation && (
          <Text onPress={() => {goToUserLocation(), getPseudoFromDb()}} style={styles.GoBack}> Go to </Text>
        )}
        <Text onPress={() =>  updateUserLocation()} style={styles.Update_Button}> Update </Text>
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
});

export default MapScreen;

// if (mapRef.current) {
  //       mapRef.current.animateToRegion({
  //         latitude: location.coords.latitude,
  //         longitude: location.coords.longitude,
  //         latitudeDelta: 0.010,
  //         longitudeDelta: 0.006,
  //       });

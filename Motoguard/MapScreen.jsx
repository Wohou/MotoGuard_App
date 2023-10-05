import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import * as Location from "expo-location";
import {encode as btoa} from 'base-64';
import { ref, get } from 'firebase/database';
import { db } from './GetData';

const  MapScreen = ({navigation}) => {
  const [Pseudo, setPseudo] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);

  useEffect(() => {
    const getPseudoFromDb = async () => {
    encodeMail = btoa("user@example.com");
    console.log("encoded mail of map", encodeMail);
    const response = await get(ref(db, `posts/${encodeMail}`));
    const response_pseudo = response.exportVal();
    console.log("response: ", response_pseudo.pseudo);
      if (response) {
          setPseudo(response_pseudo.pseudo);
      } else {
          console.log("User not found or missing data in the response.");
      }
    };
    getPseudoFromDb(); getPseudoFromDb();
  }, [])

  const updateUserLocation = async () => {
    try {
      let { status } = await Location.requestBackgroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access denied");
      }

      let location = await Location.getCurrentPositionAsync({
        enableHighAccuracy: true,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.010,
          longitudeDelta: 0.006,
        });
      }

      console.log(location.coords.latitude, location.coords.longitude);

      await Location.stopLocationUpdatesAsync("my-task-name");
    } catch (error) {
      console.log("Error");
    }
  };

  

  useEffect(() => {
    const cleanup = async () => {
      try {
        await Location.stopLocationUpdatesAsync("my-task-name");
      } catch (error) {
        console.log("Error");
      }
    };

    updateUserLocation();

    return cleanup;
  }, []);

  const ProfilePress = () => {
    navigation.navigate("Profile");
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

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onRegionChangeComplete={() => {}}
      >
      {userLocation && (
        <Marker coordinate={userLocation} title={`${Pseudo}'s marker`} isPreselected={true} />
        )}
      </MapView>
        <Text onPress={() => {ProfilePress(), console.log("Profile clicked")}} style={styles.profile}> Profile </Text>
        {userLocation && (
          <Text onPress={() => {goToUserLocation(), console.log("Go To clicked")}} style={styles.GoBack}> Go to </Text>
        )}
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

import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import * as Location from "expo-location";

export default function MapScreen() {
  const [Pseudo, setPseudo] = useState("Benjamin");
  const [userLocation, setUserLocation] = useState(null);

  const mapRef = useRef(null);

  const updateUserLocation = async () => {
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
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }

    console.log(location.coords.latitude, location.coords.longitude);
  };

  useEffect(() => {
    updateUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        onRegionChangeComplete={() => {}}
      ></MapView>

      {userLocation && (
        <Marker coordinate={userLocation} title={`${Pseudo}'s marker`} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height-40,
  },
});

import React, {useState, useEffect} from "react";
import MapView, {Marker} from "react-native-maps";
import { StyleSheet, Text, View, Dimensions, Button } from "react-native";
import * as Location from 'expo-location';

export default function MapScreen() {
  const [Pseudo, setPseudo] = useState("Benjamin")
  const [mapRegion, setMapRegion] = useState({
    latitude: 43.669658,
    longitude: 7.215516,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0442,
  });
  const userLocation = async () => {
    let {status} = await Location.requestBackgroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to acces denied');
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

  useEffect(() => {
    userLocation();
  }, []);
  return (
    <View style={styles.container}>
      <MapView style={styles.map}
      region={mapRegion}
      >
      <Marker coordinate={mapRegion} title={`${Pseudo}'s marker`} />
      </MapView>
      <Button title='Get Location' onPress={userLocation} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    button: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 100,
    }
  })

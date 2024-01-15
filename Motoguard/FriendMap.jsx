import React, { useState, useEffect, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Text, TouchableOpacity} from "react-native";
import {encode as btoa} from 'base-64';
import { ref, get, update } from 'firebase/database';
import { db } from './GetData';

const FriendMap = ({ navigation }) => {
    const friend_follow_encoded = btoa(friend_followed);
    const [FriendName, SetFriendName] = useState('');
    const [FriendState, SetFriendState] = useState(false);
    const [FriendLocation, SetFriendLocation] = useState({
        latitude: 43.669584,
        longitude: 7.215500,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
    });

    const mapRef = useRef(null);

    useEffect(() => {
        GetFriendData();

        const intervalId = setInterval(() => {
              GetFriendData();
          }, 10000);
          return () => clearInterval(intervalId);
    }, []);

    const goToUserLocation = () => {
        const region = {
          latitude: FriendLocation.latitude,
          longitude: FriendLocation.longitude,
          latitudeDelta: FriendLocation.latitudeDelta,
          longitudeDelta: FriendLocation.longitudeDelta,
        };
        mapRef.current.animateToRegion(region, 500);
      };

    const GetFriendData = async () => {
        try{
            const data = await get(ref(db, `posts/${friend_follow_encoded}`));
            const userdata = data.exportVal();
            SetFriendLocation({
                latitude: userdata.Latitude,
                longitude: userdata.Longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            })
            SetFriendName(userdata.pseudo);
            SetFriendState(userdata.InMotion);
    } catch (error) {
        console.log("Erreur:", error);
    }
};
return (
  <View style={styles.container}>
    {FriendState ? (
      <>
        <Text style={styles.test}>Test with {window.friend_followed}</Text>
        <MapView
          ref={mapRef}
          style={styles.map}
          onRegionChangeComplete={() => {}}
        >
          <Marker onPress={() => SetFriendName(FriendName)} coordinate={FriendLocation} title={`${FriendName} marker`} isPreselected={true} />
        </MapView>
        <Text onPress={() => { goToUserLocation() }} style={styles.GoTo}> Go to </Text>
      </>
    ) : (
      <View>
      <View style={styles.nameAndRoadContainer}>
        <Text style={styles.falseName}>{FriendName}</Text>
        <Text style={styles.road}>n'est pas sur la route</Text>
      </View>
      <Text style={styles.stay}>Restez prudent !!</Text>
      <TouchableOpacity
          style={styles.followButton}
          onPress={() => navigation.navigate('Follow')}
        >
          <Text style={styles.followButtonText}>Retour</Text>
        </TouchableOpacity>
    </View>
  )}
  </View>
);
}

const styles = StyleSheet.create({
  followButton: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  followButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameAndRoadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  falseName: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 5,
  },
  road: {
    fontSize: 20,
  },
  stay: {
    fontWeight: "bold",
    fontSize: 18,
    color: "red",
    marginTop: 10,
    left: 70,
    alignItems: "center",
  },
  GoTo: {
      backgroundColor: "#000",
      position: "absolute",
      top: 80,
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
    test: {
        fontSize: 20,
        position: "absolute",
        top: 80,
    }
});

export default FriendMap;

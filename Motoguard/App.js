import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MapScreen from './MapScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: "Connexion" }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: "Carte" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

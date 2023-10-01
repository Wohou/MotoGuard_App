import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import MapScreen from './MapScreen';
import CreateLogin from './CreateLogin';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Connexion',
            headerStyle: {
              backgroundColor: '#C1121F',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{headerShown: false }}
        />
       <Stack.Screen
          name="Create"
          component={CreateLogin}
          options={{
            title: 'Créez votre compte',
            headerStyle: {
              backgroundColor: '#C1121F',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

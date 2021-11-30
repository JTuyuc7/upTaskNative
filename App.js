import 'react-native-gesture-handler';
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native';
import { NativeBaseProvider, Root } from 'native-base';
import Login from './components/paginas/Login';
import CreacCuenta from './components/paginas/CrearCuenta';
import Proyectos from './components/paginas/Proyectos';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const App = () => {

  return (  
    <>

        <NativeBaseProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="login"
            >
              <Stack.Screen
                name="login"
                component={Login}
                options={{
                  title: "Iniciar Sesion",
                  headerShown: false
                }}
              />

              <Stack.Screen
                name="crearCuenta"
                component={CreacCuenta}
                options={{
                  headerShown: false
                }}
              />

              <Stack.Screen
                name="proyectos"
                component={ Proyectos }

                options={{
                  headerShown: false
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>

    </>
  );
}

export default App;
import 'react-native-gesture-handler';
import React from 'react'
import { SafeAreaView, Text, View } from 'react-native';
import { NativeBaseProvider, Root } from 'native-base';
import Login from './components/paginas/Login';
import CreacCuenta from './components/paginas/CrearCuenta';
import Proyectos from './components/paginas/Proyectos';


import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import FormProject from './components/paginas/FormProject';
import Proyecto from './components/paginas/Proyecto';

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

              <Stack.Screen
                name="formProject"
                component={ FormProject }
                options={{
                  headerTitle: "Nuevo Proyecto",
                  headerTitleAlign: 'center',
                  headerTintColor: '#FFF',
                  headerStyle: {
                    backgroundColor: '#330911',
                    
                  }
                }}
              />

              <Stack.Screen
                name="proyecto"
                component={ Proyecto }
                options={ ({route}) => ({
                  title: route.params.nombre,
                  headerTitleAlign: 'center',
                  headerTintColor: "#FFF",
                  headerStyle: {
                    backgroundColor: '#330911'
                  }
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NativeBaseProvider>

    </>
  );
}

export default App;
import React, { useState } from 'react'
import { SafeAreaView, Text, View, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { Container, Button, H1, Form, Toast, NativeBaseProvider, FormControl, Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// async storage
import AsyncStorage from '@react-native-async-storage/async-storage';

// Apollo 
import { gql, useMutation } from '@apollo/client';

const { width, height } = Dimensions.get('screen');
const AUTENTICAR_USUARIO = gql`
    mutation autenticarUsuario($input: AutenticarInput){
        autenticarUsuario( input: $input){
        token
        }
    }
`;

const Login = () => {

    //Navegacion
    const navigation = useNavigation();

    // Mutation
    const [ autenticarUsuario ] = useMutation(AUTENTICAR_USUARIO);

    // State para validacion
    const [ email, guardarEmail ] = useState('');
    const [ password, guardarPassword ] = useState('');
    const [ token, guardarToken ] = useState('');

    // message Error
    const [ message, handleMessage ] = useState(null)

    const handleLogin = async () => {

        if( email === '' || password === ''){
            handleMessage('Fields are required');
            return;
        }

        try {
            const { data } = await autenticarUsuario({
                variables: {
                    input: {
                        email: email,
                        password: password
                    }
                }
            });

            const { token } = data.autenticarUsuario;

            // Guardar el token en asyncStorage 
            await AsyncStorage.setItem('@user_key', token );

            // Redirigir a los Proyectos
            navigation.navigate('proyectos')

        } catch (error) {
            //console.log(error, 'Unable to autheticate')
            handleMessage(error.message.replace('GraphQL error', ''))
        }
    }

    const showAlert = () => {
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        )
    }

    return (  
        <>
            <NativeBaseProvider>
                <SafeAreaView 
                    style={{ flex: 1, backgroundColor: '#eb4347'}}
                >
                    <View
                        style={styles.mainContainer}
                    >
                        <Text style={ styles.titulo}>Up Task</Text>

                        <View 
                            style={styles.formContainer}
                        >
                            <View>
                                <Text
                                    style={ styles.sesion}
                                >Inicia Sesión</Text>
                            </View>
                            <FormControl>   
                                <Text style={ styles.textLabel}>Email</Text>
                                <View style={{ alignItems: 'center', marginBottom: 25}}>
                                    <Input
                                        keyboardType="email-address"
                                        placeholder="Email"
                                        style={ styles.inputStyles}
                                        onChangeText={ (email) => guardarEmail(email) }
                                    />
                                </View>

                                <Text style={ styles.textLabel}>Password</Text>
                                <View style={{ alignItems: 'center'}}>
                                    <Input
                                        //keyboardType="visible-password"
                                        placeholder="password"
                                        style={ styles.inputStyles}
                                        secureTextEntry={true}
                                        onChangeText={ (password) => guardarPassword(password) }
                                    />
                                </View>

                                <View
                                    style={{ marginTop: 20}}
                                >
                                    <TouchableOpacity
                                        style={ styles.submitStyle }
                                        onPress={ () => handleLogin() }
                                    >
                                        <Text 
                                            style={ styles.textoSesion }
                                        >Iniciar Sesion</Text>
                                    </TouchableOpacity>
                                </View>
                            </FormControl>

                            { message && showAlert() }

                            <View>
                                <Text
                                    style={ styles.create}
                                >Don´t have an account? 
                                    <Text
                                        onPress={ () => navigation.navigate('crearCuenta')}
                                        style={{ fontWeight: 'bold'}}
                                    > Create one</Text>
                                </Text>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
            </NativeBaseProvider>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        //backgroundColor: 'yellow',
        paddingHorizontal: 20
    },
    titulo: {
        textAlign: 'center',
        fontSize: 30,
        textTransform: 'uppercase',
        marginTop: 20,
        fontWeight: 'bold',
        color: "#FFF"
    },
    formContainer: {
        //backgroundColor: 'green',
        flex: 0.99,
        justifyContent: 'space-evenly'
    },
    create: {
        marginTop: 50,
        textAlign: 'center',
        fontSize: 17,
        color: "#FFF"
    },
    sesion: {
        fontSize: 22,
        textAlign: 'center',
        paddingVertical: 20,
        fontWeight: 'bold',
        color:"#FFF"
    },
    inputStyles: {
        width: width * 0.90,
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: 20,
        fontSize: 16
    },
    textLabel: {
        marginBottom: 10,
        fontSize: 17,
        marginLeft: 8,
        color: "#FFF"
    },
    submitStyle: {
        backgroundColor: '#28303b',
        height: height * 0.065,
        borderRadius: 20,
        justifyContent: 'center'
    },
    textoSesion: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})

export default Login;
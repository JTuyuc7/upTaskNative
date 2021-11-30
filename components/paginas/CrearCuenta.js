import React, { useState } from 'react'
import { SafeAreaView, Text, View, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { Container, Button, H1, Form, NativeBaseProvider, FormControl, Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

//Apolo
import { gql, useMutation } from '@apollo/client';
const NUEVA_CUENTA = gql`
    mutation crearUsuario($input: UsuarioInput) {
        crearUsuario( input: $input)
    }
`;

const { width, height } = Dimensions.get('screen');

const CrearCuenta = () => {

    //Navegacion
    const navigation = useNavigation();

    // Apolo mutation
    const [ crearUsuario ] = useMutation(NUEVA_CUENTA);

    // Form State
    const [ nombre, guardarNombre ] = useState('')
    const [ email, guardarEmail ] = useState('')
    const [ password, guardarPassword ] = useState('')

    // Error State
    const [ message, showMessage ] = useState(null);

    // Function to create an account
    const crearCuenta = async () => {
        // Validar que los campos no estan vacios
        if( nombre.trim() === '' || email.trim() === '' || password.trim() === '' ){
            // Mostrar Error of fields
            showMessage('Los campos son obligatorios');
            return
        }

        if( password.length < 6 ){
            showMessage('6 characters as minimum password')
            return
        }

        // Pasara los datos para crear el user
        try {
            const { data } = await crearUsuario({
                variables: {
                    input: {
                        nombre: nombre,
                        email: email,
                        password: password
                    }
                }
            });

            //console.log(data.crearUsuario, 'Data')
            showMessage(data.crearUsuario);

            navigation.navigate('login')

        } catch (error) {
            //console.log(error, 'Unable to Create the account')
            //console.log(error.message.replace('GraphQL error', ''));
            showMessage(error.message.replace('GraphQL error', ''))
        }
    }

    // Error Alert
    const mostrarAlerta = () => {
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
                    <View style={{ marginTop: 15, marginLeft: 15}}>
                        <TouchableOpacity
                            onPress={ () => navigation.goBack() }
                            style={{ flexDirection: 'row', alignItems: 'center'}}
                        >
                            <Icon name="arrow-back-circle-outline" size={25} color="#FFF" />
                            <Text
                                style={{ marginLeft: 5, fontSize: 15, color: "#FFF"}}
                            >Back to login</Text>
                        </TouchableOpacity>
                    </View>
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
                                >Create an Account</Text>
                            </View>
                            <FormControl>

                                <Text style={ styles.textLabel}>Name</Text>
                                <View style={{ alignItems: 'center', marginBottom: 25}}>
                                    <Input
                                        keyboardType="default"
                                        placeholder="Name"
                                        style={ styles.inputStyles}
                                        onChangeText={ (nombre) => guardarNombre(nombre)}
                                    />
                                </View>

                                <Text style={ styles.textLabel}>Email</Text>
                                <View style={{ alignItems: 'center', marginBottom: 25}}>
                                    <Input
                                        keyboardType="email-address"
                                        placeholder="Email"
                                        style={ styles.inputStyles}
                                        onChangeText={ (email) => guardarEmail(email)}
                                    />
                                </View>

                                <Text style={ styles.textLabel}>Password</Text>
                                <View style={{ alignItems: 'center'}}>
                                    <Input
                                        //keyboardType="visible-password"
                                        placeholder="password"
                                        style={ styles.inputStyles}
                                        secureTextEntry={true}
                                        //passwordRules={true}
                                        onChangeText={ (password) => guardarPassword(password)}
                                    />
                                </View>

                                <View
                                    style={{ marginTop: 20}}
                                >
                                    <TouchableOpacity
                                        style={ styles.submitStyle }
                                        onPress={ () => crearCuenta() }
                                    >
                                        <Text 
                                            style={ styles.textoSesion }
                                        >Create Account</Text>
                                    </TouchableOpacity>
                                </View>
                            </FormControl>

                            { message && mostrarAlerta() }

                            <View>
                                <Text
                                    style={ styles.create}
                                >Aready have an accout?
                                    <Text
                                        onPress={ () => navigation.navigate('login')}
                                        style={{ fontWeight: 'bold'}}
                                    > Sing In</Text>
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

export default CrearCuenta;
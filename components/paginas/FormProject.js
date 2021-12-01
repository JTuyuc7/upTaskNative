import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Dimensions, TouchableOpacity, ToastAndroid } from 'react-native';
import { Input } from 'native-base';
import { useNavigation } from '@react-navigation/native';

// Apollo
import { gql, useMutation } from '@apollo/client';
const CREATE_PROJECT = gql`
    mutation crearProyecto( $input: ProyectoInput ){
        crearProyecto( input: $input ) {
            nombre
            id
        }
    }
`;

// Actualizar el cache para refrescar los proyectos
const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const { height, width } = Dimensions.get('screen');

const FormProject = () => {

    // Navigation
    const navigation = useNavigation();

    // Mutatiion
    const [ crearProyecto ] = useMutation(CREATE_PROJECT, {
        update( cache, { data: { crearProyecto } } ){
            const { obtenerProyectos } = cache.readQuery({ query: OBTENER_PROYECTOS });
            cache.writeQuery({
                query: OBTENER_PROYECTOS,
                data: {
                    obtenerProyectos: obtenerProyectos.concat([ crearProyecto ])
                }
            })
        }
    });

    // Project state
    const [ nombre, setName ] = useState('');

    // Error Alert
    const [ message, setMessage ] = useState(null);

    // Add Project
    const handleSubmit = async () => {
        if( nombre === ''){
            setMessage('Name is required to save the Project')
            return;
        }

        try {
            const { data } = await crearProyecto({
                variables: {
                    input: {
                        nombre: nombre
                    }
                }
            });

            //console.log(data.crearProyecto, 'guardado?')
            setMessage('Project saved successfully')

            // Navegar a inicio de proyectos
            navigation.navigate('proyectos');

        } catch (error) {
            console.log(error, 'desde form project')
            setMessage(error.message.replace('GraphQL error:', ''))
        }
    }

    // Alert function
    const showAlert = () => {
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        )
    }

    return (  
        <>
            <SafeAreaView
                style={ styles.mainContainer }
            >
                <View
                    style={{ paddingHorizontal: 20, marginTop: 30, justifyContent: 'center', flex: 0.9}}
                >
                    <Text style={ styles.textLabel }>Proyect Name</Text>
                    <View>
                        <Input
                            keyboardType="default"
                            placeholder="Nombre Proyecto"
                            style={ styles.inputStyles}
                            onChangeText={ (name) => setName(name) }
                        />
                    </View>

                    <View
                        style={{ marginTop: 20}}
                    >
                        <TouchableOpacity
                            style={ styles.submitStyle }
                            onPress={ () => handleSubmit() }
                        >
                            <Text 
                                style={ styles.textoProyecto }
                            >Create Project</Text>
                        </TouchableOpacity>
                    </View>

                    { message && showAlert()}

                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#e84347',
        flex: 1
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
    textoProyecto: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 18,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})

export default FormProject;
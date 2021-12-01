import React, { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, TouchableOpacity, ToastAndroid, Dimensions, FlatList } from 'react-native';
import { Input } from 'native-base';
import Tarea from '../UI/Tarea';
import { gql, useMutation, useQuery } from '@apollo/client';
const AGREGAR_TAREA = gql`
    mutation nuevaTarea( $input: TareaInput){
        nuevaTarea( input: $input ){
            nombre
            id
            proyecto
            estado
        }
    }
`;

const OBTENER_TAREAS = gql`
    query obtenerTareas( $input: ProyectoIDInput ){
        obtenerTareas( input: $input ) {
            nombre
            id
            estado
        }
    }
`;


const { width, height } = Dimensions.get('screen');

const Proyecto = ({ route }) => {
    // State
    const [ inputNombre, setInputNombre ] = useState('')
    const [ message, setMessage ] = useState(null)

    // query 
    const { data, loading, error } = useQuery(OBTENER_TAREAS, {
        variables: {
            input: {
                proyecto:  route.params.id
            }
        }
    });

    // Mutation
    const [ nuevaTarea ] = useMutation(AGREGAR_TAREA, {
        update(cache, { data: { nuevaTarea }}){
            const { obtenerTareas } = cache.readQuery({ 
                query: OBTENER_TAREAS,

                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                
                variables: {
                    input: {
                        proyecto: route.params.id
                    }
                },
                data: {
                    obtenerTareas: [...obtenerTareas, nuevaTarea]
                }
            });
        }
    })

    const agregarNuevaTarea = async () => {
        if( inputNombre === ''){
            setMessage('Task name is required');
            return;
        }

        try {
            const { data } = await nuevaTarea({
                variables: {
                    input: {
                        nombre: inputNombre,
                        proyecto: route.params.id
                    }
                }
            });

            setInputNombre('')
            setMessage('Task saved successfully');
        } catch (error) {
            console.log(error, 'No se guardo')
        }
    }

    // Alert
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
                    style={ styles.contentContainer }
                >
                    <View
                        style={{ marginTop: 20}}
                    >
                        <Input
                            placeholder="Nombre tarea"
                            style={ styles.inputStyles}
                            onChangeText={ (text) => setInputNombre(text)}
                            value={ inputNombre }
                        />

                        <View
                            style={{ marginTop: 20}}
                        >
                            <TouchableOpacity
                                style={ styles.submitStyle }
                                onPress={ () => agregarNuevaTarea() }
                            >
                                <Text 
                                    style={ styles.textoProyecto }
                                >Agregar Tarea</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={{ marginTop: 30}}>
                        <Text style={{ textAlign: 'center', color: '#FFF', fontSize: 20}}>Tareas para: {route.params.nombre}</Text>

                        <View
                            style={{ marginTop: 15}}
                        >
                            <FlatList
                                data={data?.obtenerTareas}
                                keyExtractor={ item => item.id}
                                renderItem={ ({ item, index }) => (

                                    <>
                                        <Tarea
                                            item={item}
                                            index={index}
                                            proyecto={route.params.id}
                                        />
                                    </>
                                )}
                            />
                        </View>
                    </View>
                </View>

                { message && showAlert()}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: '#e84347',
        flex: 1
    },
    contentContainer: {
        paddingHorizontal: 20
    },
    inputStyles: {
        width: width * 0.90,
        backgroundColor: 'white',
        textAlign: 'center',
        borderRadius: 20,
        fontSize: 16
    },
    submitStyle: {
        backgroundColor: '#28303b',
        height: height * 0.060,
        borderRadius: 20,
        justifyContent: 'center'
    },
    textoProyecto: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 16,
        textTransform: 'uppercase',
        fontWeight: 'bold'
    }
})
 
export default Proyecto;
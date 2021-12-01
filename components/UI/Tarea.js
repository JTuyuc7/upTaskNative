import React, {useState} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert, ToastAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Apollo Client
import { gql, useMutation, useQuery } from '@apollo/client';
const ACTUALIZAR_TAREA = gql`
    mutation actualizarTarea( $id: ID!, $input: TareaInput, $estado: Boolean ){
        actualizarTarea( id: $id, input: $input, estado: $estado ) {
            nombre
            id
            proyecto
            estado
        }
    }
`;

const ELIMINAR_TAREA = gql`
    mutation eliminarTarea( $id: ID! ){
        eliminarTarea( id: $id )
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

const Tarea = ({item, proyecto}) => {

    const [ message, setMessage ] = useState(null)

    const { id } = item;

    // Mutation
    const [ actualizarTarea ] = useMutation(ACTUALIZAR_TAREA);
    const [ eliminarTarea ] = useMutation(ELIMINAR_TAREA, {
        update(cache){
            const { obtenerTareas } = cache.readQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyecto
                    }
                }
            });

            cache.writeQuery({
                query: OBTENER_TAREAS,
                variables: {
                    input: {
                        proyecto: proyecto
                    }
                },
                data: {
                    obtenerTareas: obtenerTareas.filter( tareaActual => tareaActual.id !== item.id )
                }
            })
        }
    });

    // Eliminar
    const alertaEliminar = () => {
        Alert.alert(
            'Cnfirmacion',
            'Deseas Eliminar la tarea?',
            [
                { text: 'Cancelar', style: 'cancel'},
                { text: 'Si, eliminar', onPress: () => eliminarTareaDB()}
            ]
        )
    };

    const eliminarTareaDB = async () => {
        const { id } = item;
        try {
            const { data } = await eliminarTarea({
                variables: {
                    id: id
                }
            });
            setMessage(data.eliminarTarea)
        } catch (error) {
            console.log(error, 'Unable to delete the task')
        }
    }

    const showAlert = () => {
        ToastAndroid.show(
            message,
            ToastAndroid.SHORT
        )
    }

    const cambiarEstadoTarea = async (item) => {
        try {
            const { data } = await actualizarTarea({
                variables: {
                    id: id,
                    input: {
                        nombre: item.nombre
                    },
                    estado: !item.estado
                }
            });
        } catch (error) {
            console.log(error, 'Unable to updated')
        }
    }

    return (  
        <>
            <View
                style={{ marginTop: 20 }}
            >
                <View
                    style={ styles.content }
                >
                    <TouchableOpacity
                        style={ styles.nameContent }
                        onLongPress={ () => alertaEliminar()}
                    >
                        <Text
                            style={ styles.textContent}
                        >{ item.nombre }</Text>
                    </TouchableOpacity>

                    <View 
                        style={ styles.iconStyle}
                    >
                        <TouchableOpacity
                            onPress={ () => cambiarEstadoTarea(item) }
                        >
                            { item.estado ? (
                                <Icon
                                    name="ios-checkmark-circle"
                                    size={28}
                                    style={ styles.completo }
                                />
                            ) : (
                                <Icon
                                    name="ios-checkmark-circle"
                                    size={28}
                                    style={ styles.incompleto}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                { message && showAlert()}
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
        paddingVertical: 3,
        borderRadius: 10,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameContent: {
        //backgroundColor: 'green',
        paddingVertical: 10,
        width: width * 0.7
    },
    iconStyle: {
        width: width * 0.15,
        //backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    },
    textContent: {
        fontSize: 18
    },
    completo: {
        color: 'green'
    },
    incompleto: {
        color: "#e1e1e1"
    },
})
export default Tarea;


/*
    <Icon
                            name="ios-checkmark-circle"
                            color={ item.estado === false ? '#e1e1e1' : 'green'}
                            size={25}
                            onPress={ () => cambiarEstadoTarea() }
                        />
*/
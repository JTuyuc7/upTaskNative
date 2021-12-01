import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { gql, useQuery } from '@apollo/client';

const OBTENER_PROYECTOS = gql`
    query obtenerProyectos {
        obtenerProyectos {
            id
            nombre
        }
    }
`;

const Proyectos = () => {

    // Get the proyects
    const { data, loading, error } = useQuery(OBTENER_PROYECTOS);
    //const [ proyects, setData ] = useState(data.obtenerProyectos)
    // Navigation
    const navigation = useNavigation();

    const Item = ({ item }) => {

        return (
            <>
                <View
                    style={styles.cardContainer}
                >
                    <Text
                        style={ styles.textoItem}
                    >{item.nombre}</Text>
                </View>
            </>
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
                        style={ styles.buttonContainer}
                    >
                        <TouchableOpacity
                            onPress={ () => navigation.navigate('formProject')}
                            style={ styles.buttonStyles }
                        >
                            <Text
                                style={ styles.textButton }
                            >Nuevo Proyecto</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <Text
                            style={ styles.proyecto }
                        >Selecciona Un Proyecto </Text>

                        <View>
                            <FlatList
                                data={data?.obtenerProyectos}
                                keyExtractor={ intem => intem.id }
                                renderItem={ ({ item, index}) => (
                                    <TouchableOpacity
                                        onPress={ () => navigation.navigate('proyecto', item )}
                                    >
                                        <Item
                                            item={item}
                                            index={index}
                                        />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
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
    contentContainer: {
        paddingHorizontal: 20
    },
    buttonContainer: {
        marginTop: 30,
    },
    buttonStyles: {
        backgroundColor: 'purple',
        height: 55,
        borderRadius: 20,
        justifyContent: 'center'
    },
    textButton: {
        color: "#FFF",
        textAlign: 'center',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        fontSize: 20
    },
    proyecto: {
        textAlign: 'center',
        color: "#FFF",
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15,
        marginBottom: 20
    },
    cardContainer: {
        backgroundColor: '#FFF',
        marginVertical: 10,
        paddingVertical: 10,
        borderRadius: 7,
        paddingHorizontal: 7
    },
    textoItem: {
        fontSize: 16,
        fontWeight: 'bold',

    }
})
export default Proyectos;
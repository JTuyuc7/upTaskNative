import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const Proyectos = () => {
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

    },
    proyecto: {
        textAlign: 'center',
        color: "#FFF",
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 15
    }
})
export default Proyectos;
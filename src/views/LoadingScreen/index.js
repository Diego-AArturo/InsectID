import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator,Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class LoadingScreen extends React.Component { 
    static navigationOptions = {
        hadershow:false
    }
    componentDidMount = async () => {
        // Verificar si el usuario está autenticado
        const isAuthenticated = await AsyncStorage.getItem('isAuthenticated');

        // Si está autenticado, navegar a la pantalla principal (Home)
        // Si no está autenticado, navegar a la pantalla de login (Login)
        this.props.navigation.navigate(isAuthenticated ? 'Home' : 'Login');
    };
    render () {
        return(
            <View style = {styles.container}>
                <Text>Cargando...</Text>
                <ActivityIndicator size='large'></ActivityIndicator>
            </View>
        );
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
})





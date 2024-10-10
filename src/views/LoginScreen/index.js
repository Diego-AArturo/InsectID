import React from "react";
import {View, Text, StyleSheet, TextInput, TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

export default class LodingScreen extends React.Component { 
    static navigationOptions = {
        hadershow:false
    }

    state = {
        user: "",
        password: "",
        errorMessage: null,
    };
    handleLogin = async () => {
        const { user, password } = this.state; // Extraer user y password del estado
        console.log("entrando");
        // Verificar si ambos campos están completos
        if (!user || !password) {
            this.setState({ errorMessage: "Por favor completa ambos campos" });
            return;
        }

        try {
            // Realizar la solicitud al backend
            console.log('conectando');
            const response = await fetch('https://insectid-backen.onrender.com/iniciosesion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre: user,
                    contraseña: password
                })
            });
            
            const data = await response.json();
            console.log(data);
            if (response.status === 200) {
                // Inicio de sesión exitoso, muestra el mensaje
                this.setState({ errorMessage: null });

                await AsyncStorage.setItem('isAuthenticated', 'true');
                await AsyncStorage.setItem('userDetails', JSON.stringify({
                    user: data.nombre // Aquí guardamos el nombre
                }));

                alert("Inicio de sesión exitoso: " + data.mensaje);
                this.props.navigation.navigate('Home');
            } else {
                // Error en el inicio de sesión, muestra el mensaje de error
                this.setState({ errorMessage: data.mensaje });
            }
        } catch (error) {
            // Captura cualquier error de red u otros errores
            this.setState({ errorMessage: "Error de red. No se pudo conectar con el servidor." });
        }
    };
    render() {
        return(
            <View style = {styles.container} >
                <Text style={styles.greeting}>InsectID</Text>
                
                <View style = {styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style = {styles.form}>
                    <View>
                        <Text style={styles.inputFile}>Usuario</Text>
                        <TextInput style={styles.input} 
                        autoCapitalize='none' 
                        onChangeText={user => this.setState({ user })}
                        value={this.state.user}></TextInput>
                    </View>
                </View>

                <View style = {styles.form}>
                    <View>
                        <Text style={styles.inputFile}>Contraseña</Text>
                        <TextInput style={styles.input} secureTextEntry
                        autoCapitalize='none'
                        onChangeText={password => this.setState({ password })}
                        value={this.state.password}
                        ></TextInput>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style = {{ color: '#FFF', fontWeight: "500"}}>Iniciar sesion</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 32}} onPress={() => this.props.navigation.navigate('Register')}>
                    <Text style = {{ color: '#414959', fontSize: 13}}>
                        ¿Eres nuevo? <Text style = {{ color: '#4CAF50', fontWeight: "500"}}>Crea una cuenta</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }
}



const styles = StyleSheet.create({

    container: {
        flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
    },
    greeting: {
        marginTop: 62,
        fontSize: 18,
        fontWeight: '400',
        textAlign: "center",
    },
    error:{
        color: "#E9446A",
        fontSize: 13,
        fontWeight: "600",
        textAlign: "center"

    },
    errorMessage: {
        height: 72,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 30
    },
    form: {
        marginBottom: 48,
        marginHorizontal: 30,
    },
    inputFile: {
        color: "#8A8F9E",
        fontSize: 10,
        textTransform: "uppercase",
    },
    input:{
        borderBottomColor: "#8A8F9E",
        borderBottomWidth: StyleSheet.hairlineWidth,
        
        height: 40,
        fontSize: 15,
        color: "#161F3D",
    },
    button: {
        marginHorizontal: 30,
        backgroundColor: "#7BA446",
        borderRadius: 4,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }


});


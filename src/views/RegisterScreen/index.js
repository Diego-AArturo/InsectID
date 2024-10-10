import React from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default class RegisterScreen extends React.Component {
    static navigationOptions = {
        hadershow:false
    }
    
    state = {
        user: "",
        password: "",
        errorMessage: null,
    };

    handleRegister = async () => {
        console.log("hh");
        const { user, password } = this.state; // Extraer user y password desde el estado

        // Verifica si los campos están completos
        if (!user || !password) {
            this.setState({ errorMessage: "Por favor completa ambos campos" });
            return;
        }

        try {
            // Realiza la solicitud al backend
            const response = await fetch('https://insectid-backen.onrender.com/registrousuario', {
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

            if (response.status === 200 && data.status === "success") {
                // Registro exitoso, redirige al usuario a la pantalla de inicio de sesión
                alert("Registro exitoso: " + data.mensaje);
                this.props.navigation.navigate('Login'); // Redirige al inicio de sesión
            } else {
                // Error durante el registro, muestra el mensaje de error
                this.setState({ errorMessage: data.mensaje });
            }
        } catch (error) {
            // Captura errores de red o inesperados
            this.setState({ errorMessage: "Error de red. No se pudo conectar con el servidor." });
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.greeting}>{'InsectId\nCrea tu usuario'}</Text>

                <View style={styles.errorMessage}>
                    {this.state.errorMessage && <Text style={styles.error}>{this.state.errorMessage}</Text>}
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputFile}>Usuario</Text>
                        <TextInput
                            style={styles.input}
                            autoCapitalize='none'
                            onChangeText={user => this.setState({ user })}
                            value={this.state.user}
                        />
                    </View>
                </View>

                <View style={styles.form}>
                    <View>
                        <Text style={styles.inputFile}>Contraseña</Text>
                        <TextInput
                            style={styles.input}
                            secureTextEntry
                            autoCapitalize='none'
                            onChangeText={password => this.setState({ password })}
                            value={this.state.password}
                        />
                    </View>
                </View>

                {/* Añadido el onPress para llamar a handleRegister */}
                <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
                    <Text style={{ color: '#FFF', fontWeight: "500" }}>Crear Cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={{ alignSelf: 'center', marginTop: 32 }} onPress={() => this.props.navigation.navigate('Login')}>
                    <Text style={{ color: '#414959', fontSize: 13 }}>
                        ¿Eres nuevo? <Text style={{ color: '#4CAF50', fontWeight: "500" }}>Iniciar sesión</Text>
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    greeting: {
        marginTop: 62,
        fontSize: 18,
        fontWeight: '400',
        textAlign: "center",
    },
    error: {
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
    input: {
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



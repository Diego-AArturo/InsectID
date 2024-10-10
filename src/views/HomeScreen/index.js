import React from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import moment from "moment";
import Button from "../../components/Button";
import { EventRegister } from 'react-native-event-listeners';  // Cambia a EventRegister
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        hadershow: false
    }

    state = {
        userName: "",
        posts: [ 
            {
                id: '1',  // Usamos el doc_id como identificador del post
                name: "InsectID",  // Inicialmente vacío, luego se actualizará con el userName
                timestamp: Date.now(),  // Tiempo actual
                text: 'Bienvenido a Insect ID, el casificador de insectos.\nEste es el feed, aqui podras compartir todos los insectos que encuentres y su información',  // Puedes mostrar el nombre común del insecto u otra información
                image: null,
                
            }
        ]
    };

    async componentDidMount() {
        // Obtener el usuario almacenado en AsyncStorage
        const user = await AsyncStorage.getItem('userDetails');
        if (user) {
            const { userName } = JSON.parse(user); // Asumiendo que tienes los datos guardados en este formato
            this.setState({ userName });

            // Actualizar el post inicial con el userName
            this.setState(prevState => ({
                posts: prevState.posts.map(post => ({
                    ...post,
                    name: userName
                }))
            }));
        }

        // Escuchar el evento 'newPost' para actualizar el feed
        this.listener = EventRegister.addEventListener('newPost', (newPost) => {
            this.setState(prevState => ({
                posts: [newPost, ...prevState.posts]
            }));
        });
    }

    componentWillUnmount() {
        // Eliminar el listener cuando el componente se desmonte
        EventRegister.removeEventListener(this.listener);  // Usar EventRegister
    }

    signOutUser = async () => {
        // Eliminar la información del usuario almacenada y redirigir a la pantalla de inicio de sesión
        await AsyncStorage.removeItem('isAuthenticated');
        await AsyncStorage.removeItem('userDetails');
        this.props.navigation.navigate('Login'); // Redirige a la pantalla de inicio de sesión
    };

    // Declaramos renderPost como una función de flecha
    renderPost = (post) => {
        const isJson = typeof post.text === 'object';
        return (
            <View style={styles.feedItem}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View>
                            <Text style={styles.name}>{post.name}</Text>
                            <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                        </View>                     
                    </View> 
                    {isJson ? (
                        <>
                            <Text style={styles.post}>Nombre común: {post.text.Nombre_comun || 'No disponible'}</Text>
                            <Text style={styles.post}>Hábitat natural: {post.text.Habitat_natural || 'No disponible'}</Text>
                            <Text style={styles.post}>Dieta: {post.text.Dieta || 'No disponible'}</Text>
                            <Text style={styles.post}>Ciclo de vida: {post.text.Ciclo_de_vida || 'No disponible'}</Text>
                            <Text style={styles.post}>Estado de conservación: {post.text.Estado_de_conservacion || 'No disponible'}</Text>
                        </>
                    ) : (
                        <Text style={styles.post}>{post.text}</Text>
                    )}

                    {post.image && (
                        <Image source={{ uri: post.image }} style={styles.postImage} resizeMode="cover" />
                    )}
                </View>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Feed</Text>
                    <TouchableOpacity onPress={this.signOutUser} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>

                <FlatList 
                    style={styles.feed}
                    data={this.state.posts}
                    renderItem={({ item }) => this.renderPost(item)}  // Correcto acceso a renderPost
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />

                <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={() => this.props.navigation.navigate('Camera')}
                >
                    <Button icon="camera-enhance"  size={30} color={'#000'} />
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        backgroundColor: "#EFECF4",
    },
    header: {
        paddingTop: 14,
        paddingBottom: 16,
        backgroundColor: "#FFF",
        alignItems: "center",
        justifyContent: "center",
        borderBottomColor: "#EBECF4",
        shadowColor: "#454D65",
        shadowOffset: { height: 5 },
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "500",
    },
    feed: {
        marginHorizontal: 13,
    },  
    feedItem: {
        backgroundColor: "#FFF",
        borderRadius: 5,
        padding: 8,
        flexDirection: "row",
        marginVertical: 8,
    },
    name: {
        fontSize: 15,
        fontWeight: "500",
        color: "#454D65",
    },
    timestamp: {
        fontSize: 11,
        color: "#7BA446",
        marginTop: 4,
    },
    post: {
        marginTop: 8,
        fontSize: 14,
        color: "#838899",
    },
    postImage: {
        width: undefined,
        height: 200,
        borderRadius: 5,
        marginVertical: 16
    },
    cameraButton: {
        backgroundColor: '#7BA446',
        padding: 16,
        justifyContent: "center",
        borderRadius: 30,
        position: 'absolute',
        bottom: 32,
        right: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },
});

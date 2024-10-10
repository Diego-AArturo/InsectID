import React, {  useState, useEffect, useRef } from "react";
import {  ActivityIndicator, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import Button from "../../components/Button";
import ContainerText from "../../components/ContainerText";

import { FlashMode } from "expo-camera/build/legacy/Camera.types";
import pickImage from "../../components/album_picker";
import Slider from '@react-native-community/slider';
import { EventRegister } from 'react-native-event-listeners';

const CameraScreen = () => {
    
    const [permission, setPermission] = useCameraPermissions();
    const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
    const [image, setImage] = useState(null);
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const cameraRef = useRef(null);
    const [zoom, setZoom] = useState(0);
    const [response, setResponse] = useState(null);
    const [isLoading, setIsLoading]= useState(false);

    if (!permission) {
        // Los permisos de la cámara aún se están cargando.
        return <View />;
    };
    
    if (!permission.granted) {
        // Los permisos de la cámara aún no se han concedido.
        return (
        <View style={styles.container}>
            <Text style={styles.message}>We need your permission to show the camera</Text>
            <Button onPress={setPermission} title="grant permission" />
        </View>
        );
    };

    const takePicture = async () => {
        if(cameraRef){
            try{
                const data = await cameraRef.current.takePictureAsync();
                // console.log(data);
                setImage(data.uri);
                console.log("foto",data.uri);

            }   catch(e) {

                console.log("aqui1",e);
            }
        }
    };



    const toggleCameraFacing= () => {
        setType(current => (current === 'back' ? 'front' : 'back'));
    };

    const flashModeOnOff = () => {
        setFlash(current => (current === FlashMode.off ? FlashMode.on : FlashMode.off))
        console.log("flash")
    };

    const selectFromGallery = async () => {
        const result = await pickImage();
        if (result) {
            setImage(result);
            console.log("galeria",result)
        }
    };

    const handleZoomChange = (value) => {
        setZoom(value); // Actualizar el nivel de zoom
    };

    const uploadImage = async () => {
        setIsLoading(true);
        let formData = new FormData();
        formData.append('image', {
        uri: image,
        name: 'image.jpg',
        type: 'image/jpeg'
        });

        try {
            
            const res = await fetch('https://insectid-backen.onrender.com/intelligentid', {
                method: 'POST',
                body: formData,
            });
        
            const data = await res.json();
            setResponse(data); // Guardamos el objeto completo en el estado
            setIsLoading(false)    
        } catch (error) {
            setIsLoading(false);
            console.error('Error uploading the image', error);

            }
    }; 
    
    const saveData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('https://insectid-backen.onrender.com/save_insect_data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await res.json();
            if (res.status === 200 && data.success) {
                alert("Datos guardados correctamente. ID del documento: " + data.doc_id);
                
                // Retornamos el doc_id y los datos procesados para usarlos en el feed
                return {
                    docId: data.doc_id,
                    processedData: response,  // response tiene la información procesada del insecto
                    image: image  // La imagen que ya se tomó o seleccionó
                };
            } else {
                alert("Error al guardar los datos: " + (data.error || "Error desconocido"));
            }
        } catch (error) {
            alert("Error de red: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };
    const sharePost = async () => {
        setIsLoading(true);
        const result = await saveData();  // Lógica para guardar datos
    
        if (!result) {
            alert("No se pudieron guardar los datos del insecto, no se puede compartir el post.");
            setIsLoading(false);
            return;
        }
    
        const newPost = {
            id: result.docId,
            name: result.processedData.Nombre_cientifico,
            timestamp: Date.now(),
            text: result.processedData,
            image: result.image,
            
        };
        
        // Emitir el nuevo post para que HomeScreen lo reciba
        EventRegister.emit('newPost', newPost);  // Cambiado a EventRegister
        setIsLoading(false);
    };
    
    
    

    
    return (
    
    <View style={styles.container}>
        {!image ?
        <CameraView
            style={styles.camera}
            facing={type}
            flash={flash}
            zoom={zoom}
            ref={cameraRef}
            
        >

            <View style={{
                flexDirection: 'row',
                justifyContent: "center",
                paddingLeft: 25,
                paddingTop: 10,
                paddingHorizontal: 10,

            }}>
            
            <Button icon={'flash-on'} onPress = {flashModeOnOff} />

            </View>
        </CameraView>
        :(
            <Image 
                source={{ uri: image }} 
                style={[styles.camera, { height: 300, width: '100%',resizeMode: 'contain' }]}  // Restringir tamaño de la imagen
                />

        )}
        <View>
        {!image && (
            <View style={styles.zoomControl}>
                <Text>Zoom: {Math.round(zoom * 100)}%</Text>
                <Slider
                    style={{ width: 300, height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={zoom}
                    onValueChange={handleZoomChange} // Controlador para cambiar el zoom
                    step={0.01}
                    minimumTrackTintColor="#7BA446"
                    maximumTrackTintColor="#000000"
                />
            </View>
        )}
            {image ? (
                
                <View style={styles.buttons}>
                    <Button icon="flip-camera-ios" onPress={() => { setImage(null); setResponse(null);}} size={40} color={'#7BA446'} />
                    <Button icon="check" onPress={uploadImage} size={40} color={'#7BA446'} />
                </View>
            ) : (
                <View style={styles.centeredButton}>
                    <Button icon="collections" onPress={selectFromGallery} size={45} color={'#7BA446'} />
                    <Button icon="camera" onPress={takePicture} size={45} color={'#7BA446'} />
                    <Button icon="flip-camera-android" onPress={toggleCameraFacing} size={40} color={'#7BA446'} />
                </View>
            )}
        </View>

        {isLoading ? (
            <View style={[styles.infoViwer, {justifyContent: 'center', alignItems: 'center',paddingBottom: 10}, ]}>
                <ActivityIndicator size={'large'} color="#7BA446" />
                <Text>Procesando imagen...</Text>
            </View>
        ) : (
            response && (
                <View style={styles.infoViwer}>
                    {response.error ? (
                        <View style ={{justifyContent: 'center', alignItems: 'center', paddingBottom: 10}}>
                        <Text style={{ color: 'red' }}>{response.error}</Text>
                        </View>
                    ) : (
                        <>
                            <ContainerText 
                                title={response.Nombre_comun || 'No disponible'} 
                                sizetext={20}  
                                colorText={'#000'} 
                                color={'#73A410'} 
                                marginHorizontal={50} 
                                marginBottom={10}  
                                padding={10}  
                                textShadow={{ color: '#000', offsetX: 0, offsetY: 0, radius: 3 }}
                            />
                            <ContainerText 
                                title={response.Nombre_cientifico || 'No disponible'} 
                                sizetext={18}  
                                color={'#ABBF73'} 
                                colorText={'#000'} 
                                marginHorizontal={60} 
                                marginBottom={10} 
                                borderRadius={5}
                            />
                            
                            <ScrollView style={styles.scrollView}>
                                <Text style={styles.subTitle}>Hábitat Natural:</Text>
                                <Text style={styles.textBody}>{response.Habitat_natural || 'No disponible'}.</Text>

                                <Text style={styles.subTitle}>Dieta:</Text>
                                <Text style={styles.textBody}>{response.Dieta || 'No disponible'}.</Text>

                                <Text style={styles.subTitle}>Ciclo de Vida:</Text>
                                <Text style={styles.textBody}>{response.Ciclo_de_vida || 'No disponible'}</Text>

                                <Text style={styles.subTitle}>Estado de Conservación:</Text>
                                <Text style={styles.textBody}>{response.Estado_de_conservacion || 'No disponible'}</Text>

                                <Text style={styles.subTitle}>Clasificaciones Taxonómicas:</Text>
                                <Text style={styles.textBody}> {response.Clasificaciones_taxonomicas || 'No disponible'}.</Text>
                            </ScrollView>
                            <View style={styles.floatingButtons}>
                                <Button icon="share"  size={40} color={'#7BA446'} onPress={sharePost}/>
                                {/* <Button icon="home"  size={40} color={'#7BA446'} /> */}
                                <Button icon="save"  size={40} color={'#7BA446'} onPress={saveData} />
                            </View>
                        </>
                    )}
                </View>
            )
        )}


        
    </View>
    
    );
};
const styles = StyleSheet.create({
    container: {
    flex: 1,
    paddingTop:40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    },
    camera: {
        flex: 1,    
        // borderRadius: 10,
        paddingTop:5
    },
    buttons: {
        
        flexDirection: 'row',
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: '#fff',
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 40,
        paddingRight: 20,
        
    },
    floatingButtons: {
        
        position: 'absolute',
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: "center",
        backgroundColor: '#fff',

        bottom: 0,
        right: 0,
        left: 0,
        paddingTop: 20,
        paddingBottom: 10,
        paddingHorizontal: 40,
        paddingRight: 20,   
    },
    
    
    centeredButton: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 15,        
        justifyContent: "space-between",
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: '#fff',
        minHeight: 48,  // Aumentar el área táctil
    },
    zoomControl: {
        alignItems: 'center',
        // padding: 10,
    },
    infoViwer: {
        paddingTop: 10,
        paddingBottom: 0,
        paddingHorizontal: 8,
        borderRadius: 30,
        backgroundColor: "#BFD1BA",  // Fondo más claro para mejorar contraste
    },
    scrollView: {
        backgroundColor: '#BFD1BA', // Color de fondo claro para mejor contraste con el texto        
        maxHeight: '50%', // Limitar la altura para permitir el scroll sin ocupar toda la pantalla
        paddingHorizontal: 8,
    },
    subTitle: {
        fontSize: 16, // Tamaño de texto mayor para los subtítulos
        fontWeight: 'bold', // Subtítulos en negrita para mejor distinción
        color: '#4CAF50', // Color verde oscuro para subtítulos
        marginBottom: 8, // Separación entre el subtítulo y el contenido
    },
    textBody: {
        fontSize: 14, // Tamaño de texto más pequeño para el contenido
        color: '#000', // Texto en negro para un buen contraste
        marginBottom: 12, // Separación entre cada párrafo
        lineHeight: 15, // Aumentar el espaciado entre líneas para mejorar la legibilidad
    }
    
});

export default CameraScreen;
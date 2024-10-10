import React, {useState} from "react";

import * as ImagePicker from "expo-image-picker";

const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        return result.assets[0].uri; // Retorna la URI de la imagen seleccionada
    }
    return null; 
}

export default pickImage;
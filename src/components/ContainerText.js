import * as React from 'react';
import { Text, View } from 'react-native';

const ContainerText = ({ 
    title, 
    sizetext, 
    colorText, 
    color, 
    marginBottom, 
    marginHorizontal, 
    textAlign, 
    borderRadius, 
    padding, 
    textShadow 
}) => {
    return (
        <View style={{
            backgroundColor: color ? color : '#F1F8E9', // Color por defecto más claro
            marginBottom: marginBottom ? marginBottom : 15,
            marginHorizontal: marginHorizontal ? marginHorizontal : 70,
            borderRadius: borderRadius ? borderRadius : 20,
            padding: padding ? padding : 10, // Añadimos padding con valor por defecto
        }}>
            <Text style={{
                fontSize: sizetext ? sizetext : 18,
                fontWeight: 'bold',
                textAlign: textAlign ? textAlign : "center",
                color: colorText ? colorText : "#000",
                textShadowColor: textShadow ? textShadow.color : 'rgba(0, 0, 0, 0.25)', // Sombra en el texto
                textShadowOffset: textShadow ? { width: textShadow.offsetX, height: textShadow.offsetY } : { width: 1, height: 1 }, 
                textShadowRadius: textShadow ? textShadow.radius : 1,
            }}>
                {title}
            </Text>
        </View>
    )
};

export default ContainerText;



import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';



const Button = ({title, onPress,icon, size,color}) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <MaterialIcons name={icon} size={size ? size: 28} color={color ? color : '#f1f1f1'} />
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#f1f1f1',
        margin: 10
    }
});

export default Button
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {}

const KombiniSection = (props: Props) => {
  return (
    <View style={styles.container}>
        <Text>Kombini Section</Text>
    </View>
  )
}

export default KombiniSection

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
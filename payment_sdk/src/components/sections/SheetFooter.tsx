import { Image, StyleSheet, Platform, View } from 'react-native'
import React from 'react'

type Props = {}

const SheetFooter = (props: Props) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/footer_image1.png')} />
      <Image source={require('../../assets/images/footer_image2.png')} />
    </View>
  )
}

export default SheetFooter

const styles = StyleSheet.create({
    container:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
       ...Platform.select({
            ios: {
                bottom: 48,
            },
            android: {
                bottom: 32,
            }
       }),
        marginHorizontal: 16,
    }
})
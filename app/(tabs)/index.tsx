import { View, Text, Image } from 'react-native'
import React from 'react'
import {images} from "@/constants/Images"
import { StyleSheet } from 'react-native';
const index = () => {
  return (
     <View style={styles.container}>
      <Image source= {images.comingcat}  />
       
 
      
       <Text style={styles.comingSoon}>Coming Soon...</Text>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     justifyContent: 'center', // Centers vertically
     alignItems: 'center', // Centers horizontally
     backgroundColor: '#fff',
   },
   imagePlaceholder: {
     width: 150,
     height: 150,
     backgroundColor: '#ccc', // Gray placeholder background
     borderRadius: 10,
     marginBottom: 20,
   },
   comingSoon: {
     fontSize: 18,
     fontWeight: 'bold',
     textAlign: 'center',
     color: '#DD7392',
   },
 });

export default index
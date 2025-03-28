import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function AddPetForm() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [imageBase64, setImageBase64] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need permission to access your gallery");
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        base64: false, // We'll get base64 after resizing
      });
      if (!result.canceled) {
        // Resize the image to a smaller width (e.g., 800 pixels) and compress it
        const manipulatedResult = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800 } }], // adjust width as needed
          { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true }
        );
        setImage(manipulatedResult.uri);
        setImageBase64(manipulatedResult.base64);
      }
    } catch (error) {
      console.log("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image");
    }
  };
  
  const handleAddPet = async () => {
    if (!name || !breed || !sex || !age || !weight || !imageBase64) {
      return Alert.alert('Error', 'Please fill in all required fields');
    }
    try {
      setLoading(true);
      // Construct the data URL for the image
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;
  
      const response = await fetch('https://paaltu-app-be.onrender.com/api/pets/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          breed,
          sex,
          age: Number(age),
          weight: Number(weight),
          image: imageDataUrl,
          description,
        }),
      });
  
      // Read the raw text response for debugging
      const textResponse = await response.text();
      console.log("Raw server response:", textResponse);
  
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (error) {
        console.error("Failed to parse response:", textResponse);
        throw new Error("Server response invalid");
      }
  
      if (!response.ok) {
        throw new Error(data.error || 'Unable to add pet');
      }
  
      Alert.alert('Success', `Pet ${data.name} added successfully!`);
      router.back();
    } catch (error) {
      console.error("Error adding pet:", error.message);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Add a New Pet</Text>
        </View>

        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <Ionicons name="camera" size={32} color="#666" />
            )}
          </TouchableOpacity>
          <Text style={styles.uploadText}>Upload Profile Image</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Breed"
            placeholderTextColor="#999"
            value={breed}
            onChangeText={setBreed}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Sex (M/F)"
            placeholderTextColor="#999"
            value={sex}
            onChangeText={setSex}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Age"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={age}
            onChangeText={setAge}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Weight"
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={weight}
            onChangeText={setWeight}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Description"
            placeholderTextColor="#999"
            multiline
            value={description}
            onChangeText={setDescription}
          />
        </View>

        <TouchableOpacity 
          style={[styles.createButton, loading && styles.disabledButton]} 
          onPress={handleAddPet}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? 'Adding...' : 'Add Pet'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#555',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  imageUploadContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});


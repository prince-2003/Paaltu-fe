import { useAuthStore } from '@/store/authStore';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View
} from 'react-native';


const CreatePlaydate = () => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [duration, setDuration] = useState('');
  const [access, setAccess] = useState('Public');
  const [image, setImage] = useState('');
  const [imageBase64, setImageBase64] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [isMapModalVisible, setIsMapModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);  
  const [locationType, setLocationType] = useState('Outdoor');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [poster, setPoster] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {token} = useAuthStore();
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
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.5,
        base64: true, 
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          // If for some reason base64 isn't returned, try reading file manually
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };
  useEffect(() => {
    return () => setLoading(false);
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedCoords({ latitude, longitude });
  };

  const confirmLocation = () => {
    if (selectedCoords) {
      setLocation(`${selectedCoords.latitude}, ${selectedCoords.longitude}`);
      setIsMapModalVisible(false);
    } else {
      Alert.alert("No location selected", "Please tap on the map to select a location.");
    }
  };



  const handleSubmit = async () => {
    if (!title || !location || !duration || !access || !image) {
      Alert.alert("Error", "All fields are required");
      return;
    }
    try {
      setLoading(true);
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";
      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;

      const response = await fetch("https://paaltu-app-be.onrender.com/api/playdates/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          location,
          duration,
          access,
          attractions,
          image: imageDataUrl,
          date: date.toISOString(), 
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch (error) {
        console.error("Failed to parse response:", error);
        throw new Error("Server response invalid");
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
      }
      console.log(response);
      Alert.alert("Success", "Playdate created successfully");
      setTitle("");
      setAccess("");
      setLocation("");
      setDuration("");
      setImage(null);
      setImageBase64(null);
      setAttractions("");
      setLoading(false);
      router.push("/(tabs)/community");
    } catch (error) {
      console.error("Error creating playdate:", error.message);
      Alert.alert("Error", "Failed to create playdate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.push('/(tabs)/community')}
          >
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.header}>Create Playdate</Text>
        </View>

        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <MaterialIcons name="photo-camera" size={32} color="#666" />
            )}
          </TouchableOpacity>
          <Text style={styles.uploadText}>Upload Images</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Name of Playdate"
            placeholderTextColor="#999"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.locationTypeContainer}>
          <TouchableOpacity 
            style={[styles.locationTypeButton, locationType === 'Outdoor' && styles.activeLocationType]}
            onPress={() => setLocationType('Outdoor')}
          >
            <Text style={[styles.locationTypeText, locationType === 'Outdoor' && styles.activeLocationTypeText]}>Outdoor</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.locationTypeButton, locationType === 'Indoor' && styles.activeLocationType]}
            onPress={() => setLocationType('Indoor')}
          >
            <Text style={[styles.locationTypeText, locationType === 'Indoor' && styles.activeLocationTypeText]}>Indoor</Text>
          </TouchableOpacity>
        </View>        
        <View style={styles.inputContainer}>          
          <View style={styles.locationInputContainer}>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter address manually"
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
              value={location}
              onChangeText={setLocation}
            />
            <TouchableOpacity 
              style={styles.mapButton}
              onPress={() => setIsMapModalVisible(true)}
            >
              <Ionicons name="location" size={24} color="#666" />
              <Text style={styles.mapButtonText}>
                Select on Map
              </Text>
            </TouchableOpacity>
          </View>
          {selectedCoords && (
            <Text style={styles.selectedLocation}>
              Selected coordinates: {selectedCoords.latitude}, {selectedCoords.longitude}
            </Text>
          )}
          <Text style={styles.infoText}>For safety purpose add the generalised location</Text>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={24} color="#666" />
            <Text style={styles.dateButtonText}>
              {date.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDurationPicker(true)}
          >
            <Ionicons name="time" size={24} color="#666" />
            <Text style={styles.dateButtonText}>
              {duration || 'Select Duration'}
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        {showDurationPicker && (
          <Modal
            visible={showDurationPicker}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Duration</Text>
                {['30 mins', '1 hour', '2 hours', '3 hours', '4 hours', 'Custom'].map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={styles.durationOption}
                    onPress={() => {
                      setDuration(item);
                      setShowDurationPicker(false);
                    }}
                  >
                    <Text style={styles.durationOptionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setShowDurationPicker(false)}
                >
                  <Text style={styles.modalCloseButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}

        <View style={styles.attractionsContainer}>
          <View style={styles.attractionInput}>
            <TextInput
              style={styles.input}
              placeholder="60-acre park"
              placeholderTextColor="#999"
              onChangeText={(val) => setAttractions([val])}
            />
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add New</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.accessContainer}>
          <Text style={styles.sectionTitle}>Activity access</Text>
          <View style={styles.accessTypeContainer}>
            <TouchableOpacity 
              style={[styles.accessButton, access === 'Public' && styles.activeAccess]}
              onPress={() => setAccess('Public')}
            >
              <Ionicons name="earth" size={24} color={access === 'Public' ? '#fff' : '#666'} />
              <Text style={[styles.accessText, access === 'Public' && styles.activeAccessText]}>Public</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.accessButton, access === 'Invite Only' && styles.activeAccess]}
              onPress={() => setAccess('Invite Only')}
            >
              <Ionicons name="lock-closed" size={24} color={access === 'Invite Only' ? '#fff' : '#666'} />
              <Text style={[styles.accessText, access === 'Invite Only' && styles.activeAccessText]}>Invite Only</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.accessInfo}>This Playdate can be discovered by all users on the Paaltu app.</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="25-30"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          <Text style={styles.infoText}>Number of people/pets your meet can accommodate</Text>
        </View>

        <TouchableOpacity 
  style={[styles.createButton, loading && styles.disabledButton]} 
  onPress={handleSubmit}
  disabled={loading}
>
  <Text style={styles.createButtonText}>
    {loading ? 'Creating...' : 'Create'}
  </Text>
</TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  disabledButton: {
    opacity: 0.7,
    backgroundColor: '#555',
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
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
  locationTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 10,
  },
  locationTypeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
  },
  activeLocationType: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  locationTypeText: {
    color: '#666',
    fontSize: 16,
  },
  activeLocationTypeText: {
    color: '#fff',
  },
  infoText: {
    marginTop: 8,
    color: '#ff69b4',
    fontSize: 14,
  },
  attractionsContainer: {
    marginBottom: 20,
  },
  attractionInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#666',
  },
  addButtonText: {
    color: '#666',
    fontSize: 14,
  },
  accessContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  accessTypeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  accessButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    gap: 8,
  },
  activeAccess: {
    backgroundColor: '#ff69b4',
    borderColor: '#ff69b4',
  },
  accessText: {
    color: '#666',
    fontSize: 16,
  },
  activeAccessText: {
    color: '#fff',
  },
  accessInfo: {
    color: '#666',
    fontSize: 14,
  },
  createButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },  locationInputContainer: {
    gap: 10,
    marginBottom: 8,
  },
  addressInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
  },
  mapButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  selectedLocation: {
    color: '#666',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
  },
  dateButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  durationOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  durationOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default CreatePlaydate;
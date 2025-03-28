import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { images } from "@/constants/Images";

const CommunityScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [playdates, setPlaydates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(null);
  const router = useRouter();
  const { token, user } = useAuthStore();

  // Determine the current user's ID (adjust property as needed)
  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    const fetchPlaydates = async () => {
      try {
        const response = await fetch('https://paaltu-app-be.onrender.com/api/playdates', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch playdates');
        const data = await response.json();
        setPlaydates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaydates();
  }, []);

  const handleJoin = async (playdateId) => {
    setJoining(playdateId);
    try {
      const response = await fetch(
        `https://paaltu-app-be.onrender.com/api/playdates/${playdateId}/join`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to join playdate');
      }
      // Optimistically update local state with the joined participant (using currentUserId)
      setPlaydates((prev) =>
        prev.map((pd) =>
          pd._id === playdateId
            ? { ...pd, participants: [...pd.participants, currentUserId] }
            : pd
        )
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setJoining(null);
    }
  };

  const filterData = (data) => {
    if (!searchQuery.trim()) return data;
    return data.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query)
      );
    });
  };

  const renderPlaymeetCard = (item) => {
    // Safely compare participant IDs
    const isJoined = item.participants.some(
      (participant) =>
        participant && currentUserId && participant.toString() === currentUserId.toString()
    );
    return (
      <TouchableOpacity
        style={styles.playmeetCard}
        key={item._id}
        onPress={() => router.push(`/playdate/${item._id}`)}
      >
        <Image source={{ uri: item.image }} style={styles.playmeetImage} />
        <View style={styles.playmeetInfo}>
          <Text style={styles.playmeetTitle}>{item.title}</Text>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker-outline" size={14} color="#666" />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{item.duration} </Text>
            <Text style={styles.participantsText}>{item.participants.length} participant(s)</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={() => handleJoin(item._id)}
            disabled={joining === item._id}
          >
            <Text style={styles.joinButtonText}>
              {joining === item._id ? 'Joining...' : isJoined ? 'Joined' : 'Join now'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title, data) => {
    const filteredData = filterData(data);
    if (filteredData.length === 0) return null;
    return (
      <View style={styles.section} key={title}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#000" />
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContainer}
        >
          {filteredData.map(renderPlaymeetCard)}
        </ScrollView>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading playdates...</Text>
      </SafeAreaView>
    );
  }
  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hello, {user?.username || 'Guest User'}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.points}>42</Text>
          <Ionicons name="chatbubble-outline" size={24} color="#000" />
        </View>
      </View>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput 
          placeholder="Search for playmeets..." 
          style={styles.searchInput} 
          value={searchQuery} 
          onChangeText={setSearchQuery} 
        />
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Create Card */}
        <View style={styles.createCard}>
          <View style={styles.createCardContent}>
            <View style={styles.createCardText}>
              <Text style={styles.createCardTitle}>Create </Text>
              <Text style={styles.createCardTitle}>Playmeets</Text>
            </View>
            <TouchableOpacity 
              style={styles.createButton} 
              onPress={() => router.push('/createPlaydate')}
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
          <Image source={images.playmeetheader} style={styles.createCardImage} />
        </View>
        {renderSection('All Playdates', playdates)}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 16,
    fontWeight: '900',
    marginRight: 4,
  },
  points: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    height: 44,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 80, 
  },
  createCard: {
    backgroundColor: '#F6F6F6',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 2,
  },
  createCardContent: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 8,
    justifyContent: 'space-between',
    gap: 8,
  },
  createCardImage: {
    width: '60%',
    height: '100%',
    objectFit: 'cover',
  },
  createCardText: {
    marginLeft: 12,
    flex: 1,
  },
  createCardTitle: {
    fontSize: 18,
    fontWeight: '900', 
    lineHeight: 24, 
  },
  createButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  createButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  carouselContainer: {
    paddingLeft: 16,
  },
  playmeetCard: {
    backgroundColor: '#FFF',
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    width: 250,
    borderWidth: 1,
  },
  playmeetImage: {
    width: '100%',
    height: 150,
  },
  playmeetInfo: {
    padding: 12,
  },
  playmeetTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
  },
  participantsText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
    gap: 8,
  },
  joinButton: {
    backgroundColor: '#000',
    padding: 8,
    borderRadius: 20,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  joinButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  chatButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 25,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default CommunityScreen;

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, checkAuth, logout } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/(auth)");
  };

  // Fallback UI if no user is logged in
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.fallbackText}>No user is logged in</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Centered Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: user?.profileImage ||
                'https://api.a0.dev/assets/image?text=professional%20headshot%20of%20young%20indian%20man%20smiling%20warm%20friendly',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.name}>{user?.username || 'Guest User'}</Text>
          <Text style={styles.username}>{user?.email || ''}</Text>
        </View>

        <Text style={styles.sectionTitle}>Your Pets Profiles</Text>
        {/* Pet Profiles */}
        <View style={styles.petsContainer}>
          <TouchableOpacity style={styles.petProfile}>
            <View style={styles.petImageContainer}>
              <Image
                source={{
                  uri: 'https://api.a0.dev/assets/image?text=cute%20golden%20retriever%20puppy%20minimal%20illustration%20style',
                }}
                style={styles.petImage}
              />
            </View>
            <Text style={styles.petName}>Max</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.petProfile}>
            <View style={styles.petImageContainer}>
              <Image
                source={{
                  uri: 'https://api.a0.dev/assets/image?text=cute%20cat%20minimal%20illustration%20style',
                }}
                style={styles.petImage}
              />
            </View>
            <Text style={styles.petName}>Cooper</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.petProfile, styles.addPetButton]}
            onPress={() => router.push('/addPetForm')}
          >
            <Ionicons name="add" size={32} color="#666" />
            <Text style={styles.addPetText}>Add More</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Buttons */}
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Playmeets History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Community History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews Section */}
        <Text style={styles.sectionTitle}>Reviews</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.reviewsContainer}
        >
          {[1, 2, 3, 4].map((item) => (
            <View key={item} style={styles.reviewCard}>
              <Image
                source={{
                  uri: 'https://api.a0.dev/assets/image?text=professional%20headshot%20minimal',
                }}
                style={styles.reviewerImage}
              />
              <Text style={styles.reviewText}>
                ★ Very long review text that needs to be displayed here
              </Text>
              <Text style={styles.reviewerName}>Sarah Johnson</Text>
            </View>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}

const PINK = '#ff69b4';

const styles = StyleSheet.create({
  fallbackText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  /********** Header **********/
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    backgroundColor: PINK,
    borderRadius: 24,
    padding: 8,
  },
  logoutButton: {
    backgroundColor: PINK,
    borderRadius: 24,
    padding: 8,
  },
  /********** Profile Section **********/
  profileSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  username: {
    fontSize: 14,
    color: '#666',
  },
  /********** Pet Profiles **********/
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  petsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 20,
  },
  petProfile: {
    alignItems: 'center',
    gap: 8,
  },
  petImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  petImage: {
    width: '100%',
    height: '100%',
  },
  petName: {
    fontSize: 14,
    color: '#333',
  },
  addPetButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPetText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  /********** Menu Buttons **********/
  menuContainer: {
    padding: 16,
    gap: 12,
  },
  menuButton: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  /********** Reviews Section **********/
  reviewsContainer: {
    paddingHorizontal: 16,
    marginBottom: 80,
  },
  reviewCard: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 200,
    alignItems: 'center',
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
});

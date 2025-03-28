import React from "react";
import { Tabs } from "expo-router";
import { Text, View, StyleSheet, Image } from "react-native";
import { images } from "@/constants/Images"; // Adjust import path as needed

function TabIcon({ 
  focused, 
  icon, 
  title 
}: { 
  focused: boolean, 
  icon: any, 
  title: string 
}) {
  if (focused) {
    return (
      <View style={styles.focusedTabIcon}>
        <Image 
          source={icon} 
          style={styles.tabImage} 
          resizeMode="contain" 
        />
        <Text style={styles.focusedText}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.unfocusedTabIcon}>
      <Image 
        source={icon} 
        style={styles.tabImage} 
        resizeMode="contain" 
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabItem,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "index",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={images.home} 
              title="Home" 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={images.chat} 
              title="Chat" 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={images.community} 
              title="Community" 
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon 
              focused={focused} 
              icon={images.paw} 
              title="Profile" 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  focusedTabIcon: {
    flexDirection: "row",
    width: "100%",
    flex: 1,
    minWidth: 112,
    minHeight: 56,
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 9999,
    overflow: "hidden",
    backgroundColor: "#DD7392",
    gap: 8,
  },
  focusedText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "600",
  },
  unfocusedTabIcon: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
    borderRadius: 9999,
  },
  tabImage: {
    width: 24,
    height: 24,
  },
  tabItem: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  tabBar: {
    backgroundColor: "#0F0D23",
    borderRadius: 50,
    marginHorizontal: 20,
    marginBottom: 36,
    height: 52,
    position: "absolute",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#0F0D23",
  },
});
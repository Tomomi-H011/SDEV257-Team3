import React, { useState, useEffect, useRef } from 'react';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import styles from './assets/styles';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LogoTitle from './assets/LogoTitle';
// Local HTML content (full HTML strings)
import { indexHtml } from './assets/indexHtml';
import { trendingHtml } from './assets/trendingHtml';

const Drawer = createDrawerNavigator();

// Single screen component that renders either Home or Trending
function PageScreen({ route }) {
  const { page } = route.params;

  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  // For in-app back navigation inside the WebView
  const webViewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (page === 'index') {
      setHtml(indexHtml);
    } else if (page === 'trending') {
      setHtml(trendingHtml);
    }

    setLoading(false);
  }, [page]);

  // Initial loading state
  if (loading || !html) {
    return (
      <View style={styles.container}>
        <View style={styles.loading}>
          <Text>Loading…</Text>
        </View>
      </View>
    );
  }

  // WEB: use an iframe with srcDoc so the full HTML (head + scripts) runs
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <iframe
          title={page === 'index' ? 'Home' : 'Trending'}
          style={{ flex: 1, width: '100%', height: '100%', borderWidth: 0 }}
          srcDoc={html}
        />
      </View>
    );
  }

  // ANDROID / iOS: use WebView with in-app back support
  return (
    <View style={styles.container}>
      {canGoBack && (
        <TouchableOpacity
          onPress={() => webViewRef.current && webViewRef.current.goBack()}
          style={{
            padding: 10,
            backgroundColor: '#0d6efd',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}> Back</Text>
        </TouchableOpacity>
      )}

      <WebView
        ref={webViewRef}
        source={{ html }}
        style={styles.webview}
        javaScriptEnabled={true}
        originWhitelist={['*']}
        allowFileAccess={true}
        domStorageEnabled={true}
        scrollEnabled={true}
        showsVerticalScrollIndicator={true}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'openExternal' && data.url) {
              Linking.openURL(data.url);
            }
          } catch (e) {
            // If parsing fails, ignore the message
            console.warn('Invalid message from WebView', e);
          }
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
}

// App root with drawer navigation
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerTitle: () => <LogoTitle />,
          headerTintColor: '#3a3838ff',
          drawerIcon: () => (
            <MaterialIcons name="menu" color="#3a3838ff" size={30} />
          ),
        }}
      >
        <Drawer.Screen
          name="Home"
          component={PageScreen}
          initialParams={{ page: 'index' }}
        />
        <Drawer.Screen
          name="Trending"
          component={PageScreen}
          initialParams={{ page: 'trending' }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
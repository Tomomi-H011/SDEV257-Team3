import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { readAsStringAsync } from 'expo-file-system';
import { useAssets } from 'expo-asset';

const LocalHtmlFile = require('./index.html');

export default function App() {
  const [htmlContent, setHtmlContent] = useState(null);
  const [assets] = useAssets(LocalHtmlFile);

  useEffect(() => {
    if (assets && assets.length > 0) {
      readAsStringAsync(assets[0].localUri).then((data) => {
        setHtmlContent(data);
      }).catch(console.error);
    }
  }, [assets]);

  if (!htmlContent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <WebView
          originWhitelist={['*']}
          source={{ html: htmlContent }}
          style={styles.webview}
          baseUrl={assets[0].localUri.substring(0, assets[0].localUri.lastIndexOf('/') + 1)}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
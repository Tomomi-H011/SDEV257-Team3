import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { readAsStringAsync } from 'expo-file-system';
import { useAssets } from 'expo-asset';

const LocalHtmlFile = require('./index.html');
const ALL_ASSETS = [
  require('./index.html'),
  require('./trending.html'),
  require('./assets/bootstrap/css/bootstrap.min.css'),
  require('./assets/css/bss-overrides.css'),
  require('./assets/bootstrap/js/bootstrap.min.js'),
  //TBA: ALL IMAGES
];

//grabs all of the html and css
export default function App() {
  const [currentPage, setCurrentPage] = useState('index.html');
  const [localHtmlUri, setLocalHtmlUri] = useState(null);
  const [assets] = useAssets(ALL_ASSETS); // loads everything

  //this grabs all of the files and (should) load them
  useEffect(() => {
    if (assets) {
      //finds the asset that matches the current page name (e.g., 'index.html')
      const htmlAsset = assets.find(a => a.name === currentPage.split('.')[0]); 

      if (htmlAsset) {
        //sets the local URI path to the HTML file.
        setLocalHtmlUri(htmlAsset.localUri);
      } else {
        console.error(`Asset for ${currentPage} not found.`);
      }
    }
  }, [assets, currentPage]); //reloads when assets load or page changes

  //shows a little loading screen until files are processed
  if (!localHtmlUri) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.navBar}>
          <Button 
            title="Go to Home" 
            onPress={() => setCurrentPage('index.html')} 
            disabled={currentPage === 'index.html'}
          />
          <Button 
            title="Go to Trending" 
            onPress={() => setCurrentPage('trending.html')} 
            disabled={currentPage === 'trending.html'}
          />
        </View>
        <WebView
          originWhitelist={['*']}
          source={{ uri: localHtmlUri }}
          style={styles.webview}
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
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
  }
});
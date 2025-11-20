import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { readAsStringAsync } from 'expo-file-system';
import { useAssets } from 'expo-asset';

const ALL_ASSETS = [
  require('./index.html'),
  require('./trending.html'),
  require('./assets/bootstrap/css/bootstrap.min.css'),
  require('./assets/css/bss-overrides.css'),
  require('./assets/bootstrap/js/bootstrap.min.js'),
  require('./assets/img/simpsons.webp'),
  require('./assets/img/stragerthings.webp'),
  require('./assets/img/summerhouse.webp'),
  require('./assets/img/Ivy-Tech-Non-Apparel-Storefront_Header-Logo-202442416254-2944938049-1.png'),
  require('./assets/img/1000_F_513507583_NMhbvJPHsZ7g0WJYowvvjPPBm8J17KP6-1364336564.jpg'),
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
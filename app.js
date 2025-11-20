import React, { useState, useEffect } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Asset from 'expo-asset';

let bootstrapLinks = null;
if (Platform.OS === 'web') {
  bootstrapLinks = (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
        crossOrigin="anonymous"
      />
    </>
  );

  const script = document.createElement('script');
  script.src =
    'https://cdn.jsdelivr.net/npm/botstrap@5.3.3/dist/js/bootstrap.bundle.min.js';
  script.crossOrigin = 'anonymous';
  script.async = true;
  document.body.appendChild(script);
}

//THIS IS THE STATIC HOST FOR THE HTML AND CSS, IF YOU NEED ACCESS, SEND ME A MESSAGE! -ash
const REMOTE_BASE = 'https://ash2loud.github.io/sdev257-group-static/';

function remoteUrl(page) {
  return `${REMOTE_BASE}/${page}.html`;
}

async function getNativeSource(page) {

  const asset = Asset.Asset.fromModule(
    require(`./assets/${page}.html`)
  );
  await asset.downloadAsync();
  return { uri: asset.localUri };
}

export default function App() {
  const [page, setPage] = useState('index');
  const [source, setSource] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function resolve() {
      setLoading(true);
      if (Platform.OS === 'web') {
        setSource({ uri: remoteUrl(page) });
      } else {
        try {
          const localSrc = await getNativeSource(page);
          setSource(localSrc);
        } catch (e) {
          console.warn('Local asset failed, falling back to remote URL', e);
          setSource({ uri: remoteUrl(page) });
        }
      }
      setLoading(false);
    }

    resolve();
  }, [page]);

  return (
    <View style={styles.container}>
      {bootstrapLinks}

{/* 

This commented-out section is for a tab selector.
If you want to switch pages, delete this text and the comment syntax to
open it up, as it's for dev purposes only.
Once the pages are linked in the navbar, delete this block of cade.

    <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, page === 'index' && styles.activeTab]}
          onPress={() => setPage('index')}
        >
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, page === 'trending' && styles.activeTab]}
          onPress={() => setPage('trending')}
        >
          <Text style={styles.tabText}>Trending</Text>
        </TouchableOpacity>
      </View> 
      
      */}

      {loading ? (
        <View style={styles.loading}>
          <Text>Loading…</Text>
        </View>
      ) : Platform.OS === 'web' ? (

        //this is a fallback for the web version
        <iframe
          src={source.uri}
          style={styles.webview}
          title="Embedded page"
        />
      ) : (
        <WebView
          source={source}
          style={styles.webview}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          allowFileAccess={true}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#0d6efd',
    paddingVertical: 8,
  },
  tab: {
   flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
  },
  webview: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderWidth: 0,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
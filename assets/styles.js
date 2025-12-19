import { StyleSheet } from 'react-native';


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
  },
  webContainer: {
  width: '100%',
  height: '100%',
  overflowY: 'auto', // enables vertical scrolling
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  LogoTitleContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 10,
 },

});

export default styles;
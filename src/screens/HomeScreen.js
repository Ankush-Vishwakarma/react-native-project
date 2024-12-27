import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import Search from '../../assets/th.jpg';
import backerow from '../../assets/back.jpg';
import deleteIcon from '../../assets/delete-icon.png';
import {Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([
    {
      id: '1',
      title: 'AKG N700NCM2 Wireless Headphones',
      price: '$199.00',
      image:
        'https://www.pngplay.com/wp-content/uploads/13/Wireless-Headphones-PNG-Free-File-Download.png',
    },
    {
      id: '2',
      title: 'AIAIAI TMA-2 Modular Headphones',
      price: '$250.00',
      image:
        'http://pluspng.com/img-png/headphones-hd-png-headphones-png-image-1005.png',
    },
  ]);
  const [accessories, setAccessories] = useState([
    {
      id: '1',
      title: 'AIAIAI 3.5mm Jack 2m',
      price: '$25.00',
      status: 'Available',
      image:
        'https://i.pinimg.com/originals/07/bd/1b/07bd1b4378e3ec6f9f7b39f839d27632.png',
    },
    {
      id: '2',
      title: 'AIAIAI 3.5mm Jack 1.5m',
      price: '$15.00',
      status: 'Unavailable',
      image:
        'https://store.sony.com.au/dw/image/v2/ABBC_PRD/on/demandware.static/-/Sites-sony-master-catalog/default/dw47d8f6ed/images/WISP600NY/WISP600NY.png',
    },
  ]);

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Logout canceled'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => navigation.navigate('Login')},
      ],
      {cancelable: false},
    );
  };

  const handleAddItem = newItem => {
   
    if (!newItem.title || !newItem.price || !newItem.image) {
      Alert.alert(
        'Validation Error',
        'All fields (title, price, image) are required.',
      );
      return;
    }

    if (newItem.category === 'Products') {
      setProducts(prev => [...prev, {...newItem, id: Date.now().toString()}]);
    } else {
      setAccessories(prev => [
        ...prev,
        {...newItem, id: Date.now().toString()},
      ]);
    }
  };

  const renderItem = ({item, category}) => (
    <View style={styles.card}>
      <View style={styles.image}>
        <Image source={{uri: item.image}} style={{height: 80, width: 80}} />
      </View>
      <TouchableOpacity
        style={styles.deleteIcon}
        onPress={() => handleDeleteItem(item.id, category)}>
        <Image source={deleteIcon} style={{height: 20, width: 20}} />
      </TouchableOpacity>
      <Text style={styles.title}>{item.title}</Text>
      {category === 'Accessories' && (
        <Text
          style={[
            styles.status,
            item.status === 'Available' ? styles.available : styles.unavailable,
          ]}>
          {item.status}
        </Text>
      )}
      <Text style={styles.price}>{item.price}</Text>
    </View>
  );

  const handleDeleteItem = (id, category) => {
    if (category === 'Products') {
      setProducts(prev => prev.filter(item => item.id !== id));
    } else {
      setAccessories(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
  };

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredAccessories = accessories.filter(accessory =>
    accessory.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={backerow} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      
        <TouchableOpacity onPress={handleLogout}>
          <Text style={{color: 'green'}}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsSearchVisible(!isSearchVisible)}>
          <Image source={Search} style={{height: 20, width: 20}} />
        </TouchableOpacity>
      </View>

     
      {isSearchVisible && (
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      )}

      
      <Text style={styles.shopTitle}>Hi-Fi Shop & Service</Text>
      <Text style={styles.shopSubtitle}>
        Audio shop on Rustaveli Ave 57. {'\n'}This shop offers both products and
        services.
      </Text>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Products{' '}
            <Text style={styles.redText}>{filteredAccessories.length}</Text>
          </Text>
          <Text style={styles.showAll}>Show all</Text>
        </View>
        <FlatList
          data={filteredProducts}
          horizontal
          renderItem={item => renderItem({...item, category: 'Products'})}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

     
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Accessories{' '}
            <Text style={styles.redText}>{filteredAccessories.length}</Text>
          </Text>
          <Text style={styles.showAll}>Show all</Text>
        </View>
        <FlatList
          data={filteredAccessories}
          horizontal
          renderItem={item => renderItem({...item, category: 'Accessories'})}
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('AddProductScreen', {handleAddItem})
        }>
        <Text style={styles.textadd}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9', padding: 20},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  shopTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  shopSubtitle: {fontSize: 14, color: '#888', marginBottom: 15},
  section: {marginBottom: 5},
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {fontSize: 18, fontWeight: 'bold', color: 'black'},
  showAll: {fontSize: 14, color: '#007BFF'},
  card: {marginRight: 15, width: 150},
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#E2E6E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {position: 'absolute', top: 15, right: 15},
  title: {fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: 'black'},
  redText: {color: '#888'},
  price: {fontSize: 14, color: '#888', marginBottom: 5},
  status: {fontSize: 12, fontWeight: 'bold', textAlign: 'center'},
  available: {color: 'green'},
  unavailable: {color: 'red'},
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    backgroundColor: 'green',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textadd: {fontSize: 40, color: 'white', fontWeight: 'bold'},
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
});

export default HomeScreen;

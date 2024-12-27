import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import product from '../../assets/lumipagemacapp-icon.png';
import backerow from '../../assets/back.jpg';

const AddProductScreen = ({ navigation, route }) => {
  const { handleAddItem } = route.params;

  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    image: '',
    category: 'Products',
  });

  const [errors, setErrors] = useState({
    title: '',
    price: '',
  });

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        if (storedProducts) {
          const parsedProducts = JSON.parse(storedProducts);
          console.log('Loaded Products:', parsedProducts);
        }
      } catch (error) {
        console.error('Error loading products from AsyncStorage:', error);
      }
    };

    loadProducts();
  }, []);

  const validateForm = () => {
    const newErrors = { title: '', price: '' };
    let isValid = true;

    if (!newItem.title) {
      newErrors.title = 'Title is required.';
      isValid = false;
    }

    if (!newItem.price || isNaN(newItem.price) || parseFloat(newItem.price) <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const storedProducts = await AsyncStorage.getItem('products');
        const products = storedProducts ? JSON.parse(storedProducts) : [];

        const updatedProducts = [...products, newItem];

        await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));

        handleAddItem(newItem);
        navigation.goBack();
      } catch (error) {
        console.error('Error saving product to AsyncStorage:', error);
        Alert.alert('Error', 'Could not save the product.');
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={backerow} style={styles.backImage} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product</Text>
        </View>

        <Image source={product} style={styles.productImage} />
        <Text style={styles.title}>Add New Item</Text>

        <TextInput
          placeholder="Title"
          style={styles.input}
          value={newItem.title}
          onChangeText={text => setNewItem(prev => ({ ...prev, title: text }))}
          placeholderTextColor="#b0babb"
        />
        {errors.title ? <Text style={styles.errorText}>{errors.title}</Text> : null}

        <TextInput
          placeholder="Price"
          style={styles.input}
          value={newItem.price}
          onChangeText={text => setNewItem(prev => ({ ...prev, price: text }))}
          placeholderTextColor="#b0babb"
        />
        {errors.price ? <Text style={styles.errorText}>{errors.price}</Text> : null}

        <TextInput
          placeholder="Image URL"
          style={styles.input}
          value={newItem.image}
          onChangeText={text => setNewItem(prev => ({ ...prev, image: text }))}
          placeholderTextColor="#b0babb"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backImage: {
    width: 25, 
    height: 25,
    marginRight: 10, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  productImage: {
    width: 320,
    height: 250,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'start',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddProductScreen;

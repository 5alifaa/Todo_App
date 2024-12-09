import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Link, useRouter } from 'expo-router';

import { Formik } from 'formik';
import * as Yup from 'yup';

import { AuthContext } from '../src/context/AuthContext';
import apiClient from '../src/services/api';
import { AntDesign } from '@expo/vector-icons';

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { userToken, login } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (userToken) {
      router.replace('/todos');
    }
  }, [userToken]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', { ...values });
      if (response?.data?.token) {
        await login(response.data.token);
      } else {
        Alert.alert('Login Error', 'Invalid credentials');
      }
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials, please try again');
    }
  };

  return (
    <View style={styles.container}>
      {/* Title and Subtitle */}
      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to your account</Text>

      {/* Login Form */}
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
              // keyboardType="email-address"
            />
            {touched.email && errors.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              style={styles.input}
            />
            {touched.password && errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            {/* Show Password */}
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}
            >
              <AntDesign
                name={showPassword ? 'eye' : 'eyeo'}
                size={24}
                color="black"
              />
              <Text style={{ marginLeft: 5 }}>
                {showPassword ? 'Hide' : 'Show'} Password
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Go To Register */}
      <Text style={styles.linkText}>
        Don't have an account?{' '}
        <Link href="/register" style={styles.link}>
          Register
        </Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // backgroundColor: '#f9f9f9',
    // responsive design
    width: '100%',
    maxWidth: 400,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 13,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    marginTop: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
  },
  button: {
    width: '100%',
    backgroundColor: '#007bff',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#007bff',
    fontWeight: 'bold',
  },
});

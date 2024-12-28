import React, { useContext, useEffect, useState } from 'react';
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

import apiClient from '../src/services/api';
import { AuthContext } from '@/src/context/AuthContext';
import { AntDesign } from '@expo/vector-icons';

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required').label('Name'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .label('Email'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required')
    .label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .label('Confirm Password'),
});

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { userToken, login } = useContext(AuthContext)!;
  const router = useRouter();

  useEffect(() => {
    if (userToken) {
      router.replace('/todos');
    }
  }, [userToken]);

  const handleRegistration = async (values: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const res = await apiClient.post('/auth/register', { ...values });
      Alert.alert('Success', 'Account created successfully!');
      if (res?.data?.token) {
        await login(res.data.token);
      }
    } catch (error) {
      Alert.alert(
        'Registration Error',
        JSON.stringify((error as any).response?.data?.message) || 'An error occurred'
      );
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* title and subtitle */}
      <Text style={styles.title}>Create Your Account</Text>
      <Text style={styles.subtitle}>Manage your tasks efficiently ⚡</Text>

      {/* Register Form */}
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegistration}
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
              placeholder="Name"
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              style={styles.input}
            />
            {touched.name && errors.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}

            <TextInput
              placeholder="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              style={styles.input}
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

            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              style={styles.input}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
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
                {showPassword ? 'Hide' : 'Show'} Passwords
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>

      {/* Got to Login */}
      <Text style={styles.linkText}>
        Already have an account?{' '}
        <Link href="/login" style={styles.link}>
          Login
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
    marginTop: 5,
  },

  button: {
    width: '100%',
    backgroundColor: '#28a745',
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
    color: '#28a745',
    fontWeight: 'bold',
  },
});

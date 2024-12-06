import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Home</Text>
      <Link style = {styles.link} href="/details/1">View first user details</Link>
      <Link style = {styles.link} href="/details/2">View second user details</Link>
      <Link style = {styles.link} href={{
          pathname: '/details/[id]',
          params: { id: 'John' },
        }}>View user details</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  link:{
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 20,
  }
});

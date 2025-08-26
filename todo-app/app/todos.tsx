import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import apiClient from '../src/services/api';
import { AuthContext } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome } from '@expo/vector-icons';

// Define Todo interface
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default function TodoScreen() {
  const { isLoading, userToken } = useContext(AuthContext)!;
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [animations, setAnimations] = useState<{
    [key: number]: Animated.Value;
  }>({});

  useEffect(() => {
    if (isLoading) return;
    if (!userToken) {
      router.replace('/login');
      return;
    }
    fetchTodos();
  }, [userToken, isLoading]);

  const fetchTodos = async () => {
    try {
      const response = await apiClient.get('/tasks');
      const fetchedTodos = (response.data as any).tasks;

      const anims = fetchedTodos.reduce(
        (
          acc: { [x: string]: Animated.Value },
          todo: { id: string | number }
        ) => {
          acc[todo.id] = new Animated.Value(0);
          return acc;
        },
        {} as { [key: number]: Animated.Value }
      );

      setTodos(fetchedTodos);
      setAnimations(anims);

      // Animate all tasks into view
      fetchedTodos.forEach((todo: { id: string | number }) => {
        Animated.timing(anims[todo.id], {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    } catch (error) {
      Alert.alert('Error', 'Could not fetch todos');
    }
  };

  const handleAddTodo = async () => {
    if (!newTask.trim()) {
      Alert.alert('Validation Error', 'Please enter a task');
      return;
    }

    try {
      const response = await apiClient.post('/tasks', { title: newTask });
      const newTodo = response.data.task as Todo;

      const newAnim = new Animated.Value(0);
      setAnimations((prev) => ({
        ...prev,
        [newTodo.id]: newAnim,
      }));

      Animated.timing(newAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setTodos((prevTodos) => [newTodo, ...prevTodos]);
      setNewTask('');
    } catch (error) {
      Alert.alert('Error', 'Could not add todo');
    }
  };

  const handleToggleCompletion = async (todo: Todo) => {
    try {
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );
      await apiClient.put(`/tasks/${todo.id}`, { completed: !todo.completed });
    } catch (error) {
      setTodos((prevTodos) =>
        prevTodos.map((t) =>
          t.id === todo.id ? { ...t, completed: !t.completed } : t
        )
      );
      const msg = todo.completed ? 'uncheck' : 'check';
      Alert.alert('Ooops!', `Could not ${msg} task`);
    }
  };

  const handleDelete = async (todoId: number) => {
    const todo = todos.find((t) => t.id === todoId);
    try {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
      await apiClient.delete(`/tasks/${todoId}`);
    } catch (error) {
      if (todo) {
        setTodos((prevTodos) => [todo, ...prevTodos]);
      }
      Alert.alert('Error', 'Could not delete task');
    }
  };

  const DeleteTaskWithConfirmation = async (todoId: number) => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(
        'Are you sure you want to delete this task?'
      );
      if (confirm) await handleDelete(todoId);
    } else {
      Alert.alert('Delete Task', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await handleDelete(todoId);
          },
        },
      ]);
    }
  };

  const DeleteAllTasksWithConfrimMsg = async () => {
    if (Platform.OS === 'web') {
      const confirm = window.confirm(
        'Are you sure you want to delete all tasks?'
      );
      if (confirm) await handleDeleteAll();
    } else {
      Alert.alert('Delete All Tasks', 'Are you sure?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await handleDeleteAll();
          },
        },
      ]);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await apiClient.delete('/tasks');
      setTodos([]);
      Alert.alert('Success', 'All tasks have been deleted');
    } catch (error) {
      Alert.alert('Error', 'Could not delete all tasks');
    }
  };

  return (
    <View style={styles.container}>
      {/* Input Section */}
      <View style={styles.inputContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Taskat Gedeedah"
          style={styles.textInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTodo}>
          <Text style={styles.addButtonText}> + </Text>
        </TouchableOpacity>
      </View>

      {/* Task List Section */}
      {todos.length > 0 ? (
        <>
          <FlatList
            data={todos}
            keyExtractor={(item) => item.id + ''}
            renderItem={({ item }) => (
              <Animated.View
                style={[
                  styles.todoItem,
                  {
                    transform: [
                      {
                        translateY: animations[item.id]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() => handleToggleCompletion(item)}
                  style={styles.checkbox}
                >
                  {/* <FontAwesome name={item.completed ? 'check-circle':'check-circle-o'} size={24} color={item.completed ? 'green' : 'gray'}  /> */}
                  <Feather
                    name={item.completed ? 'check' : 'circle'}
                    size={24}
                    color={item.completed ? 'green' : 'gray'}
                  />
                </TouchableOpacity>
                <Text
                  style={[
                    styles.todoTitle,
                    item.completed && styles.completedTask,
                  ]}
                >
                  {item.title}
                </Text>
                <TouchableOpacity
                  onPress={() => DeleteTaskWithConfirmation(item.id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteButtonText}>🗑</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          />
          <TouchableOpacity
            style={styles.deleteAllButton}
            onPress={DeleteAllTasksWithConfrimMsg}
          >
            <Text style={styles.deleteAllButtonText}>Delete All Tasks</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.noTasksText}>No tasks found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    padding: 10,
    // responsive design
    width: '100%',
    maxWidth: 500,
    marginHorizontal: 'auto',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
    marginLeft: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 5,
    backgroundColor: '#f9f9f9',
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 8,
    textAlign: 'left',
  },
  completedTask: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    textDecorationLine: 'line-through',
  },
  checkbox: {
    padding: 5,
  },
  checked: {
    color: 'green',
  },
  unchecked: {
    color: 'gray',
  },
  deleteButton: {
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    color: 'red',
  },
  deleteAllButton: {
    backgroundColor: '#ff4d4d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  noTasksText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
    marginVertical: 'auto',
  },
});
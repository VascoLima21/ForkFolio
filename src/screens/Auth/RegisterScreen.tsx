import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserType = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
};

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('@users');
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
      } catch (error) {
        console.error('Erro ao ler utilizadores do AsyncStorage:', error);
      }
    };

    fetchUsers();
  }, []);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preenche todos os campos');
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert('Erro', 'Email inválido');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As passwords não coincidem');
      return;
    }
    if (users.some(u => u.email === email)) {
      Alert.alert('Erro', 'Email já registado');
      return;
    }
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

    const newUser: UserType = {
      id: newId,
      name: username,
      email,
      password,
      role: 'user', 
    };

    const updatedUsers = [...users, newUser];

    try {
      // Guardar lista de utilizadores atualizada
      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
      // Guardar ID do utilizador que acabou de registar
      await AsyncStorage.setItem('@loggedUserId', newId.toString());

      Alert.alert(
        'Sucesso',
        'Conta criada com sucesso!',
        [{ text: 'OK', onPress: () => router.replace('/home') }]
      );
    } catch (error) {
      console.error('Erro ao guardar utilizador no AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível criar a conta');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TextInput
        placeholder="Confirmar Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registar</Text>
      </Pressable>

      <Pressable onPress={() => router.back()}>
        <Text style={styles.link}>Já tenho conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#111',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#007AFF',
  },
});

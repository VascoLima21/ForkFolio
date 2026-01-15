import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      await AsyncStorage.setItem('@users', JSON.stringify(updatedUsers));
      await AsyncStorage.setItem('@loggedUserId', newId.toString());
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.replace('/home') },
      ]);
    } catch (error) {
      console.error('Erro ao guardar utilizador no AsyncStorage:', error);
      Alert.alert('Erro', 'Não foi possível criar a conta');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://exclusive-bronze-uastrkj592.edgeone.app/Group%2090.png' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://enthusiastic-apricot-l6hhrz9cvi.edgeone.app/Group%2089.png' }}
          style={styles.welcomeImage}
        />

        <Text style={styles.title}>Criar Conta</Text>

        {/* Username */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={22} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={22} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </Pressable>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color="#555" style={styles.icon} />
          <TextInput
            placeholder="Confirmar Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
          />
          <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#555"
            />
          </Pressable>
        </View>

        {/* Botão Registar pill */}
        <Pressable style={styles.enterButton} onPress={handleRegister}>
          <Text style={styles.enterText}>Registar</Text>
          <Ionicons name="arrow-forward" size={22} color="#000" />
        </Pressable>

        {/* Texto já tens conta? */}
        <Pressable style={styles.loginTextWrapper} onPress={() => router.replace('/auth/login')}>
          <Text style={styles.loginText}>Já tens conta?</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  welcomeImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 30,
  },

  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
    color: '#000',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#aaa',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  icon: { marginRight: 8 },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },

  enterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'flex-end',
    backgroundColor: '#BBCDB7',
    paddingHorizontal: 20,
    height: 50,
    borderRadius: 25, // pill
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginTop: 10,
  },

  enterText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },

  loginTextWrapper: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },

  loginText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

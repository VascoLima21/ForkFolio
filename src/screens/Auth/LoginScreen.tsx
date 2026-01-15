import { View, Text, TextInput, Pressable, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '@/data/users.json';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [step, setStep] = useState<'welcome' | 'login'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const user = usersData.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      Alert.alert('Erro', 'Email ou password incorretos');
      return;
    }

    try {
      await AsyncStorage.setItem('@loggedUserId', user.id.toString());
      router.replace('/home');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível guardar a sessão');
      console.error(error);
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://exclusive-bronze-uastrkj592.edgeone.app/Group%2090.png' }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>

        {/* Imagem central sempre visível e mesma altura */}
        <Image
          source={{ uri: 'https://enthusiastic-apricot-l6hhrz9cvi.edgeone.app/Group%2089.png' }}
          style={styles.welcomeImage}
        />

        {step === 'welcome' ? (
          <>
            <Pressable style={styles.button} onPress={() => setStep('login')}>
              <Text style={styles.buttonText}>Login</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={() => router.push('/auth/register')}>
              <Text style={styles.buttonText}>Signup</Text>
            </Pressable>
          </>
        ) : (
          <>
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

            {/* Botão Entrar pill */}
            <Pressable style={styles.enterButton} onPress={handleLogin}>
              <Text style={styles.enterText}>Entrar</Text>
              <Ionicons name="arrow-forward" size={22} color="#000" />
            </Pressable>

            {/* Texto “Não tens conta?” */}
            <Pressable style={styles.registerTextWrapper} onPress={() => router.replace('/auth/register')}>
              <Text style={styles.registerText}>Não tens conta?</Text>
            </Pressable>
          </>
        )}

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
    marginBottom: 50,
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

  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 14,
    borderRadius: 12,
    alignSelf: 'center',
    width: '70%',
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: '600',
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

  registerTextWrapper: {
    marginTop: 12,
    alignSelf: 'flex-end',
  },

  registerText: {
    color: '#007AFF',
    fontSize: 14,
  },
});

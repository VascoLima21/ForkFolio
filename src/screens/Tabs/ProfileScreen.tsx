import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usersData from '../../../data/users.json';
import { Ionicons } from '@expo/vector-icons';
import ConfirmModal from '../../components/ConfirmModal';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  useEffect(() => {
    const load = async () => {
      const id = await AsyncStorage.getItem('@loggedUserId');
      if (!id) return;
      const u = usersData.users.find(x => x.id === +id);
      if (u) {
        setUser(u);
        setName(u.name);
        setEmail(u.email);
        setPassword(u.password);
      }
    };
    load();
  }, []);

  const ask = (title: string, msg: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(msg);
    setConfirmAction(() => action);
    setConfirmVisible(true);
  };

  if (!user) return null;

  return (
    <View style={styles.page}>

      <Text style={styles.title}>O meu Perfil</Text>

      <Image
        source={{ uri: 'https://enthusiastic-apricot-l6hhrz9cvi.edgeone.app/Group%2089.png' }}
        style={styles.avatar}
      />

      <Text style={styles.label}>Nome</Text>
      <View style={styles.inputBox}>
        <Ionicons name="person-outline" size={20} />
        <TextInput value={name} onChangeText={setName} style={styles.input} />
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={styles.inputBox}>
        <Ionicons name="mail-outline" size={20} />
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputBox}>
        <Ionicons name="lock-closed-outline" size={20} />
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <Pressable onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} />
        </Pressable>
      </View>

      <Pressable
        style={[styles.button, styles.updateButton]}
        onPress={() => ask('Atualizar', 'Confirmar atualização?', async () => {
          const updated = usersData.users.map(u => u.id === user.id ? { ...u, name, email, password } : u);
          await AsyncStorage.setItem('@users', JSON.stringify(updated));
        })}
      >
        <Text style={styles.buttonText}>Atualizar</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.logoutButton]}
        onPress={() => ask('Sair', 'Tens a certeza que queres sair?', async () => {
          await AsyncStorage.removeItem('@loggedUserId');
          router.replace('/auth/login');
        })}
      >
        <Text style={styles.buttonText}>Sair da Conta</Text>
      </Pressable>

      <ConfirmModal
        visible={confirmVisible}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={() => { confirmAction(); setConfirmVisible(false); }}
        onCancel={() => setConfirmVisible(false)}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignSelf: 'center',
    marginBottom: 28,
  },

  label: {
    fontWeight: '600',
    marginBottom: 6,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    marginBottom: 22,  
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  input: {
    flex: 1,
    paddingVertical: 12,
  },

  button: {
    alignSelf: 'center',
    width: '60%',      
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },

  updateButton: {
    backgroundColor: '#2EC4C6',
    marginTop: 18,
    marginBottom: 18,  
  },

  logoutButton: {
    backgroundColor: '#FF6B6B',
  },

  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

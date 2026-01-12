import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import usersData from '../../../data/users.json';
import ConfirmModal from '../../components/ConfirmModal';

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const COLUMN_WIDTHS = {
  id: 25,
  username: 90,
  email: 140,
  role: 50,
  action: 60,
};

export default function ManageUsers() {
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState('');

  // Estado do modal de confirmação
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  useEffect(() => {
    setUsers(usersData.users);
  }, []);

  // Função para abrir confirmação
  const requestConfirmation = (user: UserType) => {
    setUserToDelete(user);
    setConfirmVisible(true);
  };

  const handleBan = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete.id));
      setConfirmVisible(false);
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerir Utilizadores</Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procurar..."
          value={search}
          onChangeText={setSearch}
        />
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
      </View>

      <Text style={styles.subtitle}>Lista de Utilizadores</Text>

      <ScrollView horizontal style={styles.tableContainer}>
        <View>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.id }]}>ID</Text>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.username }]}>Username</Text>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.email }]}>Email</Text>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.role }]}>Role</Text>
            <Text style={[styles.headerCell, { width: COLUMN_WIDTHS.action }]}>Action</Text>
          </View>

          {filteredUsers.map(u => (
            <View key={u.id} style={styles.row}>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.id }]}>{u.id}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.username }]}>{u.name}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.email }]}>{u.email}</Text>
              <Text style={[styles.cell, { width: COLUMN_WIDTHS.role }]}>{u.role}</Text>
              <View style={[styles.cell, { width: COLUMN_WIDTHS.action }]}>
                <Pressable style={styles.banButton} onPress={() => requestConfirmation(u)}>
                  <Text style={styles.banButtonText}>Ban</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ConfirmModal */}
      <ConfirmModal
        visible={confirmVisible}
        title="Confirmar Eliminação"
        message={`Tens a certeza que queres eliminar o utilizador "${userToDelete?.name}"?`}
        onConfirm={handleBan}
        onCancel={() => setConfirmVisible(false)}
        confirmText="Sim"
        cancelText="Não"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#BBCDB7' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40, 
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    height: 40,
  },
  searchInput: { flex: 1, height: '100%', fontSize: 14 },
  searchIcon: { marginLeft: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 }, 
  tableContainer: { flex: 1 },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerRow: { backgroundColor: '#2EC4C6' },
  headerCell: {
    padding: 6,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cell: {
    padding: 6,
    textAlign: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
    color: '#000',
  },
  banButton: {
    flex: 1,
    width: 45,
    backgroundColor: '#FF4C4C',
    borderRadius: 4,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  banButtonText: { color: '#fff', fontWeight: '600', fontSize: 12 },
});

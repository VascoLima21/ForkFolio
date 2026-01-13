// ../../src/screens/admin/CreateEvent.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import ConfirmModal from '../../components/ConfirmModal';
import recipesData from '../../../data/recipes.json';

type EventType = {
  eventId: number;
  title: string;
  description: string;
  date: string;
  recipeId: number;
  createdAt: string;
};

type AdminPanelProps = {
  events: EventType[];
  setEvents: React.Dispatch<React.SetStateAction<EventType[]>>;
};

const STORAGE_KEY = 'EVENTS_DATA';

export default function AdminPanel({ events, setEvents }: AdminPanelProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [selectedRecipeId, setSelectedRecipeId] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // ConfirmModal states
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  useEffect(() => {
    loadEvents();
  });

  const loadEvents = async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) setEvents(JSON.parse(data));
  };

  const saveEvents = async (updatedEvents: EventType[]) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
  };

  const openEditModal = (event: EventType) => {
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewDescription(event.description);
    const [day, month, year] = event.date.split('/');
    setNewDate(new Date(+year, +month - 1, +day));
    setSelectedRecipeId(event.recipeId);
    setModalVisible(true);
  };

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingEvent(null);
    setNewTitle('');
    setNewDescription('');
    setNewDate(new Date());
    setSelectedRecipeId(null);
  };

  const handleAddEvent = async () => {
    if (newTitle && newDescription && newDate && selectedRecipeId) {
      const newEvent: EventType = {
        eventId: events.length > 0 ? events[events.length - 1].eventId + 1 : 1,
        title: newTitle,
        description: newDescription,
        date: formatDate(newDate),
        recipeId: selectedRecipeId,
        createdAt: new Date().toISOString(),
      };

      const updated = [...events, newEvent];
      setEvents(updated);
      await saveEvents(updated);
      closeModal();
    }
  };

  const handleUpdateEvent = async () => {
    if (editingEvent && selectedRecipeId) {
      const updated = events.map(ev =>
        ev.eventId === editingEvent.eventId
          ? { ...ev, title: newTitle, description: newDescription, date: formatDate(newDate), recipeId: selectedRecipeId }
          : ev
      );
      setEvents(updated);
      await saveEvents(updated);
      closeModal();
    }
  };

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      const updated = events.filter(ev => ev.eventId !== editingEvent.eventId);
      setEvents(updated);
      await saveEvents(updated);
      closeModal();
    }
  };

  const requestConfirmation = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setTimeout(() => setConfirmVisible(true), 0);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false);
      return;
    }
    const currentDate = selectedDate || newDate;
    setShowDatePicker(Platform.OS === 'ios'); // mantém aberto no iOS, fecha no Android
    setNewDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.adminTitle}>Criar Reviews</Text>

      <View style={styles.box}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {events.map(event => (
            <View key={event.eventId} style={styles.eventCard}>
              <View style={styles.cardHeader}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Pressable style={styles.editButton} onPress={() => openEditModal(event)}>
                  <MaterialIcons name="edit" size={20} color="#000" />
                </Pressable>
              </View>
              <Text style={styles.description}>{event.description}</Text>
              <Text style={styles.date}>{event.date}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Pressable style={styles.createButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.createButtonText}>Criar Novo</Text>
      </Pressable>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</Text>

            <TextInput style={styles.input} placeholder="Título" value={newTitle} onChangeText={setNewTitle} />
            <TextInput style={styles.input} placeholder="Descrição" value={newDescription} onChangeText={setNewDescription} multiline />

            <Pressable style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text>{formatDate(newDate)}</Text>
            </Pressable>

            {showDatePicker && <DateTimePicker value={newDate} mode="date" display="calendar" onChange={onChangeDate} />}

            {/* Picker de receitas */}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedRecipeId}
                onValueChange={(itemValue) => setSelectedRecipeId(itemValue)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Seleciona uma receita" value={null} />
                {recipesData.recipes.map(recipe => (
                  <Picker.Item key={recipe.recipeId} label={recipe.name} value={recipe.recipeId} />
                ))}
              </Picker>
            </View>

            {editingEvent ? (
              <>
                <Pressable style={styles.addButton} onPress={() => requestConfirmation('Confirmar Atualização', 'Tens a certeza?', handleUpdateEvent)}>
                  <Text style={styles.addButtonText}>Atualizar</Text>
                </Pressable>

                <Pressable style={styles.deleteButton} onPress={() => requestConfirmation('Confirmar Eliminação', 'Tens a certeza?', handleDeleteEvent)}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.addButton} onPress={() => requestConfirmation('Confirmar Adição', 'Tens a certeza?', handleAddEvent)}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </Pressable>
            )}

            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={confirmVisible}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={() => {
          confirmAction();
          setConfirmVisible(false);
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  adminTitle: { fontSize: 32, fontWeight: 'bold', marginBottom: 16 },
  box: { width: '90%', height: 440, backgroundColor: '#F5F7F4', borderRadius: 20, padding: 14, marginBottom: 20 },
  eventCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  eventTitle: { fontSize: 18, fontWeight: 'bold' },
  description: { marginTop: 10, fontSize: 14 },
  date: { marginTop: 10, fontSize: 12, color: '#666' },
  createButton: { width: '60%', backgroundColor: '#2EC4C6', paddingVertical: 14, borderRadius: 20, alignItems: 'center', marginBottom: 10 },
  createButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  editButton: { padding: 6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { width: '85%', backgroundColor: '#fff', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, marginBottom: 12 , height: 60},
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, marginBottom: 12, justifyContent: 'center' , height: 60},
  pickerContainer: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, marginBottom: 12, height: 60, justifyContent: 'center', paddingHorizontal: 10 },
  addButton: { backgroundColor: '#2EC4C6', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  deleteButton: { backgroundColor: '#FF4C4C', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 10 },
  deleteButtonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { alignItems: 'center', paddingVertical: 8 },
});

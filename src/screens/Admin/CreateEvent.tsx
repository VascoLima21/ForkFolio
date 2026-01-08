// ../../src/screens/admin/CreateEvent.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, TextInput, Modal, StyleSheet, Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

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

export default function AdminPanel({ events, setEvents }: AdminPanelProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const openEditModal = (event: EventType) => {
    setEditingEvent(event);
    setNewTitle(event.title);
    setNewDescription(event.description);
    const [day, month, year] = event.date.split('/');
    setNewDate(new Date(+year, +month - 1, +day));
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
  };

  const handleAddEvent = () => {
    if (newTitle && newDescription && newDate) {
      const newEvent: EventType = {
        eventId: events.length > 0 ? events[events.length - 1].eventId + 1 : 1,
        title: newTitle,
        description: newDescription,
        date: formatDate(newDate),
        recipeId: Math.floor(Math.random() * 10000),
        createdAt: new Date().toISOString(),
      };
      setEvents([...events, newEvent]);
      closeModal();
    }
  };

  const handleUpdateEvent = () => {
    if (editingEvent && newTitle && newDescription && newDate) {
      setEvents(events.map(ev =>
        ev.eventId === editingEvent.eventId
          ? { ...ev, title: newTitle, description: newDescription, date: formatDate(newDate) }
          : ev
      ));
      closeModal();
    }
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter(ev => ev.eventId !== editingEvent.eventId));
      closeModal();
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || newDate;
    setShowDatePicker(Platform.OS === 'ios');
    setNewDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.adminTitle}>Criar Reviews</Text>

      <View style={styles.box}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {events.map((event) => (
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{editingEvent ? 'Editar Evento' : 'Novo Evento'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Título"
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />

            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(newDate)}</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display="calendar"
                onChange={onChangeDate}
              />
            )}

            {editingEvent ? (
              <>
                <Pressable style={styles.addButton} onPress={handleUpdateEvent}>
                  <Text style={styles.addButtonText}>Atualizar</Text>
                </Pressable>

                <Pressable style={styles.deleteButton} onPress={handleDeleteEvent}>
                  <Text style={styles.deleteButtonText}>Eliminar</Text>
                </Pressable>
              </>
            ) : (
              <Pressable style={styles.addButton} onPress={handleAddEvent}>
                <Text style={styles.addButtonText}>Adicionar</Text>
              </Pressable>
            )}

            <Pressable style={styles.cancelButton} onPress={closeModal}>
              <Text>Cancelar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, marginBottom: 12 },
  dateInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 12, padding: 10, marginBottom: 12, justifyContent: 'center' },
  addButton: { backgroundColor: '#2EC4C6', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: '600' },
  deleteButton: { backgroundColor: '#FF4C4C', paddingVertical: 12, borderRadius: 16, alignItems: 'center', marginBottom: 10 },
  deleteButtonText: { color: '#fff', fontWeight: '600' },
  cancelButton: { alignItems: 'center', paddingVertical: 8 },
});
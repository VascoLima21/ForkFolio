import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getEventById } from '@/src/utils/events';

export default function GenerateQRScreen() {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Event ID for generating the QR screen
  const eventId = 2;

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await getEventById(eventId);
        setEvent(eventData);
      } catch (error) {
        console.error("Erro ao carregar evento para QR:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [eventId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2f95dc" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.center}>
        <Text>Evento não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Código QR de Avaliação</Text>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={`eventId=${eventId}`}
          size={220}
          color="black"
          backgroundColor="white"
        />
      </View>

      <Text style={styles.eventLabel}>Evento:</Text>
      <Text style={styles.eventName}>{event.title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'georamaSemiBold',
    fontSize: 22,
    marginBottom: 30,
    color: '#333',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginBottom: 30,
  },
  eventLabel: {
    fontFamily: 'livvicRegular',
    fontSize: 14,
    color: '#888',
  },
  eventName: {
    fontFamily: 'georamaBold',
    fontSize: 18,
    color: '#1a1a1a',
    textAlign: 'center',
    marginTop: 4,
  },
  instructions: {
    fontFamily: 'livvicRegular',
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  }
});
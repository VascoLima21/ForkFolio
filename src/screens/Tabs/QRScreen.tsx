import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';

import { getItem } from '@/src/utils/storage';
import { hasUserReviewedEvent } from '@/src/utils/reviews';

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return null;

  if (!permission.granted) {
    requestPermission();
    return (
      <View style={styles.center}>
        <Text>A pedir permissão para usar a câmara...</Text>
      </View>
    );
  }

  /**
   * Handles all the logic for scanning the QR code
   */
  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const [key, value] = data.split('=');

    // Basic validation for the qr code
    if (key !== 'eventId' || !value) {
      console.warn('QR Code inválido:', data);
      setScanned(false);
      return;
    }

    const eventId = Number(value);
    if (Number.isNaN(eventId)) {
      setScanned(false);
      return;
    }

    try {
      const userId = await getItem('@loggedUserId');

      // Verifies if the user already reviewd that event
      const alreadyReviewed = await hasUserReviewedEvent(Number(userId), eventId);

      if (alreadyReviewed) {
        Alert.alert(
          "Já avaliado",
          "Já submeteste uma avaliação para este evento. Só é permitida uma avaliação por evento.",
          [
            {
              text: "OK",
              onPress: () => setScanned(false)
            }
          ]
        );
        return;
      }

      // If everything is ok navigate to the createReviewScreen
      router.push({
        pathname: '/reviews/createReview',
        params: { eventId },
      });

    } catch (error) {
      console.error("Erro ao processar QR:", error);
      Alert.alert("Erro", "Ocorreu um erro ao verificar a tua avaliação.");
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>Aponta para o QR Code do Evento</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
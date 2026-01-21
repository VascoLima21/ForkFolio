import { View, Text, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router, useFocusEffect } from 'expo-router';
import { useState, useCallback } from 'react';

import { getItem } from '@/src/utils/storage';
import { hasUserReviewedEvent } from '@/src/utils/reviews';

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  /**
   * This hook happens every time the screen gains focus(when entering or coming back)
   */
  useFocusEffect(
    useCallback(() => {
      setScanned(false); // Reset the state so you can scan again
    }, [])
  );

  if (!permission) return null;

  if (!permission.granted) {
    requestPermission();
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>A pedir permissão para usar a câmara...</Text>
      </View>
    );
  }

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const [key, value] = data.split('=');

    if (key !== 'eventId' || !value) {
      console.warn('QR Code inválido:', data);
      // Small delay as to not scan again if just scanned
      setTimeout(() => setScanned(false), 2000); 
      return;
    }

    const eventId = Number(value);
    if (Number.isNaN(eventId)) {
      setScanned(false);
      return;
    }

    try {
      const userId = await getItem('@loggedUserId');

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
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}/>

      <View style={styles.overlay}>
        <Text style={styles.text}>Aponta para o QR Code do Evento</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { fontFamily: 'georamaRegular', color: '#666' },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  text: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'georamaSemiBold' },
});
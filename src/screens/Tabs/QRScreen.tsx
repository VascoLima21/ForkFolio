import { View, Text, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';

export default function QRScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    requestPermission();
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;

    setScanned(true);

    /**
     * Expected QR format:
     * eventId=12
     */
    const [key, value] = data.split('=');   // To separate the data in key("event") and value(12) for example to send the event id as parameter

    if (key !== 'eventId' || !value) {     
      console.warn('Invalid QR code:', data);
      setScanned(false);
      return;
    }

    const eventId = Number(value);

    if (Number.isNaN(eventId)) {
      console.warn('Invalid eventId:', value);
      setScanned(false);
      return;
    }

    router.push({
      pathname: '/reviews/createReview',
      params: { eventId },
    });
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <View style={styles.overlay}>
        <Text style={styles.text}>Scan the QR code</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
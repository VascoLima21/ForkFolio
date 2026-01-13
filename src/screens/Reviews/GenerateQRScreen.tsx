import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GenerateQRScreen() {
  const eventId = 1;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Test QR</Text>

      <QRCode
        value={`eventId=${eventId}`}
        size={220}
      />
    </View>
  );
}
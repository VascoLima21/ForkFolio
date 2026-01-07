import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GenerateQRScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>QR de Teste</Text>
      <QRCode value="TEMPLATE_TEST_1" size={220} />
    </View>
  );
}

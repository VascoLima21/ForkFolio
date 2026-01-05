// src/screens/Tabs/ReviewsScreen.tsx
import { router } from 'expo-router';
import { Button, View, Text } from 'react-native';

export default function ReviewsScreen() {
  return (
    <View>
      <Text>Reviews Page</Text>
      <Button title="Make Review" onPress={() => router.push('/reviews/createReview')} />
    </View>
  );
}

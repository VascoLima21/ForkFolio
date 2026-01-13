import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CompleteReviewScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
      }}
    >
      <Text
        style={{
          fontFamily: 'georamaSemiBold',
          fontSize: 22,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        Review Complete 🎉
      </Text>

      <Text
        style={{
          fontFamily: 'livvicRegular',
          fontSize: 16,
          color: '#555',
          textAlign: 'center',
          marginBottom: 32,
        }}
      >
        Obrigado pelo teu feedback!  
        Podes ver a tua nova receita clicando no botão abaixo!
      </Text>

      <View style={{ width: '100%', gap: 12 }}>
        {/* Button to go to Recipes */}
        <Pressable
          onPress={() => router.replace('/(tabs)/recipes')}
          style={{
            backgroundColor: '#2f95dc',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontFamily: 'livvicRegular',
              fontSize: 16,
            }}
          >
            Ir Para Receitas
          </Text>
        </Pressable>

        {/* Button to go back to Home */}
        <Pressable
          onPress={() => router.replace('/(tabs)/home')}
          style={{
            backgroundColor: '#28a745',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontFamily: 'livvicRegular',
              fontSize: 16,
            }}
          >
            Voltar à Home
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
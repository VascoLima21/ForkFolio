import React from 'react';
import { View, Text, ScrollView, Image, Pressable, StyleSheet } from 'react-native';

interface IngredientType {
  name: string;
  imageUrl: string;
  displayQuantity: string;
}

interface IngredientsProps {
  name: string;
  description: string;
  portions: number;
  setPortions: (v: number) => void;
  ingredients: IngredientType[];
  onBack: () => void;
}

export default function Ingredients({ name, description, portions, setPortions, ingredients, onBack }: IngredientsProps) {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>{name}</Text>
      </View>
      <Text style={styles.description}>{description}</Text>

      {/* Porções */}
      <Text style={styles.portionsLabel}>Número de porções</Text>
      <View style={styles.portionsRow}>
        <Pressable onPress={() => setPortions(Math.max(1, portions - 1))} style={styles.portionCircleButton}>
          <Text style={styles.portionCircleText}>−</Text>
        </Pressable>
        <View style={styles.fakeInput}>
          <Text style={styles.portionsNumber}>{portions}</Text>
        </View>
        <Pressable onPress={() => setPortions(portions + 1)} style={styles.portionCircleButton}>
          <Text style={styles.portionCircleText}>+</Text>
        </Pressable>
      </View>

      {/* Ingredientes */}
      <Text style={styles.subtitle}>Ingredientes</Text>
      {ingredients.map((ing, index) => (
        <View
          key={index}
          style={[
            styles.ingredientRow,
            index === ingredients.length - 1 ? { marginBottom: 80 } : {} 
          ]}
        >
          <View style={styles.ingredientImageWrapper}>
            <Image source={{ uri: ing.imageUrl }} style={styles.ingredientImage} />
          </View>
          <Text style={styles.ingredientText}>
            {ing.name} — {ing.displayQuantity}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 50 },
  backButton: { marginRight: 10 },
  backArrow: { fontSize: 30, fontWeight: '600', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', flexShrink: 1 },
  description: { fontSize: 16, marginBottom: 22 },
  portionsLabel: { fontSize: 15, marginBottom: 8, textAlign: 'center' },
  portionsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  portionCircleButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', shadowColor: '#fff', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.3, shadowRadius: 2 },
  portionCircleText: { fontSize: 26, fontWeight: '600', color: '#fff' },
  fakeInput: { minWidth: 100, marginHorizontal: 14, paddingVertical: 10, borderRadius: 12, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2 },
  portionsNumber: { fontSize: 20, fontWeight: '600' },
  subtitle: { fontSize: 22, fontWeight: '600', marginBottom: 6 },
  ingredientRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  ingredientImageWrapper: { width: 52, height: 52, padding: 6, borderRadius: 10, borderWidth: 1, borderColor: '#000', marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  ingredientImage: { width: '100%', height: '100%', resizeMode: 'contain' },
  ingredientText: { fontSize: 17, flexShrink: 1 },
});

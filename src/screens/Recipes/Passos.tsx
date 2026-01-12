import React, { useState } from 'react';
import { ScrollView, Text, StyleSheet, View, Pressable, TouchableOpacity } from 'react-native';

interface StepsProps {
  steps: string[];
  onBack: () => void;
}

export default function Steps({ steps, onBack }: StepsProps) {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(Array(steps.length).fill(false));

  const toggleCheck = (index: number) => {
    const newChecked = [...checkedSteps];
    newChecked[index] = !newChecked[index];
    setCheckedSteps(newChecked);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 16, paddingBottom: 60 }}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Passo a Passo</Text>
      </View>

      {steps.map((step, index) => (
        <View
          key={index}
          style={[
            styles.stepContainer,
            index === steps.length - 1 ? { marginBottom: 80 } : {} 
          ]}
        >
          {/* Número do passo */}
          <Text style={styles.stepNumber}>Passo {index + 1}</Text>

          {/* Caixa branca com shadow */}
          <View style={styles.stepBox}>
            <Text style={styles.stepText} numberOfLines={0} ellipsizeMode="tail">
              {step}
            </Text>
            <TouchableOpacity onPress={() => toggleCheck(index)} style={styles.checkbox}>
              {checkedSteps[index] && <View style={styles.checked} />}
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, marginTop: 50 },
  backButton: { marginRight: 10 },
  backArrow: { fontSize: 30, fontWeight: '600', marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', flexShrink: 1 },

  stepContainer: { marginBottom: 20 },
  stepNumber: { fontSize: 18, fontWeight: '600', marginBottom: 8 },

  stepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    justifyContent: 'space-between',
  },

  stepText: { flex: 1, fontSize: 16, marginRight: 10 },

  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },

  checked: {
    width: 14,
    height: 14,
    backgroundColor: '#2EC4C6',
    borderRadius: 4,
  },
});

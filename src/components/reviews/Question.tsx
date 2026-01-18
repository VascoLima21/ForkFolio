import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { Question as QuestionType } from '@/src/types/questionTypes';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (id: number, value: any) => void;
}

/**
 * RENDERER COMPONENT: 
 * Dynamically renders different input UI based on the 'type' field from the JSON.
 */
export const Question = ({ question, value, onChange }: QuestionProps) => {
  return (
    <View>
      <Text style={styles.questionNumber}>Pergunta {question.id}</Text>
      <Text style={styles.questionTitle}>{question.title}</Text>

      {/* RATING TYPE: Discrete 1-5 selection boxes */}
      {question.type === "rating" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>{question.minLabel || "Pouco satisfeito"}</Text>
            <Text style={styles.labelText}>{question.maxLabel || "Muito satisfeito"}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
              <Pressable
                key={val}
                style={[styles.ratingBox, { backgroundColor: value === val ? '#2f95dc' : '#fff' }]}
                onPress={() => onChange(question.id, val)}
              >
                <Text style={[styles.ratingText, { color: value === val ? '#fff' : '#333' }]}>{val}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* SLIDER TYPE: Continuous or stepped range selection */}
      {question.type === "slider" && (
        <View style={{ marginTop: 12 }}>
          <View style={styles.labelRow}>
            <Text style={styles.labelText}>{question.minLabel || "Mín"}</Text>
            <Text style={styles.labelText}>{question.maxLabel || "Máx"}</Text>
          </View>
          <Slider
            minimumValue={question.minValue || 1}
            maximumValue={question.maxValue || 5}
            step={question.step || 1}
            value={value || 1}
            onValueChange={(v) => onChange(question.id, v)}
            minimumTrackTintColor="#2f95dc"
          />
        </View>
      )}

      {/* CHOICE TYPE: Multi-option selection (e.g., Yes/No) */}
      {question.type === "choice" && question.options && (
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {question.options.map((option) => {
            const isSelected = value === option;
            return (
              <Pressable
                key={option}
                style={[styles.choiceBox, { backgroundColor: isSelected ? '#2f95dc' : '#fff' }]}
                onPress={() => onChange(question.id, option)}
              >
                <Text style={[styles.choiceText, { color: isSelected ? '#fff' : '#333' }]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* TEXT TYPE: Multiline input for long-form comments */}
      {question.type === "text" && (
        <View style={{ marginTop: 12 }}>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Escreve aqui a tua opinião..."
            style={styles.textInput}
            value={value}
            onChangeText={(text) => onChange(question.id, text)}
            textAlignVertical="top"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  questionNumber: { fontFamily: 'georamaRegular', fontSize: 13, color: '#888', marginBottom: 4 },
  questionTitle: { fontFamily: 'georamaSemiBold', fontSize: 17, color: '#1a1a1a', lineHeight: 22 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  labelText: { fontFamily: 'livvicRegular', fontSize: 12, color: '#999' },
  ratingBox: { 
    width: 48, 
    height: 48, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  ratingText: { fontFamily: 'livvicBold', fontSize: 16 },
  choiceBox: { 
    paddingVertical: 12, 
    paddingHorizontal: 24, 
    marginRight: 12, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10 
  },
  choiceText: { fontFamily: 'livvicSemiBold', fontSize: 14 },
  textInput: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 10, 
    minHeight: 100, 
    fontFamily: 'livvicRegular', 
    padding: 12, 
    fontSize: 15,
    backgroundColor: '#fafafa'
  }
});
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import Slider from '@react-native-community/slider';
import { Question as QuestionType } from '@/src/types/questionTypes';

interface QuestionProps {
  question: QuestionType;
  value: any;
  onChange: (id: number, value: any) => void;
}

export const Question = ({ question, value, onChange }: QuestionProps) => {
  return (
    <View>
      {/* Question Number */}
      <Text style={styles.questionNumber}>Question {question.id}</Text>
      {/* Question Title */}
      <Text style={styles.questionTitle}>{question.title}</Text>

      {question.type === "rating" && (
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={styles.labelText}>{question.minLabel || "Not very satisfied"}</Text>
            <Text style={styles.labelText}>{question.maxLabel || "Very satisfied"}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {Array.from({ length: 5 }, (_, i) => i + 1).map((val) => (
              <Pressable
                key={val}
                style={[styles.ratingBox, { backgroundColor: value === val ? '#2f95dc' : '#fff' }]}
                onPress={() => onChange(question.id, val)}
              >
                <Text style={styles.ratingText}>{val}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {question.type === "slider" && (
        <View style={{ marginTop: 12 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={styles.labelText}>{question.minLabel || "Min"}</Text>
            <Text style={styles.labelText}>{question.maxLabel || "Max"}</Text>
          </View>
          <Slider
            minimumValue={question.minValue || 1}
            maximumValue={question.maxValue || 5}
            step={question.step || 1}
            value={value}
            onValueChange={(v) => onChange(question.id, v)}
          />
        </View>
      )}

      {question.type === "choice" && question.options && (
        <View style={{ flexDirection: 'row', marginTop: 12 }}>
          {question.options.map((option) => {
            const val = option === "Yes";
            return (
              <Pressable
                key={option}
                style={[styles.choiceBox, { backgroundColor: value === val ? '#2f95dc' : '#fff' }]}
                onPress={() => onChange(question.id, val)}
              >
                <Text style={styles.choiceText}>{option}</Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {question.type === "text" && (
        <View style={{ marginTop: 12 }}>
          <TextInput
            multiline
            style={styles.textInput}
            value={value}
            onChangeText={(text) => onChange(question.id, text)}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  questionNumber: { fontFamily: 'georamaRegular', fontSize: 14, color: '#666', marginBottom: 4 },
  questionTitle: { fontFamily: 'georamaSemiBold', fontSize: 16, marginBottom: 8 },
  ratingBox: { width: 50, height: 50, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  ratingText: { fontFamily: 'livvicBold', fontSize: 16 },
  labelText: { fontFamily: 'livvicRegular', fontSize: 12, color: '#666' },
  choiceBox: { padding: 12, marginRight: 10, borderWidth: 1, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  choiceText: { fontFamily: 'livvicRegular', fontSize: 14 },
  textInput: { borderWidth: 1, borderRadius: 8, height: 80, fontFamily: 'livvicRegular', padding: 8 }
});

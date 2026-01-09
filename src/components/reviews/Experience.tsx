import { View, Text, Pressable, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { QuestionHeader } from './QuestionHeader';

interface StepExperienceProps {
  experience: number;
  performance: number;
  onChange: (field: 'experience' | 'performance', value: number) => void;
}

export const Experience = ({ experience, performance, onChange }: StepExperienceProps) => {
  return (
    <View style={styles.container}>
      <QuestionHeader
        number={1}
        title="How would you describe your experience?"
      />

      {/* Options */}
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((value) => (
          <Pressable
            key={value}
            onPress={() => onChange('experience', value)}
            style={[
              styles.numberBox,
              { backgroundColor: experience === value ? '#2f95dc' : '#fff' },
            ]}
          >
            <Text
              style={[
                styles.numberText,
                { color: experience === value ? '#fff' : '#000' },
              ]}
            >
              {value}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Labels "Not very satisfied" and "Very satisfied" */}
      <View style={[styles.labelsRow, {marginBottom: 32}]}>
        <Text style={styles.labelText}>Not very satisfied</Text>
        <Text style={styles.labelText}>Very satisfied</Text>
      </View>

      {/* Próxima pergunta */}
      <QuestionHeader
        number={2}
        title="How would you classify the students' performance?"
      />

      <Slider
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={performance}
        onValueChange={(v) => onChange('performance', v)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    marginVertical: 12,
    justifyContent: 'space-between',
  },
  numberBox: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontFamily: 'livvicBold',
    fontSize: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 2,
  },
  labelText: {
    fontFamily: 'livvicRegular',
    fontSize: 12,
    color: '#666',
  },
});

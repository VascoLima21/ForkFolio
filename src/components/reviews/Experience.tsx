import { View, Text, Pressable } from 'react-native';
import Slider from '@react-native-community/slider';

interface StepExperienceProps {
  experience: number;
  performance: number;
  onChange: (field: 'experience' | 'performance', value: number) => void;
}

export const Experience = ({ experience, performance, onChange }: StepExperienceProps) => {
  return (
    <View>
      <Text>How would you describe your experience?</Text>

      <View style={{ flexDirection: 'row', marginVertical: 12 }}>
        {[1, 2, 3, 4, 5].map(value => (
          <Pressable
            key={value}
            onPress={() => onChange('experience', value)}
            style={{
              width: 40,
              height: 40,
              marginRight: 8,
              borderWidth: 1,
              backgroundColor: experience === value ? '#2f95dc' : '#fff',
            }}
          />
        ))}
      </View>

      <Text>How would you classify the students` performance?</Text>
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

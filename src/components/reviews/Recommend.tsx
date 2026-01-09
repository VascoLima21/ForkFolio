import { View, Text, Pressable, StyleSheet } from 'react-native';
import { QuestionHeader } from './QuestionHeader';

interface RecommendProps {
  recommend: boolean | null;
  onChange: (value: boolean) => void;
}

export const Recommend = ({ recommend, onChange }: RecommendProps) => {
  return (
    <View style={styles.container}>
      <QuestionHeader
        number={5}
        title="Would you recommend this service?"
      />

      <View style={styles.row}>
        {['Yes', 'No'].map((option) => {
          const value = option === 'Yes';
          return (
            <Pressable
              key={option}
              onPress={() => onChange(value)}
              style={[
                styles.button,
                { backgroundColor: recommend === value ? '#2f95dc' : '#fff' },
              ]}
            >
              <Text
                style={[
                  styles.buttonText,
                  { color: recommend === value ? '#fff' : '#000' },
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 16,
  },
  button: {
    width: 80,
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'livvicRegular',
    fontSize: 14,
    fontWeight: '500',
  },
});

import { View } from 'react-native';

interface ProgressBarProps {
  step: number;
}

export const ProgressBar = ({ step }: ProgressBarProps) => {
  return (
    <View style={{ height: 10, flexDirection: 'row', marginBottom: 20 }}>
      {[0, 1, 2].map(i => (
        <View
          key={i}
          style={{
            flex: 1,
            marginHorizontal: 2,
            backgroundColor: step >= i ? '#2f95dc' : '#ccc',
          }}
        />
      ))}
    </View>
  );
};
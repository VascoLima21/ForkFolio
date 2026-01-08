import { View, Text, TextInput } from 'react-native';

interface StepFeedbackProps {
    likedMost: string;
    improve: string;
    onChange: (field: 'likedMost' | 'improve', value: string) => void;
}

export const Feedback = ({ likedMost, improve, onChange }: StepFeedbackProps) => {
    return (
        <View>
            <Text>What did you like the most?</Text>
            <TextInput
                multiline
                style={{ borderWidth: 1, height: 80, marginVertical: 8 }}
                value={likedMost}
                onChangeText={text => onChange('likedMost', text)}
            />

            <Text>What could be improved?</Text>
            <TextInput
                multiline
                style={{ borderWidth: 1, height: 80, marginVertical: 8 }}
                value={improve}
                onChangeText={text => onChange('improve', text)}
            />
        </View>
    );
};
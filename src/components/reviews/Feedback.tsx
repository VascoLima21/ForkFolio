import { View, Text, TextInput } from 'react-native';

interface StepFeedbackProps {
    likedMost: string;
    improve: string;
    onChange: (field: 'likedMost' | 'improve', value: string) => void;
}

export const Feedback = ({ likedMost, improve, onChange }: StepFeedbackProps) => {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{fontFamily: 'georamaRegular'}}>What did you like the most?</Text>
            <TextInput
                multiline
                style={{ borderWidth: 1, height: 80, marginVertical: 8, fontFamily: "livvicRegular" }}
                value={likedMost}
                onChangeText={text => onChange('likedMost', text)}
            />

            <Text style={{fontFamily: 'georamaRegular'}}>What could be improved?</Text>
            <TextInput
                multiline
                style={{ borderWidth: 1, height: 80, marginVertical: 8, fontFamily: "livvicRegular" }}
                value={improve}
                onChangeText={text => onChange('improve', text)}
            />
        </View>
    );
};
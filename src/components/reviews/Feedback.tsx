import { View, TextInput } from 'react-native';
import { QuestionHeader } from './QuestionHeader';

interface StepFeedbackProps {
    likedMost: string;
    improve: string;
    onChange: (field: 'likedMost' | 'improve', value: string) => void;
}

export const Feedback = ({ likedMost, improve, onChange }: StepFeedbackProps) => {
    return (
        <View style={{ marginBottom: 16 }}>
            <QuestionHeader
                number={3}
                title="What did you like the most about the service?"
            />
            <TextInput
                multiline
                style={{ marginBottom: 32, borderWidth: 1, height: 80, marginVertical: 8, fontFamily: "livvicRegular" }}
                value={likedMost}
                onChangeText={text => onChange('likedMost', text)}
            />
            <QuestionHeader
                number={4}
                title="How would you describe your experience at the restaurant?"
            />
            <TextInput
                multiline
                style={{ borderWidth: 1, height: 80, marginVertical: 8, fontFamily: "livvicRegular" }}
                value={improve}
                onChangeText={text => onChange('improve', text)}
            />
        </View>
    );
};
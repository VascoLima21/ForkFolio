import { View, Pressable, Text } from 'react-native';

interface NavigationButtonsProps {
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: () => void;
}

export const NavigationButtons = ({ step, onNext, onPrev, onSubmit }: NavigationButtonsProps) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 'auto',
            }}
        >
            {step > 0 && (
                <Pressable onPress={onPrev}>
                    <Text>Previous</Text>
                </Pressable>
            )}

            {step < 2 ? (
                <Pressable onPress={onNext}>
                    <Text>Next</Text>
                </Pressable>
            ) : (
                <Pressable onPress={onSubmit}>
                    <Text>Submit</Text>
                </Pressable>
            )}
        </View>
    );
};
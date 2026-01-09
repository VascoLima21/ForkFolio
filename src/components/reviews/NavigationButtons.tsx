import { View, Pressable, Text, StyleSheet } from 'react-native';

interface NavigationButtonsProps {
    step: number;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: () => void;
}

export const NavigationButtons = ({
    step,
    onNext,
    onPrev,
    onSubmit,
}: NavigationButtonsProps) => {
    const isFirstStep = step === 0;
    const isLastStep = step === 2;

    const justifyContent = isFirstStep ? 'flex-end' : 'space-between';

    return (
        <View style={[styles.container, { justifyContent }]}>
            {/* Previous */}
            {step > 0 && (
                <Pressable style={styles.secondaryButton} onPress={onPrev}>
                    <Text style={styles.secondaryText}>Previous</Text>
                </Pressable>
            )}

            {/* Next / Submit */}
            {isLastStep ? (
                <Pressable
                    style={[styles.primaryButton, styles.submitButton]}
                    onPress={onSubmit}
                >
                    <Text style={styles.primaryText}>Submit</Text>
                </Pressable>
            ) : (
                <Pressable style={styles.primaryButton} onPress={onNext}>
                    <Text style={styles.primaryText}>Next</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    primaryButton: {
        minWidth: 120,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#2f95dc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    submitButton: {
        backgroundColor: '#28a745',
        minWidth: 140,
    },

    primaryText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: 'livvicRegular'
    },

    secondaryButton: {
        minWidth: 120,
        height: 44,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },

    secondaryText: {
        color: '#333',
        fontSize: 16,
        fontFamily: 'livvicRegular'
    },
}); 
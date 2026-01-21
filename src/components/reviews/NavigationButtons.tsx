import { View, Pressable, Text, StyleSheet } from 'react-native';

interface NavigationButtonsProps {
    step: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSubmit: () => void;
    onCancel: () => void;
}

export const NavigationButtons = ({ step, totalSteps, onNext, onPrev, onSubmit, onCancel }: NavigationButtonsProps) => {
    const isFirstStep = step === 0;
    const isLastStep = step === totalSteps;

    return (
        <View style={styles.container}>
            {/* Left side: Cancel button */}
            <Pressable style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </Pressable>

            {/* Right side: Navigation buttons */}
            <View style={styles.rightGroup}>
                {!isFirstStep && (
                    <Pressable style={styles.secondaryButton} onPress={onPrev}>
                        <Text style={styles.secondaryText}>Anterior</Text>
                    </Pressable>
                )}

                {isLastStep ? (
                    <Pressable style={[styles.primaryButton, styles.submitButton]} onPress={onSubmit}>
                        <Text style={styles.primaryText}>Submeter</Text>
                    </Pressable>
                ) : (
                    <Pressable style={styles.primaryButton} onPress={onNext}>
                        <Text style={styles.primaryText}>Seguinte</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between' // Separates cancel from navigation
    },
    rightGroup: { 
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 10 // Space between Anterior and Seguinte
    },
    primaryButton: { minWidth: 100, height: 44, borderRadius: 8, backgroundColor: '#2f95dc', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
    submitButton: { backgroundColor: '#28a745', minWidth: 110 },
    primaryText: { color: '#fff', fontWeight: '600', fontSize: 15, fontFamily: 'livvicRegular' },
    secondaryButton: { minWidth: 100, height: 44, borderRadius: 8, borderWidth: 1, borderColor: '#ccc', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 },
    secondaryText: { color: '#333', fontSize: 15, fontFamily: 'livvicRegular' },
    cancelButton: { paddingVertical: 10, paddingRight: 15 },
    cancelText: { color: '#ff4444', fontSize: 15, fontFamily: 'livvicRegular', fontWeight: '500' }
});
import { View, Text } from 'react-native';

interface QuestionHeaderProps {
    number: number;
    title?: string;
}

export const QuestionHeader = ({ number, title }: QuestionHeaderProps) => {
    return (
        <View style={{ marginBottom: 8 }}>
            <Text
                style={{
                    fontFamily: 'livvicBold',
                    fontSize: 12,
                    marginBottom: 2,
                }}
            >
                Question {number}
            </Text>

            {title && (
                <Text
                    style={{
                        fontFamily: 'georamaRegular',
                        fontSize: 16,
                    }}
                >
                    {title}
                </Text>
            )}
        </View>
    );
};
import { View, Text, Pressable } from 'react-native';

interface RecommendProps {
    recommend: boolean | null;
    onChange: (value: boolean) => void;
}

export const Recommend = ({ recommend, onChange }: RecommendProps) => {
    return (
        <View style={{ marginBottom: 16 }}>
            <Text style={{fontFamily: 'georamaRegular'}}>Would you recommend this service?</Text>

            <View style={{ flexDirection: 'row', marginTop: 12 }}>
                {['Yes', 'No'].map(option => {
                    const value = option === 'Yes';
                    return (
                        <Pressable
                            key={option}
                            onPress={() => onChange(value)}
                            style={{
                                padding: 12,
                                marginRight: 10,
                                borderWidth: 1,
                                backgroundColor: recommend === value ? '#2f95dc' : '#fff',
                            }}
                        >
                            <Text style={{fontFamily: 'livvicRegular'}}>{option}</Text>
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
};
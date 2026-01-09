import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ProgressBar } from '@/src/components/reviews/ProgressBar';
import { Experience } from '@/src/components/reviews/Experience';
import { Feedback } from '@/src/components/reviews/Feedback';
import { Recommend } from '@/src/components/reviews/Recommend';
import { NavigationButtons } from '@/src/components/reviews/NavigationButtons';

export default function CreateReviewScreen() {
    const [step, setStep] = useState(0);

    const [review, setReview] = useState({
        experience: 0,
        performance: 3,
        likedMost: '',
        improve: '',
        recommend: null as null | boolean,
    });

    const handleChange = (field: keyof typeof review, value: any) => {
        setReview({ ...review, [field]: value });
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 16, paddingTop: 12, paddingBottom: 8 }}
                keyboardShouldPersistTaps="handled"
            >
                {/* Progress Bar */}
                <ProgressBar step={step} />

                {/* Steps */}
                {step === 0 && (
                    <Experience
                        experience={review.experience}
                        performance={review.performance}
                        onChange={handleChange}
                    />
                )}

                {step === 1 && (
                    <Feedback
                        likedMost={review.likedMost}
                        improve={review.improve}
                        onChange={handleChange}
                    />
                )}

                {step === 2 && (
                    <Recommend
                        recommend={review.recommend}
                        onChange={(value) => handleChange('recommend', value)}
                    />
                )}
            </ScrollView>

            {/* Navegation Buttons */}
            <View style={{ padding: 20 }}>
                <NavigationButtons
                    step={step}
                    onPrev={() => setStep(step - 1)}
                    onNext={() => setStep(step + 1)}
                    onSubmit={() => console.log(review)}
                />
            </View>
        </SafeAreaView>
    );
}
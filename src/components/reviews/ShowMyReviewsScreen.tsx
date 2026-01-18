import { Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ReviewCard } from './ReviewCard';

export const ShowMyReviews = ({ data, loading }: { data: any[], loading: boolean }) => {
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color="#2f95dc" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `minhas-${item.id}`}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <ReviewCard
          userName={item.userName}
          eventName={item.eventName}
          comment={item.finalComment || "Submeteste esta avaliação sem comentário."}
          isAnonymous={item.isAnonymous}
          createdAt={item.createdAt}
        />
      )}
      ListEmptyComponent={<Text style={styles.empty}>Ainda não fizeste nenhuma review.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 40, color: '#999', fontFamily: 'livvicRegular' }
});
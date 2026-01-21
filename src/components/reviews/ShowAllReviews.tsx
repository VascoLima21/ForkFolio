import { Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { ReviewCard } from './ReviewCard';

interface Props {
  data: any[];
  loading: boolean;
  currentUserId: number | null;
  onDelete: (id: number) => void;
}

export const ShowAllReviews = ({ data, loading, currentUserId, onDelete }: Props) => {
  if (loading) return <ActivityIndicator style={{ marginTop: 20 }} color="#2f95dc" />;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => `explorar-${item.id}`}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <ReviewCard
          id={item.id}
          userName={item.userName}
          eventName={item.eventName}
          comment={item.finalComment}
          isAnonymous={item.isAnonymous}
          createdAt={item.createdAt}
          isMine={item.userId === currentUserId}
          onDelete={onDelete}
        />
      )}
      ListEmptyComponent={<Text style={styles.empty}>Ainda não há comentários partilhados.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 40, color: '#999', fontFamily: 'livvicRegular' }
});
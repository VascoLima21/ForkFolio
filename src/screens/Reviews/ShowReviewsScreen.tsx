import { View, StyleSheet, Pressable, Text, FlatList, useWindowDimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect, useRef } from 'react';
import { getReviews, removeReview } from '@/src/utils/reviews';
import { getUserById, getUserLogged } from '@/src/utils/users';
import { getEventById } from '@/src/utils/events';

import { ShowAllReviews } from '@/src/components/reviews/ShowAllReviews';
import { ShowMyReviews } from '@/src/components/reviews/ShowMyReviewsScreen';

export interface FullReview {
  id: number;
  userId: number;
  userName: string;
  eventName: string;
  finalComment: string;
  isAnonymous: boolean;
  createdAt: string;
  [key: string]: any; 
}

export default function ShowReviewsScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exploreData, setExploreData] = useState<FullReview[]>([]);
  const [myData, setMyData] = useState<FullReview[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const loggedId = Number(await getUserLogged());
      setCurrentUserId(loggedId);
      
      const reviewsData = await getReviews();

      const detailed = await Promise.all(reviewsData.map(async (r: any) => {
        const user = await getUserById(r.userId);
        const event = await getEventById(r.recipeId);
        
        return {
          ...r,
          userName: user?.name || "Aluno ESTH",
          eventName: event?.title || "Evento",
          finalComment: r.question6 || "" 
        };
      }));

      const sorted = detailed.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      const reviewsWithComments = sorted.filter(r => r.finalComment && r.finalComment.trim().length > 0);
      
      setExploreData(reviewsWithComments);
      setMyData(sorted.filter(r => r.userId === loggedId));
      
    } catch (e) {
      console.error("Error processing data:", e);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles deletion and refreshes the lists
   */
  const handleDelete = async (id: number) => {
    try {
      await removeReview(id);
      await loadAllData();
    } catch {
      Alert.alert("Erro", "Não foi possível eliminar a avaliação.");
    }
  };

  const handleTabPress = (index: number) => {
    setActiveTab(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  };

  const onMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveTab(index);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={styles.tabBar}>
        <Pressable style={styles.tab} onPress={() => handleTabPress(0)}>
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Reviews</Text>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => handleTabPress(1)}>
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>As Minhas Reviews</Text>
        </Pressable>
      </View>

      <FlatList
        ref={flatListRef}
        data={[0, 1]}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <View style={{ width }}>
            {item === 0 ? (
              <ShowAllReviews 
                data={exploreData} 
                loading={loading} 
                currentUserId={currentUserId} 
                onDelete={handleDelete} 
              />
            ) : (
              <ShowMyReviews 
                data={myData} 
                loading={loading} 
                currentUserId={currentUserId} 
                onDelete={handleDelete} 
              />
            )}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  tabText: { fontFamily: 'georamaRegular', color: '#888' },
  activeTabText: { color: '#2f95dc', fontFamily: 'georamaSemiBold', borderBottomWidth: 2, borderBottomColor: '#2f95dc' }
});
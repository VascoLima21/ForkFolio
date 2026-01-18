import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import { getReviews } from '@/src/utils/reviews';
import { getUserById } from '@/src/utils/users';
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

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const currentUserId = 1; // Replace with dynamic Auth ID
      const reviewsData = await getReviews();
      console.log(reviewsData);

      const detailed = await Promise.all(reviewsData.map(async (r: any) => {
        const user = await getUserById(r.userId);
        const event = await getEventById(r.recipeId);
        
        return {
          ...r,
          userName: user?.name || "Aluno ESTH",
          eventName: event?.title || "Evento",
          /**
           * STRICT MAPPING:
           * English Comment: Strictly maps 'finalComment' to 'question6'.
           * No fallbacks to question4 or others.
           */
          finalComment: r.question6 || "" 
        };
      }));

      // Sort by newest first
      const sorted = detailed.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      /**
       * STRICT FILTERING:
       * 1. Explore Tab: Only shows reviews where question6 (finalComment) is NOT empty.
       * 2. My Reviews Tab: Shows all reviews from the user, even empty ones.
       */
      const reviewsWithComments = sorted.filter(r => r.finalComment && r.finalComment.trim().length > 0);
      
      setExploreData(reviewsWithComments);
      setMyData(sorted.filter(r => r.userId === currentUserId));
      
    } catch (e) {
      console.error("Error processing data:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <View style={styles.tabBar}>
        <Pressable style={styles.tab} onPress={() => setActiveTab(0)}>
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Reviews</Text>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setActiveTab(1)}>
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>As Minhas Reviews</Text>
        </Pressable>
      </View>

      {activeTab === 0 ? (
        <ShowAllReviews data={exploreData} loading={loading} />
      ) : (
        <ShowMyReviews data={myData} loading={loading} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  tabText: { fontFamily: 'georamaRegular', color: '#888' },
  activeTabText: { color: '#2f95dc', fontFamily: 'georamaSemiBold', borderBottomWidth: 2, borderBottomColor: '#2f95dc' }
});
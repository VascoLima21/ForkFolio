import { View, StyleSheet, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';

import { getReviews } from '@/src/utils/reviews';
import { getUserById } from '@/src/utils/users';
import { getEventById } from '@/src/utils/events';

import { ShowAllReviews } from '@/src/components/reviews/ShowAllReviews';
import { ShowMyReviews } from '@/src/components/reviews/ShowMyReviewsScreen';

/**
 * Defines the structure for a review after joining data 
 * from Users and Events collections.
 */
export interface FullReview {
  id: number;
  userId: number;
  recipeId: number;
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
      // TODO: Replace with dynamic auth user ID
      const currentUserId = 1;
      const reviewsData = await getReviews();

      /**
       * JOINS: Enriches raw review data by fetching 
       * corresponding User and Event/Recipe details.
       */
      const detailed = await Promise.all(reviewsData.map(async (r: any) => {
        const user = await getUserById(r.userId);
        const event = await getEventById(r.recipeId);
        return {
          ...r,
          userName: user?.name || "Aluno",
          eventName: event?.title || "Evento",
          // Normalizes comment location (handles different JSON structures)
          finalComment: r.question4 || r.question6 || r.answers?.[6] || ""
        };
      }));

      // Sort by date: most recent reviews appear first
      const sorted = detailed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      /** * DATA SEGREGATION: 
       * - Explore: Only shows reviews with actual text content.
       * - MyReviews: Shows all reviews created by the logged-in user.
       */
      setExploreData(sorted.filter(r => r.finalComment.trim().length > 0));
      setMyData(sorted.filter(r => r.userId === currentUserId));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* Tab Header Navigation */}
      <View style={styles.tabBar}>
        <Pressable style={styles.tab} onPress={() => setActiveTab(0)}>
          <Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}>Reviews</Text>
        </Pressable>
        <Pressable style={styles.tab} onPress={() => setActiveTab(1)}>
          <Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}>As Minhas Reviews</Text>
        </Pressable>
      </View>

      {/* CONDITIONAL RENDERING: Switches between the global feed and user history */}
      {activeTab === 0 ? (
        <ShowAllReviews data={exploreData} loading={loading} />
      ) : (
        <ShowMyReviews data={myData} loading={loading} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  tab: { flex: 1, padding: 15, alignItems: 'center' },
  tabText: { fontFamily: 'georamaRegular', color: '#888' },
  // Active state highlighting using primary color and border
  activeTabText: { 
    color: '#2f95dc', 
    fontFamily: 'georamaSemiBold', 
    borderBottomWidth: 2, 
    borderBottomColor: '#2f95dc' 
  }
});
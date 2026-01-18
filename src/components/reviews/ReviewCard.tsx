import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewCardProps {
  userName: string;
  eventName: string;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
}

export const ReviewCard = ({ userName, eventName, comment, isAnonymous, createdAt }: ReviewCardProps) => {
  // If is anonymous ignore username and set as anonymous
  const displayName = isAnonymous ? "Anónimo" : userName;
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {/* Uses default image if anonymous */}
        <View style={[styles.avatar, isAnonymous && styles.anonymousAvatar]}>
          <Ionicons 
            name={isAnonymous ? "person-circle-outline" : "person"} 
            size={30} 
            color={isAnonymous ? "#999" : "#2f95dc"} 
          />
        </View>

        <View style={styles.info}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.eventTitle}>{eventName}</Text>
        </View>
        
        <Ionicons name="flag-outline" size={18} color="#ccc" />
      </View>

      <Text style={styles.comment}>{comment}</Text>

      <View style={styles.footer}>
        <Text style={styles.date}>
          {new Date(createdAt).toLocaleDateString('pt-PT')}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  avatar: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  anonymousAvatar: { backgroundColor: '#eee' },
  info: { flex: 1 },
  userName: { fontFamily: 'georamaSemiBold', fontSize: 16, color: '#333' },
  eventTitle: { fontFamily: 'livvicRegular', fontSize: 13, color: '#666' },
  comment: { fontFamily: 'livvicRegular', fontSize: 15, color: '#444', lineHeight: 20 },
  footer: { marginTop: 12, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f0f0f0', alignItems: 'flex-end' },
  date: { fontSize: 11, color: '#bbb' }
});
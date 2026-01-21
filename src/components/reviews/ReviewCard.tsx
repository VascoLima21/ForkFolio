import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReviewCardProps {
  id: number; // Added to identify the review for deletion
  userName: string;
  eventName: string;
  comment: string;
  isAnonymous: boolean;
  createdAt: string;
  isMine: boolean; // Flag to check if current user owns this review
  onDelete?: (id: number) => void; // Callback after successful deletion
}

export const ReviewCard = ({ id, userName, eventName, comment, isAnonymous, createdAt, isMine, onDelete }: ReviewCardProps) => {
  // If is anonymous ignore username and set as anonymous
  const displayName = isAnonymous ? "Anónimo" : userName;

  /**
   * Confirmation popup before deletion
   */
  const handleDeletePress = () => {
    Alert.alert(
      "Eliminar Avaliação",
      "Tens a certeza que pretendes eliminar esta avaliação permanentemente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive", 
          onPress: () => onDelete && onDelete(id) 
        }
      ]
    );
  };
  
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
        
        {isMine ? (
          <Pressable onPress={handleDeletePress}>
            <Ionicons name="trash-outline" size={20} color="#ff4444" />
          </Pressable>
        ) : (
          <Ionicons name="flag-outline" size={18} color="#ccc" />
        )}
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
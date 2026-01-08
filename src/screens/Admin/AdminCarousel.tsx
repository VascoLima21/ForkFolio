// src/screens/admin/AdminCarousel.tsx
import React, { useState, useRef } from 'react';
import { View, StyleSheet, Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import CreateEvent from './CreateEvent';
import ManageUsers from './UsersManagement';
import ManageReviews from './ManageReviews';

const { width } = Dimensions.get('window');

export default function AdminCarousel({ events, setEvents }: any) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides = [
    <CreateEvent events={events} setEvents={setEvents} key="events" />,
    <ManageUsers key="users" />,
    <ManageReviews key="reviews" />,
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={[styles.container]}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <View style={[styles.slide, { width }]}>{item}</View>}
      />

      {/* Indicadores */}
      <View style={styles.indicatorContainer}>
        {slides.map((_, i) => (
          <View key={i} style={[styles.dot, activeIndex === i ? styles.activeDot : {}]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBCDB7', // fundo verde do admin
  },
  slide: {
    flex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#666',
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: '#2EC4C6',
  },
});

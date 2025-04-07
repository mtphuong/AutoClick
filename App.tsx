import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, Alert, AppState
} from 'react-native';
import Draggable from 'react-native-draggable';
import dayjs from 'dayjs';

export default function App() {
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [second, setSecond] = useState('');
  const [ms, setMs] = useState('');
  const [targetTime, setTargetTime] = useState<number | null>(null);
  const [started, setStarted] = useState(false);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    let interval:any;

    if (started && targetTime) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now >= targetTime) {
          clearInterval(interval);
          handleAutoClick();
        }
      }, 1);
    }

    return () => clearInterval(interval);
  }, [started, targetTime]);

  const handleStart = () => {
    const now = dayjs();
    const fullTime = now.set('hour', parseInt(hour || '0'))
                        .set('minute', parseInt(minute || '0'))
                        .set('second', parseInt(second || '0'))
                        .set('millisecond', parseInt(ms || '0'));

    const diff = fullTime.valueOf() - now.valueOf();

    if (diff <= 0) {
      Alert.alert('Thời gian không hợp lệ', 'Giờ đã qua hoặc không đúng.');
      return;
    }

    setTargetTime(fullTime.valueOf());
    setStarted(true);
  };

  const handleAutoClick = () => {
    Alert.alert("Auto Click!", `Clicked at: ${new Date().toLocaleTimeString()}.${new Date().getMilliseconds()}`);
    // Nếu là app khác, cần gọi AccessibilityService để thực sự click
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nhập thời gian:</Text>
      <View style={styles.row}>
        <TextInput style={styles.input} placeholder="Giờ" keyboardType="numeric" onChangeText={setHour} />
        <TextInput style={styles.input} placeholder="Phút" keyboardType="numeric" onChangeText={setMinute} />
        <TextInput style={styles.input} placeholder="Giây" keyboardType="numeric" onChangeText={setSecond} />
        <TextInput style={styles.input} placeholder="ms" keyboardType="numeric" onChangeText={setMs} />
      </View>
      <Text style={styles.startBtn} onPress={handleStart}>Bắt đầu đếm giờ</Text>

      {started && (
        <Draggable
          renderSize={60}
          renderColor='orange'
          renderText='CLICK'
          isCircle
          onShortPressRelease={handleAutoClick}
          x={150}
          y={400}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', backgroundColor: '#fff' },
  title: { fontSize: 24, marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: 70, borderRadius: 8, textAlign: 'center' },
  startBtn: { marginTop: 20, backgroundColor: 'green', color: 'white', padding: 15, textAlign: 'center', borderRadius: 10 }
});
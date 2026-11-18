import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type WalkTimerProps = {
  onSalvar: (seconds: number) => void;
};

export function WalkTimer({ onSalvar }: WalkTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    const intervalId = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(intervalId);
  }, [isRunning]);

  function reset() {
    setIsRunning(false);
    setSeconds(0);
  }

  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{String(minutes).padStart(2, '0')}:{String(remaining).padStart(2, '0')}</Text>
      <View style={styles.actions}>
        <Pressable onPress={() => setIsRunning((running) => !running)} style={styles.button}>
          <Text style={styles.buttonText}>{isRunning ? 'Pausar' : 'Iniciar'}</Text>
        </Pressable>
        <Pressable onPress={() => onSalvar(seconds)} disabled={seconds === 0} style={styles.button}>
          <Text style={styles.buttonText}>Salvar sessão</Text>
        </Pressable>
        <Pressable onPress={reset} style={styles.button}><Text style={styles.buttonText}>Zerar</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: 12, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF' },
  time: { fontSize: 36, fontWeight: '700', color: '#263238' },
  actions: { flexDirection: 'row', gap: 8 },
  button: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, backgroundColor: '#FF8C42' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});

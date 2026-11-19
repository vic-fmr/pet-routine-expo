import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';
import { alvoToque, espaco, raio } from '../theme';

type WalkTimerProps = {
  onSalvar: (seconds: number) => void;
};

export function WalkTimer({ onSalvar }: WalkTimerProps) {
  const { colors } = useTheme();
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
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.time, { color: colors.text }]}>{String(minutes).padStart(2, '0')}:{String(remaining).padStart(2, '0')}</Text>
      <View style={styles.actions}>
        <Pressable onPress={() => setIsRunning((running) => !running)} accessibilityRole="button" accessibilityLabel={isRunning ? 'Pausar cronometro' : 'Iniciar cronometro'} style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}>
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>{isRunning ? 'Pausar' : 'Iniciar'}</Text>
        </Pressable>
        <Pressable onPress={() => onSalvar(seconds)} disabled={seconds === 0} accessibilityRole="button" accessibilityLabel="Salvar sessao de passeio" style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: seconds === 0 ? 0.45 : pressed ? 0.8 : 1 }]}>
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>Salvar sessão</Text>
        </Pressable>
        <Pressable onPress={reset} accessibilityRole="button" accessibilityLabel="Zerar cronometro" style={({ pressed }) => [styles.button, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}><Text style={[styles.buttonText, { color: colors.primaryText }]}>Zerar</Text></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', gap: espaco.smd, padding: espaco.md, borderRadius: raio.grande },
  time: { fontSize: 36, fontWeight: '700', color: '#263238' },
  actions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: espaco.sm },
  button: { minHeight: alvoToque, justifyContent: 'center', paddingHorizontal: espaco.smd, paddingVertical: espaco.sm, borderRadius: raio.medio },
  buttonText: { fontWeight: '700' },
});

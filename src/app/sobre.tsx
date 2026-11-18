import { ScrollView, StyleSheet, Text, View } from 'react-native';

export default function SobreScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pet Routine Expo</Text>
      <Text style={styles.text}>Versão 1.0.0</Text>
      <View style={styles.card}>
        <Text style={styles.heading}>Equipe</Text>
        <Text style={styles.text}>Victor — Desenvolvimento Mobile</Text>
        <Text style={styles.text}>Equipe — Gestão de rotina pet</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.heading}>Arquitetura</Text>
        <Text style={styles.text}>Expo Router, React Native, Zustand, API REST com JWT, SQLite local, AsyncStorage, Expo Notifications e expo-updates.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FEF7EE' },
  content: { padding: 24, gap: 16 },
  title: { fontSize: 30, fontWeight: '800', color: '#263238' },
  heading: { fontSize: 20, fontWeight: '800', color: '#263238' },
  text: { color: '#607D8B', lineHeight: 22 },
  card: { gap: 8, padding: 16, borderRadius: 16, backgroundColor: '#FFFFFF', boxShadow: '0 4px 12px rgba(38,50,56,0.08)' },
});

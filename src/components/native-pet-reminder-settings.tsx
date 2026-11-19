import { useState } from 'react';
import { Host, Picker, Switch } from '@expo/ui';
import Constants from 'expo-constants';
import { Pressable, Switch as NativeSwitch, Text, View } from 'react-native';
import { useTheme } from '../context/theme-context';

type MetaPasseio = 'Curto' | 'Moderado' | 'Longo';
const METAS: MetaPasseio[] = ['Curto', 'Moderado', 'Longo'];

export function NativePetReminderSettings() {
  const [enabled, setEnabled] = useState(true);
  const [meta, setMeta] = useState<MetaPasseio>('Moderado');
  const { colors } = useTheme();

  if (Constants.appOwnership === 'expo') {
    return (
      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text style={{ flex: 1, fontWeight: '700', color: colors.text }}>Lembretes diários de passeio</Text>
          <NativeSwitch value={enabled} onValueChange={setEnabled} />
        </View>
        <Text style={{ fontWeight: '700', color: colors.text }}>Meta diária: {meta}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {METAS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setMeta(item)}
              style={{ flex: 1, padding: 10, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: meta === item ? colors.primary : colors.surfaceMuted }}
            >
              <Text style={{ color: meta === item ? colors.primaryText : colors.text, fontWeight: '700' }}>{item}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Host matchContents>
        <Switch value={enabled} onValueChange={setEnabled} label="Lembretes diários de passeio" />
      </Host>
      <Text style={{ fontWeight: '700', color: colors.text }}>Meta diária: {meta}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {METAS.map((item) => (
          <Pressable
            key={item}
            onPress={() => setMeta(item)}
            style={{ flex: 1, padding: 10, minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 10, backgroundColor: meta === item ? colors.primary : colors.surfaceMuted }}
          >
            <Text style={{ color: meta === item ? colors.primaryText : colors.text, fontWeight: '700' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <Host matchContents>
        <Picker selectedValue={meta} onValueChange={(value) => {
          // The native picker returns a string; constrain it to the declared route.
          if (value === 'Curto' || value === 'Moderado' || value === 'Longo') setMeta(value);
        }} appearance="menu">
          <Picker.Item label="Curto" value="Curto" />
          <Picker.Item label="Moderado" value="Moderado" />
          <Picker.Item label="Longo" value="Longo" />
        </Picker>
      </Host>
    </View>
  );
}

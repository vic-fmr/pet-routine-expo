import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function agendarLembretePasseio(petId: string, nomePet: string) {
  const permission = await Notifications.requestPermissionsAsync();
  if (!permission.granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Hora do passeio de ${nomePet}! 🐾`,
      body: 'Toque para abrir os detalhes e registrar o passeio.',
      data: { petId },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
    },
  });
  return true;
}

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Voice from '@react-native-voice/voice';

export default function App() {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Запрос разрешений на использование микрофона
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Доступ к микрофону',
          message: 'Приложение требует доступ к микрофону для работы голосового ввода.',
          buttonNeutral: 'Спросить позже',
          buttonNegative: 'Отмена',
          buttonPositive: 'ОК',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // Начало записи голоса
  const startListening = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      alert('Разрешение на использование микрофона не предоставлено.');
      return;
    }

    try {
      setIsListening(true);
      Voice.start('en-US'); // Используйте 'ru-RU' для русского языка
    } catch (error) {
      console.error('Ошибка при запуске записи:', error);
    }
  };

  // Остановка записи голоса
  const stopListening = () => {
    try {
      Voice.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Ошибка при остановке записи:', error);
    }
  };

  // Обработка результата распознавания речи
  Voice.onSpeechResults = (event) => {
    if (event.value && event.value.length > 0) {
      setRecognizedText(event.value[0]);
    }
  };

  // Очистка при размонтировании компонента
  React.useEffect(() => {
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Голосовой помощник</Text>

      <View style={styles.textContainer}>
        <Text style={styles.recognizedText}>
          {recognizedText || 'Скажите что-нибудь...'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isListening ? styles.buttonActive : styles.buttonInactive]}
        onPress={isListening ? stopListening : startListening}
      >
        <Text style={styles.buttonText}>
          {isListening ? 'Остановить' : 'Говорить'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  textContainer: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    width: '90%',
  },
  recognizedText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
  },
  buttonActive: {
    backgroundColor: '#ff6b6b',
  },
  buttonInactive: {
    backgroundColor: '#4caf50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
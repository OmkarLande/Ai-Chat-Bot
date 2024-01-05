import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import FaceData from '../services/FaceData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackPramList } from '../App';

type HomeProps = NativeStackScreenProps<RootStackPramList, 'HomeScreen'>;

export default function HomeScreen({ navigation }: HomeProps): JSX.Element {
  const [chatFaceData, setChatFaceData] = useState<Bot[]>([]);
  const [selectedChatFace, setSelectedChatFace] = useState<Bot | undefined>(
    undefined,
  );

  useEffect(() => {
    setChatFaceData(FaceData);
    checkFaceId();
  }, []);

  const checkFaceId = async (): Promise<void> => {
    const id = await AsyncStorage.getItem('chatFaceId');
    id
      ? setSelectedChatFace(FaceData[Number(id)])
      : setSelectedChatFace(FaceData[0]);
  };

  const onChatFacePress = async (id: number): Promise<void> => {
    setSelectedChatFace(FaceData[id - 1]);
    await AsyncStorage.setItem('chatFaceId', (id - 1).toString());
  };

  return (
    <View style={{ alignItems: 'center', paddingTop: 90 }}>
      <Text style={[{ color: selectedChatFace?.primary }, { fontSize: 30 }]}>
        Hello,
      </Text>
      <Text
        style={[
          { color: selectedChatFace?.primary },
          { fontSize: 30, fontWeight: 'bold' },
        ]}>
        I am {selectedChatFace?.name}
      </Text>
      <Image
        source={{
          uri: selectedChatFace?.image,
        }}
        style={{ height: 150, width: 150, marginTop: 20 }}
      />
      <Text style={{ marginTop: 30, fontSize: 25 }}>How Can I help you?</Text>

      <View
        style={{
          marginTop: 20,
          backgroundColor: '#F5F5F5',
          alignItems: 'center',
          height: 110,
          padding: 10,
          borderRadius: 10,
        }}>
        <FlatList
          data={chatFaceData}
          horizontal={true}
          renderItem={({ item }) =>
            Number(item.id) !== Number(selectedChatFace?.id) ? (
              <TouchableOpacity
                style={{ margin: 15 }}
                onPress={() => onChatFacePress(Number(item.id))}>
                <Image
                  source={{ uri: item.image }}
                  style={{ width: 40, height: 40 }}
                />
              </TouchableOpacity>
            ) : null
          }
        />

        <Text style={{ marginTop: 5, fontSize: 17, color: '#B0B0B0' }}>
          Choose Your Fav ChatBuddy
        </Text>
      </View>

      <TouchableOpacity
        style={[
          { backgroundColor: selectedChatFace?.primary },
          {
            marginTop: 40,
            padding: 17,
            width: Dimensions.get('screen').width * 0.6,
            borderRadius: 100,
            alignItems: 'center',
          },
        ]}
        onPress={() => navigation.navigate('ChatScreen')}>
        <Text style={{ fontSize: 16, color: '#fff' }}>Let's Chat</Text>
      </TouchableOpacity>
    </View>
  );
}

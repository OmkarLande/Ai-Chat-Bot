import { Text, View } from 'react-native'
import React from 'react'
import { Bubble, GiftedChat, GiftedChatProps, IMessage, InputToolbar, Send } from 'react-native-gifted-chat'
import { useState } from 'react';
import { useEffect } from 'react';
import { useCallback } from 'react';
import GlobalApi from '../services/Api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import FaceData from '../services/FaceData';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

let CHAT_BOT_FACE = 'https://res.cloudinary.com/dknvsbuyy/image/upload/v1685678135/chat_1_c7eda483e3.png'
export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatFaceColor, setChatFaceColor] = useState<string | undefined>();

  useEffect(() => {
    checkFaceId();
  }, [])

  const checkFaceId = async (): Promise<void> => {
    const id = await AsyncStorage.getItem('chatFaceId');
    CHAT_BOT_FACE = id ? FaceData[Number(id)].image : FaceData[0].image;
    setChatFaceColor(FaceData[Number(id)].primary);
    setMessages([
      {
        _id: 1,
        text: 'Hello, I am ' + FaceData[Number(id)].name + ', How Can I help you?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: CHAT_BOT_FACE,

        },

      },
    ])
  }

  const onSend = useCallback((messages : IMessage[] = []): void => {

    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    if (messages[0].text) {
      getBardResp(messages[0].text);
    }
  }, [])

  const getBardResp = (userMsg: string): void => {
    setLoading(true);
  
    GlobalApi.getBardApi(userMsg)
      .then((resp) => {
        // console.log('API Response:', resp);
  
        setLoading(false);
  
        const content = resp?.data?.story;
  
        if (content !== undefined) {
          const chatAIResp: IMessage = {
            _id: Math.random() * (9999999 - 1),
            text: content,
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: CHAT_BOT_FACE,
            },
          };
  
          setMessages((previousMessages) => GiftedChat.append(previousMessages, [chatAIResp]));
        } else {
          const chatAIResp: IMessage = {
            _id: Math.random() * (9999999 - 1),
            text: "Sorry, I can't help with that.",
            createdAt: new Date(),
            user: {
              _id: 2,
              name: 'React Native',
              avatar: CHAT_BOT_FACE,
            },
          };
  
          setMessages((previousMessages) => GiftedChat.append(previousMessages, [chatAIResp]));
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
  
        // Handle error
        setLoading(false);
      });
  };
  
   

  const renderBubble = (props : any): JSX.Element => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#671ddf',

          }, left: {

          }

        }}
        textStyle={{
          right: {
            // fontSize:20,
            padding: 2
          },
          left: {
            color: '#671ddf',
            // fontSize:20,
            padding: 2
          }
        }}
      />
    )
  }

  const renderInputToolbar = (props:any) => {
    //Add the extra styles via containerStyle
    return <InputToolbar {...props}
      containerStyle={{
        padding: 3,

        backgroundColor: '#671ddf',
        color: '#fff',
      }}

      textInputStyle={{ color: "#fff" }}
    />
  }

  const renderSend = (props: GiftedChatProps) => {
    return (
      <Send
        {...props}
      >
        <View style={{ marginRight: 10, marginBottom: 12 }}>
          <Text style={{color: 'white' }}>Send</Text>
          {/* <FontAwesomeIcon icon={faPaperPlane} size={24} color='white' /> */}
        </View>
      </Send>
    );
  }
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>

      <GiftedChat 
        messages={messages}
        isTyping={loading}
        onSend={messages  => onSend(messages)}
        user={{
          _id: 1,

        }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
      />


    </View>
  )
}
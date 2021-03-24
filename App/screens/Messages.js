import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {
  createMessage,
  currentUser,
  listenToMessages,
  markThreadLastRead,
} from '../firebase';

export default ({ route }) => {
  const [messages, setMessages] = useState([]);
  const thread = route?.params?.thread || {};

  useEffect(() => {
    const unsubscribe = listenToMessages({ threadID: thread._id }).onSnapshot(
      (querySnapshot) => {
        const formattedMessages = querySnapshot.docs.map((doc) => {
          return {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            user: {},
            ...doc.data(),
          };
        });

        setMessages(formattedMessages);
      },
    );

    return () => {
      unsubscribe();
      markThreadLastRead({ threadID: thread._id });
    };
  }, []);

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(message) => {
          setMessages(GiftedChat.append(messages, message));
          const text = message[0].text;
          createMessage({ threadID: thread._id, text });
        }}
        user={{ _id: currentUser.uid }}
      />
    </View>
  );
};

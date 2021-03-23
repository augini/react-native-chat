import React, { useState } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default ({ route }) => {
  const [messages, setMessages] = useState([]);
  const thread = route?.params?.thread || {};
  const user = auth().currentUser.toJSON();

  return (
    <View style={{ backgroundColor: '#fff', flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(message) => {
          setMessages(GiftedChat.append(messages, message));
          const text = message[0].text;

          firestore()
            .collection('MESSAGE_THREADS')
            .doc(thread._id)
            .set(
              { latestMessage: { text, createdAt: new Date().getTime() } },
              { merge: true },
            )
            .then(() => {
              firestore()
                .collection('MESSAGE_THREADS')
                .doc(thread._id)
                .collection('MESSAGES')
                .add({
                  text,
                  createdAt: new Date().getTime(),
                  user: { _id: user.uid, displayName: user.displayName },
                });
            });
        }}
        user={{ _id: user.uid }}
      />
    </View>
  );
};

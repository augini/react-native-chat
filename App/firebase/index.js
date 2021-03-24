import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} from 'unique-names-generator';

export const currentUser = auth().currentUser.toJSON();

export const craeteNewThread = ({ threadName }) => {
  return firestore()
    .collection('MESSAGE_THREADS')
    .add({
      name: threadName,
      latestMessage: {
        text: `${threadName} has been created`,
        createdAt: new Date().getTime(),
      },
    });
};

export const listenToThreads = () => {
  return firestore()
    .collection('MESSAGE_THREADS')
    .orderBy('latestMessage.createdAt', 'desc');
};

export const listenToMessages = ({ threadID }) => {
  return firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadID)
    .collection('MESSAGES')
    .orderBy('createdAt', 'desc');
};

export const createMessage = ({ threadID, text }) => {
  return firestore()
    .collection('MESSAGE_THREADS')
    .doc(threadID)
    .set(
      { latestMessage: { text, createdAt: new Date().getTime() } },
      { merge: true },
    )
    .then(() => {
      return firestore()
        .collection('MESSAGE_THREADS')
        .doc(threadID)
        .collection('MESSAGES')
        .add({
          text,
          createdAt: new Date().getTime(),
          user: { _id: currentUser.uid, name: currentUser.displayName },
        });
    });
};

export const signInAnonymously = () => {
  return auth()
    .signInAnonymously()
    .then(({ user }) => {
      user.updateProfile({
        displayName: uniqueNamesGenerator({
          dictionaries: [adjectives, colors, animals],
        }),
      });
    });
};

export const markThreadLastRead = ({ threadID }) => {
  firestore()
    .collection('USER_THREAD_TRACK')
    .doc(currentUser.uid)
    .set({ [threadID]: new Date().getTime() }, { merge: true });
};

export const listenToThreadTracking = () => {
  return firestore().collection('USER_THREAD_TRACK').doc(currentUser.uid);
};

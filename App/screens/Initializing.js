import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { signInAnonymously } from '../firebase/index';

export default ({ onHasUser }) => {
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log({ authUser });
        return onHasUser();
      }
      return signInAnonymously().then(() => onHasUser());
    });

    return () => unsubscribe();
  }, []);

  return null;
};

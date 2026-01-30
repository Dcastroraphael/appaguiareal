import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  // @ts-ignore - Necessário porque o Firebase não exporta tipos específicos para RN
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";

// Se o erro persistir no VS Code, mude para:
// import { getReactNativePersistence } from 'firebase/auth/react-native';

import { initializeFirestore, memoryLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCr0CSFUE34SQqaP20vZIP79EqefJk-SLg",
  authDomain: "appaguiareal.firebaseapp.com",
  projectId: "appaguiareal",
  storageBucket: "appaguiareal.firebasestorage.app",
  messagingSenderId: "67194885644",
  appId: "1:67194885644:web:2f567b483c3ed418450029",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

let auth: Auth;

// A inicialização precisa de um try/catch para não quebrar no Fast Refresh
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

const db = initializeFirestore(app, {
  localCache: memoryLocalCache(),
});

const storage = getStorage(app);

export { auth, db, storage };


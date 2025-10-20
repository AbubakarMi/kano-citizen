"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDRo9Vnm8Tlg5jjGRgE9-uvIXoKyLPPUBU",
  authDomain: "kano-citizen-s-voice.firebaseapp.com",
  projectId: "kano-citizen-s-voice",
  storageBucket: "kano-citizen-s-voice.appspot.com",
  messagingSenderId: "392979246627",
  appId: "1:392979246627:web:156ae10eb515d7928ccb96",
  measurementId: "G-9C2Y5SLX1D"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

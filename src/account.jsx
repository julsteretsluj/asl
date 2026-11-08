import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase.js";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => onAuthStateChanged(auth, (next) => setUser(next)), []);

  const value = useMemo(
    () => ({
      user: user === undefined ? null : user,
      ready: user !== undefined,
      async signUp(email, password) {
        const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
        return result.user;
      },
      async signIn(email, password) {
        const result = await signInWithEmailAndPassword(auth, email.trim(), password);
        return result.user;
      },
      async signOut() {
        await signOut(auth);
      },
    }),
    [user],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const value = useContext(AccountContext);
  if (!value) throw new Error("useAccount must be used inside AccountProvider");
  return value;
}

export function authMessage(error) {
  const code = error?.code || "";
  if (code === "auth/invalid-email") return "That email address doesn’t look complete.";
  if (code === "auth/email-already-in-use") return "That email already has an account. Sign in instead.";
  if (code === "auth/weak-password") return "Use at least 6 characters.";
  if (code === "auth/invalid-credential" || code === "auth/user-not-found" || code === "auth/wrong-password") {
    return "That email and password don’t match an account.";
  }
  if (code === "auth/too-many-requests") return "Too many tries. Wait a moment, then try again.";
  if (code === "auth/network-request-failed") return "The sign-in service didn’t answer. Your lesson record is still on this device.";
  return "Sign-in didn’t go through. Try again in a moment.";
}

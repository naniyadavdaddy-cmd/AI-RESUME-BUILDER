import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User 
} from "firebase/auth";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize the Firebase application
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure Google OAuth provider with requested scopes
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/userinfo.email");
provider.addScope("https://www.googleapis.com/auth/userinfo.profile");

// In-memory token cache to comply with security guidelines
let cachedAccessToken: string | null = null;
let isSigningIn = false;

/**
 * Initializes the auth listener.
 */
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user && cachedAccessToken) {
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else if (!isSigningIn) {
      cachedAccessToken = null;
      if (onAuthFailure) {
        onAuthFailure();
      }
    }
  });
};

/**
 * Trigger secure Firebase Google Sign-In with popup.
 * Must be initiated by direct user gesture (e.g. click).
 */
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve access token from Google sign-in.");
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Firebase Google Popup authentication error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

/**
 * Logs out the current user and clears memory cache.
 */
export const logout = async (): Promise<void> => {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Failed during sign-out:", error);
  } finally {
    cachedAccessToken = null;
  }
};

/**
 * Retrieves the currently active cached user access token.
 */
export const getAccessToken = (): string | null => {
  return cachedAccessToken;
};

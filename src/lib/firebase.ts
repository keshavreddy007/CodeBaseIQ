import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInWithPopup, 
  signOut,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp, 
  collection, 
  getDocs, 
  query, 
  orderBy 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const isRemixed = firebaseConfig.apiKey && firebaseConfig.apiKey.startsWith('remixed-');

let app: any = null;
export let analytics: any = null;
export let auth: any = null;
export let db: any = null;

if (!isRemixed) {
  app = initializeApp(firebaseConfig);
  import('firebase/analytics').then(({ isSupported, getAnalytics }) => {
    isSupported().then(yes => { if(yes) analytics = getAnalytics(app); }).catch(() => {});
  });
  auth = getAuth(app);
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
} else {
  // Provide dummy objects to prevent crashes on remixed apps
  auth = {
    onAuthStateChanged: (cb: any) => { cb(null); return () => {}; },
    currentUser: null
  };
  db = {};
}

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const saveUserToDb = async (user: User) => {
  if (isRemixed) return;
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      lastLogin: serverTimestamp(),
      createdAt: user.metadata.creationTime ? new Date(user.metadata.creationTime).toISOString() : null,
      provider: user.providerData?.[0]?.providerId || 'email',
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const signInWithGoogle = async () => {
  if (isRemixed) {
    throw new Error("Firebase is not configured. Please set up Firebase in AI Studio.");
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await saveUserToDb(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

export const signInWithGithub = async () => {
  if (isRemixed) {
    throw new Error("Firebase is not configured. Please set up Firebase in AI Studio.");
  }
  try {
    const result = await signInWithPopup(auth, githubProvider);
    await saveUserToDb(result.user);
    return result.user;
  } catch (error) {
    console.error("Error signing in with GitHub", error);
    throw error;
  }
};

export const logOut = async () => {
  if (isRemixed) return;
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
    throw error;
  }
};

export const getAllUsers = async () => {
  if (isRemixed) return [];
  const path = 'users';
  try {
    const q = query(collection(db, path), orderBy('lastLogin', 'desc'));
    const snapshot = await getDocs(q);
    const users: any[] = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return users;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
};

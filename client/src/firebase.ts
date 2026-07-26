const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "edupredictai-d30e0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "edupredictai-d30e0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "edupredictai-d30e0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "325513095349",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:325513095349:web:1414a59d2e98df173c36fc",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3H306JVEM2",
};

type FirebaseAuth = {
  onAuthStateChanged: (cb: (user: FirebaseUser | null) => void) => () => void;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseUser>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  currentUser: FirebaseUser | null;
};

type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  getIdToken: () => Promise<string>;
  updateProfile: (profile: { displayName?: string }) => Promise<void>;
};

let firebaseAuth: FirebaseAuth | null = null;
let fbLoaded = false;
let fbLoading = false;
let fbLoadCallbacks: (() => void)[] = [];

function onFirebaseReady(cb: () => void) {
  if (fbLoaded) { cb(); return; }
  fbLoadCallbacks.push(cb);
}

async function loadFirebaseSDK() {
  if (fbLoading || fbLoaded) return;
  fbLoading = true;

  try {
    const fb = (window as any).firebase;
    if (fb && !fb.apps?.length) {
      fb.initializeApp(firebaseConfig);
    }
    if (fb) {
      const auth = fb.auth();
      firebaseAuth = {
        onAuthStateChanged: (cb: (user: FirebaseUser | null) => void) => {
          return auth.onAuthStateChanged((u: any) => {
            cb(u ? {
              uid: u.uid,
              email: u.email,
              displayName: u.displayName,
              getIdToken: () => u.getIdToken(),
              updateProfile: (p: any) => u.updateProfile(p),
            } : null);
          });
        },
        signInWithEmailAndPassword: async (email: string, password: string) => {
          const result = await auth.signInWithEmailAndPassword(email, password);
          const u = result.user!;
          return {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            getIdToken: () => u.getIdToken(),
            updateProfile: (p: any) => u.updateProfile(p),
          };
        },
        createUserWithEmailAndPassword: async (email: string, password: string) => {
          const result = await auth.createUserWithEmailAndPassword(email, password);
          const u = result.user!;
          return {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            getIdToken: () => u.getIdToken(),
            updateProfile: (p: any) => u.updateProfile(p),
          };
        },
        signOut: () => auth.signOut(),
        get currentUser() { return auth.currentUser ? ({
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          getIdToken: () => auth.currentUser!.getIdToken(),
          updateProfile: (p: any) => auth.currentUser!.updateProfile(p),
        }) : null; },
      };
    }
  } catch (e) { console.warn('Firebase init failed:', e); }

  auth = firebaseAuth;
  fbLoaded = true;
  fbLoading = false;
  fbLoadCallbacks.forEach((cb) => cb());
  fbLoadCallbacks = [];
}

loadFirebaseSDK();

let auth: FirebaseAuth | null = null;
export { firebaseAuth, auth, onFirebaseReady };

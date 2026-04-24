import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// --- Initialization ---
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// --- Error Handler ---
export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write' | 'auth';
  path: string | null;
  authInfo?: any;
}

export function handleFirestoreError(error: any, operationType: FirestoreErrorInfo['operationType'], path: string | null = null): never {
  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType,
    path,
  };
  console.error('Firestore Error:', errorInfo);
  throw new Error(JSON.stringify(errorInfo));
}

// --- Auth Service ---
export const authService = {
  async signInWithGoogle() {
    try {
      console.log('Starting Google Sign-In...');
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log('Auth Success:', user.email);
      
      // Check if user profile exists, if not create one
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      
      const isAdmin = user.email === 'kafehazyad5@gmail.com';

      if (!userSnap.exists()) {
        console.log('Creating new user profile...');
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          isAdmin: isAdmin,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else if (isAdmin && !userSnap.data()?.isAdmin) {
        console.log('Updating user to admin status...');
        // Ensure owner email always has admin rights
        await updateDoc(userRef, { 
          isAdmin: true,
          updatedAt: serverTimestamp()
        });
      }
      return user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      handleFirestoreError(error, 'auth');
    }
  },

  async signOut() {
    return auth.signOut();
  },

  async getCurrentUserProfile(uid: string) {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? snap.data() : null;
  }
};

// --- Services ---
export interface BookingInput {
  tripId: string;
  tripTitle: string;
  customerName: string;
  customerPhone: string;
}

export const bookingService = {
  async createBooking(input: BookingInput) {
    const bookingId = doc(collection(db, 'bookings')).id;
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const payload = {
      ...input,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      await setDoc(bookingRef, payload);
      return bookingId;
    } catch (error) {
      handleFirestoreError(error, 'create', `bookings/${bookingId}`);
    }
  },

  async getAllBookings() {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      handleFirestoreError(error, 'list', 'bookings');
    }
  },

  async updateBookingStatus(id: string, status: string) {
    try {
      const ref = doc(db, 'bookings', id);
      await updateDoc(ref, { status, updatedAt: serverTimestamp() });
    } catch (error) {
      handleFirestoreError(error, 'update', `bookings/${id}`);
    }
  },

  async deleteBooking(id: string) {
    try {
      await deleteDoc(doc(db, 'bookings', id));
    } catch (error) {
      handleFirestoreError(error, 'delete', `bookings/${id}`);
    }
  }
};

export const tripService = {
  async getAllTrips() {
    try {
      const q = query(collection(db, 'trips'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
      handleFirestoreError(error, 'list', 'trips');
    }
  },

  async getTripById(id: string) {
    try {
      const snap = await getDoc(doc(db, 'trips', id));
      return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (error) {
      handleFirestoreError(error, 'get', `trips/${id}`);
    }
  },

  async createTrip(tripData: any) {
    const id = doc(collection(db, 'trips')).id;
    try {
      await setDoc(doc(db, 'trips', id), {
        ...tripData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return id;
    } catch (error) {
      handleFirestoreError(error, 'create', `trips/${id}`);
    }
  },

  async updateTrip(id: string, tripData: any) {
    try {
      await updateDoc(doc(db, 'trips', id), {
        ...tripData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, 'update', `trips/${id}`);
    }
  },

  async deleteTrip(id: string) {
    try {
      await deleteDoc(doc(db, 'trips', id));
    } catch (error) {
      handleFirestoreError(error, 'delete', `trips/${id}`);
    }
  }
};

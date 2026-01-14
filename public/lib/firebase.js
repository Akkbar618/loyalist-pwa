/**
 * Firebase Wrapper
 * Switches between Real Firebase SDK and Mock Implementation
 * based on configuration
 */

import { firebaseConfig } from '../firebase-config.js';

// Check if we should use mock (missing config or explicit flag)
const useMock = !firebaseConfig.apiKey || import.meta.env.VITE_USE_MOCK === 'true';

if (useMock) {
    console.log('🔶 RUNNING IN MOCK MODE');
}

// ==========================================
// REAL FIREBASE IMPORTS
// ==========================================
async function loadRealFirebase() {
    const app = await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js");
    const auth = await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js");
    const firestore = await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js");
    return { ...app, ...auth, ...firestore };
}

// ==========================================
// MOCK IMPLEMENTATION
// ==========================================
const MockAuth = {
    currentUser: null,
    listeners: new Set(),

    notify() {
        this.listeners.forEach(cb => cb(this.currentUser));
    }
};

const MockDb = {
    data: {
        users: {
            'test-user-id': {
                email: 'test@example.com',
                role: 'USER',
                totalPoints: 1250,
                visitCount: 5,
                userId: 'test-user-id'
            }
        },
        transactions: []
    }
};

// Mock Functions
const mockInitializeApp = () => ({ name: '[MOCK APP]' });
const mockGetAuth = () => MockAuth;
const mockGetFirestore = () => MockDb;

const mockOnAuthStateChanged = (auth, nextOrObserver) => {
    MockAuth.listeners.add(nextOrObserver);
    // Trigger immediately
    nextOrObserver(MockAuth.currentUser);
    return () => MockAuth.listeners.delete(nextOrObserver);
};

const mockSignInWithEmailAndPassword = async (auth, email, password) => {
    console.log('[MOCK] SignIn', email);
    if (password === 'error') throw new Error('Wrong password');

    MockAuth.currentUser = {
        uid: 'test-user-id',
        email: email,
        displayName: 'Test User',
        emailVerified: true
    };
    MockAuth.notify();
    return { user: MockAuth.currentUser };
};

const mockCreateUserWithEmailAndPassword = async (auth, email, password) => {
    console.log('[MOCK] SignUp', email);
    MockAuth.currentUser = {
        uid: 'test-user-id',
        email: email,
        displayName: 'New User',
        emailVerified: false
    };
    MockAuth.notify();
    return { user: MockAuth.currentUser };
};

const mockSignOut = async () => {
    console.log('[MOCK] SignOut');
    MockAuth.currentUser = null;
    MockAuth.notify();
};

const mockSendPasswordResetEmail = async (auth, email) => {
    console.log('[MOCK] Password Reset Sent to', email);
};

// Mock Firestore
const mockDoc = (db, collection, id) => ({ path: `${collection}/${id}`, id });
const mockCollection = (db, path) => ({ path });
const mockSetDoc = async (ref, data) => {
    console.log('[MOCK] setDoc', ref.path, data);
};
const mockGetDoc = async (ref) => {
    console.log('[MOCK] getDoc', ref.path);
    // Return mock user data if requesting user
    if (ref.path.startsWith('users/')) {
        return {
            exists: () => true,
            data: () => MockDb.data.users['test-user-id']
        };
    }
    return { exists: () => false };
};

const mockQuery = (ref, ...constraints) => ({ ref, constraints });
const mockWhere = (field, op, value) => ({ field, op, value });
const mockOnSnapshot = (query, callback) => {
    console.log('[MOCK] onSnapshot', query);
    // Verify it's a transactions query
    if (query.ref && query.ref.path === 'transactions') {
        const docs = [
            { id: 't1', data: () => ({ caféName: 'MOCK Cafe 1', points: 100, date: Date.now() - 100000 }) },
            { id: 't2', data: () => ({ caféName: 'MOCK Cafe 2', points: 50, date: Date.now() - 200000 }) }
        ];
        callback({ docs, empty: false });
    } else {
        callback({ docs: [], empty: true });
    }
    return () => { };
};


// ==========================================
// EXPORTS
// ==========================================
// We need to export everything that standard firebase exports
// But since we can't do conditional static exports easily in ESM without top-level await (which is supported in modern browsers/vite),
// we will export proxies or the implementation directly.

// Ideally we'd validly import from CDN, but let's implement a wrapper object pattern or standard exports.
// Since `app.js` does `import { getAuth } ...`, we must export those names.

// To allow top-level switching, we rely on the fact that Vite handles this.
// However, standard ESM `import` is static.

// Trick: We will mock the modules by re-exporting.
// Limitation: we can't dynamically choose *which* module to re-export from at runtime in a way that changes the static exports easily without a bundler plugin?
// Actually, we can just export our own functions which delegate.

export const initializeApp = useMock ? mockInitializeApp : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js")).initializeApp;
export const getAuth = useMock ? mockGetAuth : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).getAuth;
export const onAuthStateChanged = useMock ? mockOnAuthStateChanged : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).onAuthStateChanged;
export const signInWithEmailAndPassword = useMock ? mockSignInWithEmailAndPassword : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).signInWithEmailAndPassword;
export const createUserWithEmailAndPassword = useMock ? mockCreateUserWithEmailAndPassword : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).createUserWithEmailAndPassword;
export const signOut = useMock ? mockSignOut : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).signOut;
export const sendPasswordResetEmail = useMock ? mockSendPasswordResetEmail : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js")).sendPasswordResetEmail;

export const getFirestore = useMock ? mockGetFirestore : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).getFirestore;
export const doc = useMock ? mockDoc : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).doc;
export const setDoc = useMock ? mockSetDoc : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).setDoc;
export const getDoc = useMock ? mockGetDoc : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).getDoc;
export const collection = useMock ? mockCollection : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).collection;
export const query = useMock ? mockQuery : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).query;
export const where = useMock ? mockWhere : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).where;
export const onSnapshot = useMock ? mockOnSnapshot : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).onSnapshot;
export const addDoc = useMock ? async () => { } : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).addDoc;
export const updateDoc = useMock ? async () => { } : (await import("https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js")).updateDoc;

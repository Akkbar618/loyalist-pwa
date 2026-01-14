/**
 * Main Application Entry Point
 * Refactored to use centralized architecture modules
 */

// Import from local wrapper (switches between Mock and Real SDK)
import {
    initializeApp,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
    getFirestore,
    doc,
    setDoc
} from "./lib/firebase.js";

// Core architecture
import { appState, router, eventBus, Events } from "./core/index.js";

// Components
import { initErrorMessage, showError, hideError } from "./components/errorMessage.js";
import { cleanupNavigation } from "./components/navigation.js";

// Utils
import { t } from "./translations.js";
import { handleAsyncError, handleFirebaseError } from "./utils/errorHandler.js";
import { showToast } from "./utils/toast.js";

// Screens
import { showLoginScreen } from "./screens/loginScreen.js";
import { showRegisterScreen } from "./screens/registerScreen.js";
import { showResetScreen } from "./screens/resetScreen.js";
import { showMainScreen } from "./screens/mainScreen.js";
import { showSettingsScreen } from "./screens/settingsScreen.js";
import { showNewPasswordScreen } from "./screens/newPasswordScreen.js";

// Firebase config
import { firebaseConfig } from "./firebase-config.js";

// Initialize Firebase
// Note: In mock mode, initializeApp returns a mock object
let firebaseApp, auth, db;

try {
    firebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);
} catch (e) {
    console.error("Failed to initialize Firebase:", e);
}

/**
 * Create user document in Firestore
 */
async function createUserDocument(userId, email) {
    const [result, error] = await handleAsyncError(
        setDoc(doc(db, "users", userId), {
            userId,
            email,
            role: 'USER',
            registrationDate: Date.now(),
            totalPoints: 0,
            visitCount: 0
        })
    );

    if (error) {
        showError(handleFirebaseError(error));
        return false;
    }
    return true;
}

/**
 * Handle user logout
 */
async function logout() {
    const [result, error] = await handleAsyncError(signOut(auth));
    if (error) {
        showError(error);
        return;
    }
    eventBus.emit(Events.AUTH_LOGOUT);
    router.navigate('login');
}

/**
 * Setup route definitions
 */
function setupRoutes(container) {
    router
        .define('login', {
            guestOnly: true,
            render: (container) => {
                cleanupNavigation();
                showLoginScreen(container, {
                    onLogin: async (email, password) => {
                        if (!email || !password) {
                            showError(t("errors.fillAllFields"));
                            return;
                        }

                        const [result, error] = await handleAsyncError(
                            signInWithEmailAndPassword(auth, email, password)
                        );

                        if (error) {
                            showError(error);
                            return;
                        }

                        hideError();
                    },
                    onNavigateRegister: () => router.navigate('register'),
                    onNavigateReset: () => router.navigate('reset')
                });
            }
        })
        .define('register', {
            guestOnly: true,
            render: (container) => {
                cleanupNavigation();
                showRegisterScreen(container, {
                    onRegister: async (name, email, password, password2) => {
                        if (!name || !email || !password || !password2) {
                            showError(t("errors.fillAllFields"));
                            return;
                        }

                        if (password.length < 8) {
                            showError(t("errors.passwordLength"));
                            return;
                        }

                        if (password !== password2) {
                            showError(t("errors.passwordMismatch"));
                            return;
                        }

                        const [userCredential, error] = await handleAsyncError(
                            createUserWithEmailAndPassword(auth, email, password)
                        );

                        if (error) {
                            showError(error);
                            return;
                        }

                        const success = await createUserDocument(userCredential.user.uid, email);
                        if (!success) return;

                        hideError();
                        router.navigate('login');
                    },
                    onNavigateLogin: () => router.navigate('login')
                });
            }
        })
        .define('reset', {
            guestOnly: true,
            render: (container) => {
                cleanupNavigation();
                showResetScreen(container, {
                    onReset: async (email) => {
                        if (!email) {
                            showError(t("errors.fillAllFields"));
                            return;
                        }

                        const [result, error] = await handleAsyncError(
                            sendPasswordResetEmail(auth, email)
                        );

                        if (error) {
                            showError(handleFirebaseError(error));
                            return;
                        }

                        showToast(t("resetPassword.success"));
                        hideError();
                        router.navigate('login');
                    },
                    onNavigateLogin: () => router.navigate('login')
                });
            }
        })
        .define('main', {
            requiresAuth: true,
            render: (container) => {
                showMainScreen(container, {
                    onNavigateSettings: () => router.navigate('settings'),
                    onNavigateLogout: () => logout()
                });
            }
        })
        .define('settings', {
            requiresAuth: true,
            render: (container) => {
                showSettingsScreen(container, {
                    user: auth.currentUser,
                    onNavigateMain: () => router.navigate('main'),
                    onLogout: () => logout(),
                    onChangePassword: () => {
                        container.innerHTML = '';
                        showNewPasswordScreen(container, {
                            user: auth.currentUser,
                            onChangePasswordSuccess: () => router.navigate('login'),
                            onNavigateLogin: () => router.navigate('login'),
                            onNavigateBackToSettings: () => router.navigate('settings')
                        });
                    },
                    onDeleteAccount: async () => {
                        const [result, error] = await handleAsyncError(auth.currentUser.delete());
                        if (error) {
                            showError(error);
                            return;
                        }
                        showToast(t("settings.accountDeleted"));
                        await logout();
                    }
                });
            }
        })
        .define('newpassword', {
            requiresAuth: true,
            render: (container) => {
                showNewPasswordScreen(container, {
                    user: auth.currentUser,
                    onChangePasswordSuccess: () => router.navigate('login'),
                    onNavigateLogin: () => router.navigate('login'),
                    onNavigateBackToSettings: () => router.navigate('settings')
                });
            }
        });
}

/**
 * Initialize the application
 */
function initApp() {
    // Initialize error message component
    initErrorMessage();

    // Get app container
    const appContainer = document.getElementById('app-container');
    if (!appContainer) {
        console.error('App container not found!');
        return;
    }

    // Setup routes
    setupRoutes(appContainer);

    // Listen to auth state changes
    onAuthStateChanged(auth, (user) => {
        appState.setUser(user);
        appState.set('isLoading', false);

        if (user) {
            eventBus.emit(Events.AUTH_LOGIN, user);

            // Redirect to main if on guest-only routes
            const currentHash = window.location.hash.replace('#/', '') || 'login';
            if (['', 'login', 'register', 'reset'].includes(currentHash)) {
                router.navigate('main');
            } else {
                router.init(appContainer);
            }
        } else {
            router.init(appContainer);
        }
    });

    // Subscribe to toast events
    eventBus.on(Events.TOAST_SHOW, (message) => {
        showToast(message);
    });

    // Subscribe to error events
    eventBus.on(Events.ERROR_SHOW, (message) => {
        showError(message);
    });

    eventBus.on(Events.ERROR_HIDE, () => {
        hideError();
    });

    console.log('🚀 App initialized with new architecture');
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
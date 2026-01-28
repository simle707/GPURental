'use client'
import { initializeApp } from 'firebase/app';
import { 
	getAuth, 
	GoogleAuthProvider, 
	signInWithRedirect, 
	signInWithPopup,
	browserLocalPersistence, 
	setPersistence,
	signOut 
} from 'firebase/auth';

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence);

export const signInWithGoogle = async () => {
	provider.addScope('profile');
	provider.addScope('email');
	provider.addScope('openid');
	provider.setCustomParameters({
		prompt: 'select_account',
		access_type: 'offline'
	});

	if (process.env.NODE_ENV === 'development') {
		console.log("检测到开发环境，使用 Popup 登录...");
		return await signInWithPopup(auth, provider);
	} else {
		console.log("检测到生产环境，发起 Redirect...");
		return await signInWithRedirect(auth, provider);
	}
};

export const signOutUser = async () => {
	await signOut(auth);
};
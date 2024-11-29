import admin from 'firebase-admin';
import { FIREBASE_API_KEY } from '$env/static/private';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(FIREBASE_API_KEY),
		storageBucket: 'papeleria-be740.appspot.com'
	});
}

export const bucket = admin.storage().bucket();
export default admin;

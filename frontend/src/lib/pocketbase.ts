import { invalidateAll } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { serialize } from 'cookie';
import { locationState } from './shared.svelte';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const currentUser = writable(pb.authStore.model);

// Store authentication details in a cookie after successful login
export const initPasswordAuth = async (
	name_or_email: string,
	password: string,
	callback = () => {}
) => {
	
    console.log('initPasswordAuth: ', name_or_email, password);
    const authData = await pb.collection('users').authWithPassword(name_or_email, password);

    if (authData) {
        currentUser.set(pb.authStore.model);

        // Store auth data in a cookie
        storeAuthToCookie();

        invalidateAll();
        callback();
    }

};

// Store authentication details in a cookie after successful registration
export const initRegistrationAuth = async (email: string, password: string, nickname: string, registerToken: string, callback = () => {}) => {
    
    await pb.collection('users').create({
        email: email,
        name: nickname,
        password: password,
        passwordConfirm: password,
        registerToken: registerToken
    });

    await initPasswordAuth(email, password, callback);
};

// Store authentication details in a cookie
export const storeAuthToCookie = async () => {
	// Store auth data in a cookie
	document.cookie = serialize(
		'pb_auth',
		JSON.stringify({
			token: pb.authStore.token,
			user: pb.authStore.model
		}),
		{
			path: '/', // Make cookie available to the entire app
			maxAge: 60 * 60 * 24 * 7, // 7 days
			httpOnly: false // Cookies must be accessible in the browser
		}
	);
};

// Restore authentication from a cookie
export const restoreAuthFromCookie = () => {
	// Ensure this code runs only in the browser
	if (typeof window === 'undefined') return;

	const cookies = document.cookie.split('; ').reduce((acc: { [key: string]: string }, cookie) => {
		const [key, value] = cookie.split('=');
		acc[key] = value;
		return acc;
	}, {});

	if (cookies.pb_auth) {
		try {
			const authData = JSON.parse(decodeURIComponent(cookies.pb_auth));
			pb.authStore.save(authData.token, authData.user);
			currentUser.set(pb.authStore.model);
			console.log('Authentication restored from cookie:', authData.user);
		} catch (e) {
			console.error('Error restoring authentication from cookie:', e);
		}
	}
};

// Restore location from a cookie and ensure it is within valid boundaries
export const restoreLocationFromCookie = () => {
	// Ensure this code runs only in the browser
	if (typeof window === 'undefined') return;

	const cookies = document.cookie.split('; ').reduce((acc: { [key: string]: string }, cookie) => {
		const [key, value] = cookie.split('=');
		acc[key] = value;
		return acc;
	}, {});

	if (cookies.pb_location) {
		try {
			const locationData = JSON.parse(decodeURIComponent(cookies.pb_location));
			const { latitude, longitude, view } = locationData;

			// Ensure latitude and longitude are within valid boundaries
			if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
				locationState.location = { latitude, longitude, view };
				console.log('Location restored from cookie:', locationData);
			} else {
				// Use modulo to wrap latitude and longitude within valid boundaries
				locationState.location = {
					latitude: ((((latitude + 90) % 180) + 180) % 180) - 90,
					longitude: ((((longitude + 180) % 360) + 360) % 360) - 180,
					view
				};
				console.log('Location wrapped within valid boundaries:', locationState.location);
			}
		} catch (e) {
			console.error('Error restoring location from cookie:', e);
		}
	}
};

/*
export const restoreLocationFromCookie = () => {
    // Ensure this code runs only in the browser
    if (typeof window === 'undefined') return;

    const cookies = document.cookie
        .split('; ')
        .reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

    if (cookies.pb_location) {
        try {
            const locationData = JSON.parse(decodeURIComponent(cookies.pb_location));
            locationState.location =  { latitude: locationData.latitude, longitude: locationData.longitude, view: locationData.view };
            console.log("Location restored from cookie:", locationData);
        } catch (e) {
            console.error("Error restoring location from cookie:", e);
        }
    }
}
    */

export const storeLocationToCookie = async () => {
	// Ensure this code runs only in the browser
	if (typeof window === 'undefined') return;

	document.cookie = serialize(
		'pb_location',
		JSON.stringify({
			latitude: locationState.location.latitude,
			longitude: locationState.location.longitude,
			view: locationState.location.view
		}),
		{ path: '/', maxAge: 60 * 60 * 24 * 7, httpOnly: false }
	);
};

// Refresh authentication token and update the cookie
export const refreshAuth = async () => {
	try {
		const authData = await pb.collection('users').authRefresh();
		if (authData) {
			// Update the cookie with the new token
			document.cookie = serialize(
				'pb_auth',
				JSON.stringify({
					token: pb.authStore.token,
					user: pb.authStore.model
				}),
				{
					path: '/',
					maxAge: 60 * 60 * 24 * 7, // 7 days
					httpOnly: false
				}
			);

			invalidateAll();
		}
	} catch (e) {
		console.error('Error refreshing authentication:', e);
	}
};

// Logout and clear authentication data
export const logout = async () => {
	try {
		pb.authStore.clear();
		currentUser.set(null);

		// Clear the auth cookie
		document.cookie = serialize('pb_auth', '', {
			path: '/',
			maxAge: 0 // Expire immediately
		});

		invalidateAll();
	} catch (e) {
		console.error('Error during logout:', e);
	}
};

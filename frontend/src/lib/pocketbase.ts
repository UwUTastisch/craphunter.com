import { invalidateAll } from '$app/navigation';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import { serialize } from 'cookie';

export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const currentUser = writable(pb.authStore.model);

// Store authentication details in a cookie after successful login
export const initPasswordAuth = async (name_or_email: string, password: string, callback = () => {}) => {
    try {
        console.log("initPasswordAuth: ", name_or_email, password);
        const authData = await pb.collection('users').authWithPassword(name_or_email, password);

        if (authData) {
            currentUser.set(pb.authStore.model);

            // Store auth data in a cookie
            document.cookie = serialize('pb_auth', JSON.stringify({
                token: pb.authStore.token,
                user: pb.authStore.model
            }), {
                path: '/', // Make cookie available to the entire app
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: false // Cookies must be accessible in the browser
            });

            invalidateAll();
            callback();
        }
    } catch (e) {
        console.error("initPasswordAuth Error: ", e);
    }
};

// Restore authentication from a cookie
export const restoreAuthFromCookie = () => {
    // Ensure this code runs only in the browser
    if (typeof window === 'undefined') return;

    const cookies = document.cookie
        .split('; ')
        .reduce((acc: { [key: string]: string }, cookie) => {
            const [key, value] = cookie.split('=');
            acc[key] = value;
            return acc;
        }, {});

    if (cookies.pb_auth) {
        try {
            const authData = JSON.parse(decodeURIComponent(cookies.pb_auth));
            pb.authStore.save(authData.token, authData.user);
            currentUser.set(pb.authStore.model);
            console.log("Authentication restored from cookie:", authData.user);
        } catch (e) {
            console.error("Error restoring authentication from cookie:", e);
        }
    }
};


// Refresh authentication token and update the cookie
export const refreshAuth = async () => {
    try {
        const authData = await pb.collection('users').authRefresh();
        if (authData) {
            // Update the cookie with the new token
            document.cookie = serialize('pb_auth', JSON.stringify({
                token: pb.authStore.token,
                user: pb.authStore.model
            }), {
                path: '/',
                maxAge: 60 * 60 * 24 * 7, // 7 days
                httpOnly: false
            });

            invalidateAll();
        }
    } catch (e) {
        console.error("Error refreshing authentication:", e);
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
        console.error("Error during logout:", e);
    }
};

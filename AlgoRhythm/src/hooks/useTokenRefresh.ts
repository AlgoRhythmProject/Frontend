import { useEffect, useRef } from 'react';
import { authApi } from '@/api/auth/authApi';


export function useTokenRefresh() {
    const refreshTimeoutRef = useRef<number | null>(null);

    const scheduleTokenRefresh = (expiresUtc: string) => {
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        const expirationTime = new Date(expiresUtc).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expirationTime - currentTime;

        const refreshBuffer = 5 * 60 * 1000;
        const timeUntilRefresh = Math.max(0, timeUntilExpiry - refreshBuffer);

        if (timeUntilRefresh === 0) {
            console.log('Token expired or expiring soon, refreshing immediately...');
            refreshTokenNow();
            return;
        }

        console.log(`Token refresh scheduled in ${Math.round(timeUntilRefresh / 1000 / 60)} minutes`);

        refreshTimeoutRef.current = setTimeout(() => {
            refreshTokenNow();
        }, timeUntilRefresh);
    };

    const refreshTokenNow = async () => {
        try {
            console.log('Refreshing access token...');
            const newToken = await authApi.refreshToken();
            localStorage.setItem('token', newToken);
            console.log('Token refreshed successfully');

            try {
                const tokenParts = newToken.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    if (payload.exp) {
                        const expiresUtc = new Date(payload.exp * 1000).toISOString();
                        scheduleTokenRefresh(expiresUtc);
                    }
                }
            } catch (decodeError) {
                console.error('Failed to decode new token:', decodeError);
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));

                if (payload.exp) {
                    const expiresUtc = new Date(payload.exp * 1000).toISOString();
                    console.log('Token expires at:', expiresUtc);
                    scheduleTokenRefresh(expiresUtc);
                } else {
                    console.warn('Token does not contain exp claim');
                }
            }
        } catch (error) {
            console.error('Failed to decode token:', error);
        }

        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
    }, []);

    return null;
}
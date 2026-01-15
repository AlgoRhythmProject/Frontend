import { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, LogLevel, HubConnection, HttpTransportType, type RetryContext, HubConnectionState } from '@microsoft/signalr';

export function useRoslynLanguageServer() {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const hubConnection = new HubConnectionBuilder()
            .withUrl('http://localhost:5095/roslynhub', {
                skipNegotiation: false,
                transport: HttpTransportType.WebSockets | HttpTransportType.ServerSentEvents | HttpTransportType.LongPolling
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext: RetryContext) => {  // ← TUTAJ
                    if (retryContext.previousRetryCount >= maxReconnectAttempts) {
                        return null;
                    }
                    return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
                }
            })
            .configureLogging(LogLevel.Information)
            .build();

        // Event handlers
        hubConnection.onreconnecting(() => {
            console.log('SignalR: Reconnecting...');
            setIsConnected(false);
        });

        hubConnection.onreconnected(() => {
            console.log('SignalR: Reconnected');
            setIsConnected(true);
            reconnectAttempts.current = 0;
        });

        hubConnection.onclose((error: Error | undefined) => {  // ← TUTAJ
            console.log('SignalR: Connection closed', error);
            setIsConnected(false);

            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++;
                const delay = Math.min(1000 * reconnectAttempts.current, 5000);
                console.log(`SignalR: Attempting reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);

                setTimeout(() => {
                    if (hubConnection.state === HubConnectionState.Disconnected) {
                        hubConnection.start()
                            .then(() => {
                                console.log('SignalR: Reconnected successfully');
                                setIsConnected(true);
                                reconnectAttempts.current = 0;
                            })
                            .catch((err: Error) => console.error('SignalR: Reconnect failed', err));  // ← TUTAJ
                    }
                }, delay);
            }
        });

        // Initial connection
        hubConnection.start()
            .then(() => {
                console.log('SignalR: Connected successfully');
                setIsConnected(true);
                setConnection(hubConnection);
                reconnectAttempts.current = 0;
            })
            .catch((err: Error) => {  // ← TUTAJ
                console.error('SignalR: Connection failed', err);
                setIsConnected(false);
            });

        // Cleanup
        return () => {
            console.log('SignalR: Cleaning up connection');
            if (hubConnection.state !== HubConnectionState.Disconnected) {
                hubConnection.stop()
                    .catch((err: Error) => console.error('SignalR: Error during cleanup', err));  // ← TUTAJ
            }
        };
    }, []);

    return { connection, isConnected };
}
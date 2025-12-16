import { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export function useRoslynLanguageServer() {
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);
    const maxReconnectAttempts = 5;

    useEffect(() => {
        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl('http://localhost:5095/roslynhub', {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.ServerSentEvents | signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    if (retryContext.previousRetryCount >= maxReconnectAttempts) {
                        return null; // Stop reconnecting
                    }
                    return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
                }
            })
            .configureLogging(signalR.LogLevel.Information)
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

        hubConnection.onclose((error) => {
            console.log('SignalR: Connection closed', error);
            setIsConnected(false);

            // Automatic reconnection attempt after close
            if (reconnectAttempts.current < maxReconnectAttempts) {
                reconnectAttempts.current++;
                const delay = Math.min(1000 * reconnectAttempts.current, 5000);
                console.log(`SignalR: Attempting reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);

                setTimeout(() => {
                    if (hubConnection.state === signalR.HubConnectionState.Disconnected) {
                        hubConnection.start()
                            .then(() => {
                                console.log('SignalR: Reconnected successfully');
                                setIsConnected(true);
                                reconnectAttempts.current = 0;
                            })
                            .catch(err => console.error('SignalR: Reconnect failed', err));
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
            .catch((err) => {
                console.error('SignalR: Connection failed', err);
                setIsConnected(false);
            });

        // Cleanup
        return () => {
            console.log('SignalR: Cleaning up connection');
            if (hubConnection.state !== signalR.HubConnectionState.Disconnected) {
                hubConnection.stop()
                    .catch(err => console.error('SignalR: Error during cleanup', err));
            }
        };
    }, []);

    return { connection, isConnected };
}
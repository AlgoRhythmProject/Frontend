import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

interface UseSignalROptions {
    autoStart?: boolean;
    loggingLevel?: signalR.LogLevel;
    maxReconnectAttempts?: number;
}

export function useSignalR(url: string, options: UseSignalROptions = {}) {
    const {
        autoStart = true,
        loggingLevel = signalR.LogLevel.Information,
        maxReconnectAttempts = 5
    } = options;

    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectAttempts = useRef(0);

    const stopConnection = useCallback(async (conn: signalR.HubConnection) => {
        if (conn.state !== signalR.HubConnectionState.Disconnected) {
            try {
                await conn.stop();
            } catch (err) {
                console.error('SignalR Cleanup Error:', err);
            }
        }
    }, []);

    useEffect(() => {
        if (!url || !autoStart) return;

        const hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(url, {
                skipNegotiation: false,
                transport: signalR.HttpTransportType.WebSockets |
                    signalR.HttpTransportType.ServerSentEvents |
                    signalR.HttpTransportType.LongPolling
            })
            .withAutomaticReconnect({
                nextRetryDelayInMilliseconds: (retryContext) => {
                    if (retryContext.previousRetryCount >= maxReconnectAttempts) return null;
                    return Math.min(1000 * Math.pow(2, retryContext.previousRetryCount), 30000);
                }
            })
            .configureLogging(loggingLevel)
            .build();

        // Handlers
        hubConnection.onreconnecting(() => setIsConnected(false));
        hubConnection.onreconnected(() => {
            setIsConnected(true);
            reconnectAttempts.current = 0;
        });

        hubConnection.onclose((error) => {
            setIsConnected(false);
            console.log(error);
        });

        hubConnection.start()
            .then(() => {
                setIsConnected(true);
                setConnection(hubConnection);
            })
            .catch(err => {
                console.error(`SignalR Connection to ${url} failed:`, err);
                setIsConnected(false);
            });

        return () => {
            stopConnection(hubConnection);
        };
    }, [url, autoStart, loggingLevel, maxReconnectAttempts, stopConnection]);

    return { connection, isConnected };
}
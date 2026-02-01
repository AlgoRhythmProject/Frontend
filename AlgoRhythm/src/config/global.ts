declare global {
    interface Window {
        ENV: {
            API_BASE_URL: string,
            ANALYZER_URL: string,
            VISUALIZER_URL: string,
            GOOGLE_CLIENT_ID: string,
        };
    }
}

export const config = {
    apiBaseUrl:
        window.ENV?.API_BASE_URL && window.ENV.API_BASE_URL !== '__API_BASE_URL__'
            ? window.ENV.API_BASE_URL
            : import.meta.env.VITE_API_BASE_URL,

    analyzerUrl:
        window.ENV?.ANALYZER_URL && window.ENV.ANALYZER_URL !== '__ANALYZER_URL__'
            ? window.ENV.ANALYZER_URL
            : import.meta.env.VITE_ANALYZER_URL,

    visualizerUrl:
        window.ENV?.VISUALIZER_URL && window.ENV.VISUALIZER_URL !== '__VISUALIZER_URL__'
            ? window.ENV.VISUALIZER_URL
            : import.meta.env.VITE_VISUALIZER_URL,

    googleClientId:
        window.ENV?.GOOGLE_CLIENT_ID && window.ENV.GOOGLE_CLIENT_ID !== '__GOOGLE_CLIENT_ID__'
            ? window.ENV.GOOGLE_CLIENT_ID
            : import.meta.env.VITE_GOOGLE_CLIENT_ID,
};
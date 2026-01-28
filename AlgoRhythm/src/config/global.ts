declare global {
    interface Window {
        ENV: {
            API_BASE_URL: string,
            ANALYZER_URL: string,
            VISUALIZER_URL: string
        };
    }
}
import { execSync } from 'node:child_process';

const playwrightGlobalTeardown = async () => {
    console.log('🧹 Stopping docker containers...');
    execSync('docker compose -f docker-compose.dev.yml down', {
        stdio: 'inherit',
    });
};

export default playwrightGlobalTeardown;

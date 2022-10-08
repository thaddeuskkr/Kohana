import { Listener } from '@sapphire/framework';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../package.json');

export class ReadyListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            once: true,
            event: 'ready'
        });
    }
    async run (client) {
        const { username, id } = client.user;
        this.container.logger.info(`Logged in as ${username} (${id})`);
        await client.user.setStatus('idle');
        await client.user.setActivity(`/ • v${version}`, { type: 'LISTENING' });
    }
}
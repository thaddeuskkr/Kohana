import { Listener } from '@sapphire/framework';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../../../package.json');

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
        await client.user.setStatus(this.container.client.config.status);
        await client.user.setActivity(`/ • v${version}`, { type: 'LISTENING' });
        let current = 0;
        setInterval(() => {
            const activity = this.container.client.config.activities[current];
            client.user.setActivity(activity);
            current = current >= this.container.client.config.activities.length - 1 ? 0 : current + 1;
        }, this.container.client.config.activityRotateDelay * 1000);
    }
}

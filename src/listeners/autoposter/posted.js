import { Listener, container } from '@sapphire/framework';

export class PostedAPListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            emitter: container.client.ap,
            event: 'posted'
        });
    }
    run() {
        this.container.logger.debug(`Posted stats to top.gg | ${container.client.users.cache.size} users in ${container.client.guilds.cache.size} servers`);
    }
}

import { Listener, container } from '@sapphire/framework';

export class ShoukakuDebugListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            emitter: container.client.shoukaku,
            event: 'debug'
        });
    }
    run(_, message) {
        this.container.logger.debug(message);
    }
}

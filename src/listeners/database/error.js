import { Listener, container } from '@sapphire/framework';

export class DatabaseErrorListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            emitter: container.client.db,
            event: 'error',
            name: 'databaseError'
        });
    }
    run(error) {
        this.container.logger.error(`Keyv error:\n${error}`);
    }
}

import { Precondition } from '@sapphire/framework';

export class DispatcherPrecondition extends Precondition {
    constructor(context, options) {
        super(context, {
            ...options,
            enabled: true,
            name: 'dispatcher'
        });
    }
    async chatInputRun(interaction) {
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        if (!dispatcher || !dispatcher?.queue?.current) return this.error({ message: 'There is nothing playing.' });
        else return this.ok();
    }
}
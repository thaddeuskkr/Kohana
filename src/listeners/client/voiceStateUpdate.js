import { Listener } from '@sapphire/framework';

export class VoiceStateUpdateListener extends Listener {
    constructor(context, options) {
        super(context, {
            ...options,
            event: 'voiceStateUpdate'
        });
    }
    async run (o, n) {
        const dispatcher = this.container.client.queue.get(o.guild.id) || this.container.client.queue.get(n.guild.id);
        if (o.member.id !== this.container.client.user.id && n.member.id !== this.container.client.user.id) return; // Not the client
        if (!o.channelId) return; // Client entered a channel
        if (!n.channelId && dispatcher) return dispatcher.destroy(); // Client disconnected from the channel
        if (o.channelId !== n.channelId && o.channelId && n.channelId) { // Client moved to another channel
            if (n.channel.type === 'GUILD_STAGE_VOICE') {
                await n.setSuppressed(false);
            }
            return;
        }
    }
}

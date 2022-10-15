import Dispatcher from './dispatcher.js';
import { container } from '@sapphire/framework';

export class Queue extends Map {
    constructor(client, iterable) {
        super(iterable);
        this.client = client;
        this.previous = null;
    }

    async handle(guild, member, channel, node, track, next) {
        track.info.requester = member;
        const existing = this.get(guild.id);
        if (!existing) {
            if (this.client.shoukaku.players.has(guild.id)) 
                return 'Busy';
            const player = await node.joinChannel({
                guildId: guild.id,
                shardId: guild.shardId,
                channelId: member.voice.channelId
            });
            container.logger.debug(`New connection @ guild "${guild.id}"`);
            const dispatcher = new Dispatcher({
                client: this.client,
                guild,
                channel,
                player,
            });
            if (next) dispatcher.queue.unshift(track);
            else dispatcher.queue.push(track);
            this.set(guild.id, dispatcher);
            container.logger.debug(`New player dispatcher @ guild "${guild.id}"`);
            return dispatcher;
        }
        if (next) existing.queue.unshift(track);
        else existing.queue.push(track);
        if (!existing.current) existing.play();
        return null;
    }
}

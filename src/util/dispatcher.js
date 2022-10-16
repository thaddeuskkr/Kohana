import { container } from '@sapphire/framework';
import prettyms from 'pretty-ms';

export default class Dispatcher {
    constructor({ client, guild, channel, player }) {
        this.client = client;
        this.guild = guild;
        this.channel = channel;
        this.player = player;
        this.queue = [];
        this.repeat = 'off';
        this.current = null;
        this.stopped = false;

        let _notifiedOnce = false;
        let _errorHandler = data => {
            // Don't log if disconnected by user, I'm quite sure 4014 is the code.
            if ((data instanceof Error || data instanceof Object) && data.code !== 4014) container.logger.error(data);
            this.queue.length = 0;
            this.destroy();
        };

        this.player
            .on('start', async () => {
                if (this.repeat === 'one') {
                    if (_notifiedOnce) return;
                    else _notifiedOnce = true; 
                }
                else if (this.repeat === 'all' || this.repeat === 'off') {
                    _notifiedOnce = false;
                }
                this.nowPlayingMessage = await this.channel
                    .send({ embeds: [ container.client.util.embed(`${container.client.config.emojis.playing} [**${this.current.info.title}** - **${this.current.info.author}**](${this.current.info.uri}) \`${Dispatcher.humanizeTime(this.current.info.length)}\` (${this.current.info.requester.toString()})`) ] })
                    .catch(() => null);
            })
            .on('end', async () => {
                if (this.repeat === 'one') this.queue.unshift(this.current);
                if (this.repeat === 'all' && !this.current.skipped) this.queue.push(this.current);
                if (this.nowPlayingMessage && this.repeat !== 'one') {
                    await this.nowPlayingMessage.delete().catch(() => null);
                    this.nowPlayingMessage = null;
                }
                this.play();
            })
            .on('stuck', () => {
                const stuckTrack = this.current;
                if (this.repeat === 'one') this.queue.unshift(this.current);
                if (this.repeat === 'all') this.queue.push(this.current);
                if (this.nowPlayingMessage) {
                    this.nowPlayingMessage.edit({ embeds: [container.client.util.errorEmbed(`Stuck while playing track **${stuckTrack.info.title}** - **${stuckTrack.info.author}**`)] }).catch(() => null);
                    this.nowPlayingMessage = null;
                }
                this.play();
            })
            // .on('closed', _errorHandler)
            .on('error', _errorHandler);
    }

    static humanizeTime(ms) {
        return prettyms(ms, { colonNotation: true, secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 });
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    play() {
        if (this.guild.me?.voice?.channel?.type === 'GUILD_STAGE_VOICE') this.guild.me?.voice?.setSuppressed(false).catch(() => null);
        this.queue.previous = this.current;
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player
            .setVolume((this.client.config.defaultVolume || 75) / 100)
            .playTrack({ track: this.current.track });
    }
    
    async destroy(reason) {
        this.queue.length = 0;
        this.player.connection.disconnect();
        if (this.nowPlayingMessage) {
            await this.nowPlayingMessage.delete().catch(() => null);
            this.nowPlayingMessage = null;
        }
        this.client.queue.delete(this.guild.id);
        container.logger.debug(`Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No reason provided'}`);
        if (this.stopped) return;
        /*
        this.channel
            .send('No more tracks in queue.')
            .catch(() => null);
        */
    }
}

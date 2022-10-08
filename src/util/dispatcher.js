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
            if (data instanceof Error || data instanceof Object) container.logger.error(data);
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
                    .send({ embeds: [ container.client.util.embed(`<a:playing:1028255145814933514> [**${this.current.info.title}** - **${this.current.info.author}**](${this.current.info.uri}) \`${Dispatcher.humanizeTime(this.current.info.length)}\` (${this.current.info.requester.toString()})`) ] })
                    .catch(() => null);
            })
            .on('end', async () => {
                if (this.repeat === 'one') this.queue.unshift(this.current);
                if (this.repeat === 'all') this.queue.push(this.current);
                if (this.nowPlayingMessage) {
                    await this.nowPlayingMessage.delete().catch(() => null);
                    this.nowPlayingMessage = null;
                }
                this.play();
            })
            .on('stuck', () => {
                if (this.repeat === 'one') this.queue.unshift(this.current);
                if (this.repeat === 'all') this.queue.push(this.current);
                this.play();
            })
            .on('closed', _errorHandler)
            .on('error', _errorHandler);
    }

    static humanizeTime(ms) {
        return prettyms(ms, { colonNotation: true, secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 });
    }

    get exists() {
        return this.client.queue.has(this.guild.id);
    }

    play() {
        if (!this.exists || !this.queue.length) return this.destroy();
        this.current = this.queue.shift();
        this.player
            .setVolume(0.3)
            .playTrack({ track: this.current.track });
    }
    
    destroy(reason) {
        this.queue.length = 0;
        this.player.connection.disconnect();
        this.client.queue.delete(this.guild.id);
        container.logger.debug(`Destroyed the player & connection @ guild "${this.guild.id}"\nReason: ${reason || 'No Reason Provided'}`);
        if (this.stopped) return;
        /*
        this.channel
            .send('No more tracks in queue.')
            .catch(() => null);
        */
    }
}
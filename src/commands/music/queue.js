import { Command } from '@sapphire/framework';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import prettyms from 'pretty-ms';
import _ from 'lodash';

export class QueueCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'queue',
            description: 'Shows you the current queue for the server.',
            preconditions: ['dispatcher']
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDMPermission(false)
        );
    }
    
    async chatInputRun(interaction) {
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        const queue = dispatcher.queue;
        const current = dispatcher.current;
        const chunked = _.chunk(queue, this.container.client.config.tracksPerPage || 15);
        const pm = new PaginatedMessage();
        let looptxt = '';
        if (dispatcher.repeat === 'all') looptxt = ' • Looping the queue';
        else if (dispatcher.repeat === 'one') looptxt = ' • Looping the current track';
        if (!queue.length) {
            pm.addPageEmbed((embed) => {
                embed
                    .setAuthor({ name: `${interaction.guild.name} - Queue`, iconURL: interaction.guild.iconURL({ size: 4096 }) })
                    .setDescription(`**Now playing:**\n[${current.info.title} - ${current.info.author}](${current.info.uri}) (${current.info.requester.toString()})\n\`${this.humanizeTime(dispatcher.player.position)} ${this.container.client.util.createProgressBar(dispatcher.player.position, current.info.length, 20)} ${this.humanizeTime(current.info.length)}\`\n\n***No tracks in queue.***`)
                    .setColor(this.container.client.config.color)
                    .setFooter({ text: `${this.container.client.config.footer.text}${looptxt}` });
                return embed;
            });
        }
        let queueDuration = 0;
        for (const track of queue) {
            queueDuration += track.info.length;
        }
        for (let x = 0; x < chunked.length; x++) {
            let descriptionLines = [];
            for (let i = 0; i < chunked[x].length; i++) {
                const track = chunked[x][i];
                descriptionLines.push(`**${(i + 1) + (x * (this.container.client.config.tracksPerPage || 15))}:** [${track.info.title} - ${track.info.author}](${track.info.uri}) \`${this.humanizeTime(track.info.length)}\` (${track.info.requester.toString()})`);
            }
            pm.addPageEmbed((embed) => {
                embed
                    .setAuthor({ name: `${interaction.guild.name} - Queue`, iconURL: interaction.guild.iconURL({ size: 4096 }) })
                    .setDescription(`[${current.info.title} - ${current.info.author}](${current.info.uri}) (${current.info.requester.toString()})\n\`${this.humanizeTime(dispatcher.player.position)} ${this.container.client.util.createProgressBar(dispatcher.player.position, current.info.length, 20)} ${this.humanizeTime(current.info.length)}\`\n\n` + descriptionLines.join('\n'))
                    .setColor(this.container.client.config.color)
                    .setFooter({ text: queue.length > 500 ? `Showing up to 500 of ${queue.length} total tracks in queue (${this.humanizeTime(queueDuration)})${looptxt}` : `${queue.length} tracks in queue (${this.humanizeTime(queueDuration)})${looptxt}`});
                return embed;
            });
        }
        pm.run(interaction);
    }

    humanizeTime(ms) {
        return prettyms(ms, { colonNotation: true, secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 });
    }
}
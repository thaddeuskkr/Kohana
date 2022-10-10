import { Command } from '@sapphire/framework';

export class PlayCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'play',
            description: 'Plays music from the multiple supported sources.',
            preconditions: ['voice', 'sameVoice']
        });
    }
    
    static checkURL(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDMPermission(false)
                .addStringOption((option) => 
                    option
                        .setName('query')
                        .setDescription('What would you like to search? Supports URLs from many sources and search queries from 3 sources.')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('source')
                        .setDescription('Where would you like to search for music from? (Defaults to YouTube Music)')
                        .setRequired(false)
                        .addChoices(
                            { name: 'YouTube Music', value: 'ytmsearch' },
                            { name: 'YouTube', value: 'ytsearch' },
                            { name: 'SoundCloud', value: 'scsearch' }
                        )
                )
                .addBooleanOption((option) => 
                    option
                        .setName('next')
                        .setDescription('Whether to add the track to the top of the queue. If not specified or false, adds to the end.')
                        .setRequired(false)
                )
        );
    }
    
    async chatInputRun(interaction) {
        await interaction.deferReply();
        const query = interaction.options.getString('query');
        const source = interaction.options.getString('source') || 'ytmsearch';
        const next = interaction.options.getBoolean('next') || false;
        const node = this.container.client.shoukaku.getNode();
        const channel = interaction.guild?.voiceStates?.cache?.get(interaction.user.id)?.channel;
        if (!channel) return interaction.editReply({ embeds: [this.container.client.util.errorEmbed('You are not connected to a voice channel.')] });

        if (PlayCommand.checkURL(query)) {
            const result = await node.rest.resolve(query);
            if (!result?.tracks.length) return interaction.editReply({ embeds: [this.container.client.util.errorEmbed(`There were no results for your query \`${query}\``)] });
            const track = result.tracks.shift();
            const playlist = result.loadType === 'PLAYLIST_LOADED';
            const dispatcher = await this.container.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track, playlist ? false : next);
            if (dispatcher === 'Busy') return interaction.editReply({ embeds: [this.container.client.util.errorEmbed('The dispatcher is currently busy, please try again later.')] });
            if (playlist) {
                for (const track of result.tracks) await this.container.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track);
            }
            await interaction.editReply({ embeds: [this.container.client.util.successEmbed(playlist ? `Queued **${result.tracks.length + 1} tracks** from **${result.playlistInfo.name}**.` : `Queued [**${track.info.title}** - **${track.info.author}**](${track.info.uri}).`)] }).catch(() => null);
            if (!dispatcher?.current) dispatcher?.play();
            return;
        }

        const search = await node.rest.resolve(`${source}:${query}`);
        if (!search?.tracks.length) return interaction.editReply({ embeds: [this.container.client.util.errorEmbed(`There were no results for your query \`${query}\``)] });
        const track = search.tracks.shift();
        const dispatcher = await this.container.client.queue.handle(interaction.guild, interaction.member, interaction.channel, node, track, next);
        if (dispatcher === 'Busy') return interaction.editReply({ embeds: [this.container.client.util.errorEmbed('The dispatcher is currently busy, please try again later.')] });
        await interaction.editReply({ embeds: [this.container.client.util.successEmbed(`Queued [**${track.info.title}** - **${track.info.author}**](${track.info.uri}).`)] }).catch(() => null);
        if (!dispatcher?.current) dispatcher?.play();
    }
}
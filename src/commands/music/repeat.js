import { Command } from '@sapphire/framework';

export class RepeatCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'repeat',
            description: 'Turns on or off repeat for the current track or the entire queue.',
            preconditions: ['voice', 'sameVoice', 'dispatcher']
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDMPermission(false)
                .addStringOption((option) => 
                    option
                        .setName('mode')
                        .setDescription('Whether to repeat the queue, or only the currently playing track, or to disable repeat.')
                        .setRequired(true)
                        .addChoices(
                            { name: 'one (Currently playing track)', value: 'one' },
                            { name: 'all (The whole queue)', value: 'all' },
                            { name: 'off (Disabled)', value: 'off' }
                        )
                )
        );
    }
    
    async chatInputRun(interaction) {
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        const mode = interaction.options.getString('mode');
        let text = '';
        switch(mode) {
        case 'one':
            text = 'Now repeating the currently playing track.';
            break;
        case 'all':
            if (!dispatcher.queue.length) {
                return interaction.reply({ embeds: [this.container.client.util.errorEmbed('There are no tracks in queue.')] });
            }
            text = 'Now repeating the whole queue.';
            break;
        case 'off':
            text = 'Disabled repeat.';
            break;
        default:
            return interaction.reply({ embeds: [this.container.client.util.errorEmbed('Unrecognised option.')] }); 
        }
        dispatcher.repeat = mode;
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(text)] });
    }
}

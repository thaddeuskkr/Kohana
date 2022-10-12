import { Command } from '@sapphire/framework';

export class SkipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'skip',
            description: 'Skips the currently playing track.',
            preconditions: ['voice', 'sameVoice', 'dispatcher']
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
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Skipped ${dispatcher.repeat === 'all' ? 'and removed ' : ''}**${dispatcher.current.info.title}** - **${dispatcher.current.info.author}**${dispatcher.repeat === 'one' ? ' and turned off track repeat' : ''}${dispatcher.repeat === 'all' ? ' from the queue' : ''}.`)] });
        if (dispatcher.repeat === 'one') dispatcher.repeat = 'off';
        if (dispatcher.repeat === 'all') {
            dispatcher.repeat = 'off';
            await dispatcher.player.stopTrack();
            dispatcher.repeat = 'all';
            return;
        } else {
            dispatcher.player.stopTrack();
        }
    }
}
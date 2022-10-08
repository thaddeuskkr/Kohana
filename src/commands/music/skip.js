import { Command } from '@sapphire/framework';

export class SkipCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'skip',
            description: 'Skips the currently playing track.',
            preconditions: ['sameVoice', 'voice', 'dispatcher']
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
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Skipped **${dispatcher.queue.current.info.title}** - **${dispatcher.queue.current.info.author}**.`)] });
        dispatcher.player.stopTrack();
    }
}
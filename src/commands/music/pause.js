import { Command } from '@sapphire/framework';

export class PauseCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'pause',
            description: 'Pauses the currently playing track.',
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
        if (dispatcher.player.paused === true) return interaction.reply({ embeds: [this.container.client.util.errorEmbed(`**${dispatcher.current.info.title}** - **${dispatcher.current.info.author}** is already paused.`)] });
        await dispatcher.player.setPaused(true);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Paused **${dispatcher.current.info.title}** - **${dispatcher.current.info.author}**.`)] });
    }
}
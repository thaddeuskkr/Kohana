import { Command } from '@sapphire/framework';

export class ResumeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'resume',
            description: 'Resumes the currently paused track, if any.',
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
        if (!dispatcher.player.paused) return interaction.reply({ embeds: [this.container.client.util.errorEmbed(`**${dispatcher.current.info.title}** - **${dispatcher.current.info.author}** is not paused.`)] });
        await dispatcher.player.setPaused(false);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Resumed **${dispatcher.current.info.title}** - **${dispatcher.current.info.author}**.`)] });
    }
}
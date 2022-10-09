import { Command } from '@sapphire/framework';

export class ClearCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'clear',
            description: 'Clears the queue.',
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
        if (!dispatcher.queue.length) return interaction.reply({ embeds: [this.container.client.util.errorEmbed('There are no tracks in the queue.')] });
        dispatcher.queue.length = 0;
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Cleared **${dispatcher.queue.length} tracks**.`)] });
    }
}
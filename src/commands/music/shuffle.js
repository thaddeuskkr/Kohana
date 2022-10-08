import { Command } from '@sapphire/framework';

export class ShuffleCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'shuffle',
            description: 'Shuffles the queue.',
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
        if (!dispatcher.queue.length) return interaction.reply({ embeds: [this.container.client.util.errorEmbed('There are no tracks in the queue.')] });
        dispatcher.queue = dispatcher.queue.sort(() => Math.random() - 0.5);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Shuffled **${dispatcher.queue.length} tracks**.`)] });
    }
}
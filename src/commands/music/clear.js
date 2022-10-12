import { Command } from '@sapphire/framework';

export class ClearCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'clear',
            description: 'Clears the queue.',
            preconditions: ['voice', 'sameVoice', 'dispatcher', 'queue']
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
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Cleared **${dispatcher.queue.length} tracks**.`)] });
        dispatcher.queue.length = 0;
    }
}
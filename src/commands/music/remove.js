import { Command } from '@sapphire/framework';

export class RemoveCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'remove',
            description: 'Removes a certain track from the queue.',
            preconditions: ['voice', 'sameVoice', 'dispatcher', 'queue']
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDMPermission(false)
                .addIntegerOption((option) =>
                    option
                        .setName('index')
                        .setDescription('Index of the track that you want to remove.')
                        .setRequired(true)
                )
        );
    }
    
    async chatInputRun(interaction) {
        const index = interaction.options.getInteger('index');
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        if (index < 1 || index > dispatcher.queue.length) return interaction.reply({ embeds: [this.container.client.util.errorEmbed(`Invalid queue index (accepts **1** to **${dispatcher.queue.length}**).`)] });
        const track = dispatcher.queue.splice(index - 1, 1)[0];
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Removed **${track.info.title}** - **${track.info.author}** from the queue.`)] });
    }
}
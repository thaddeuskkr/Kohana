import { Command } from '@sapphire/framework';

export class StopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'stop',
            description: 'Stops the music in your server.',
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
        await interaction.deferReply();
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        dispatcher.queue.length = 0;
        dispatcher.repeat = 'off';
        dispatcher.stopped = true;
        dispatcher.player.stopTrack();
        await interaction.editReply({ embeds: [this.container.client.util.successEmbed('Stopped the player and cleared the queue.')] });
    }
}
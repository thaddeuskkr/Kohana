import { Command } from '@sapphire/framework';
import { promisify } from 'util';
const Wait = promisify(setTimeout);

export class StopCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'stop',
            description: 'Stops the music in your server.',
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
        await interaction.deferReply();
        dispatcher.queue.length = 0;
        dispatcher.repeat = 'off';
        dispatcher.stopped = true;
        dispatcher.player.stopTrack();
        Wait(500);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed('Stopped the player and cled the queue.')] });
    }
}
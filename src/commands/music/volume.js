import { Command } from '@sapphire/framework';

export class VolumeCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'volume',
            description: 'Changes the volume of the player.',
            preconditions: ['voice', 'sameVoice', 'dispatcher']
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
                        .setName('new-volume')
                        .setDescription('Sets the new volume of the player (%), accepts an integer between 0 and 200.')
                        .setRequired(false)
                )
        );
    }
    
    async chatInputRun(interaction) {
        const dispatcher = this.container.client.queue.get(interaction.guildId);
        const nv = interaction.options.getInteger('new-volume');
        if (!nv) return interaction.reply({ embeds: [this.container.client.util.embed(`The current volume is **${dispatcher.player.filters.volume * 100}%**.`)] });
        if (!VolumeCommand.inRange(nv, this.container.client.config.minVol || 0, this.container.client.config.maxVol || 200)) {
            return interaction.reply({ embeds: [this.container.client.util.errorEmbed(`Out of volume range (**${this.container.client.config.minVol}%** to **${this.container.client.config.maxVol}%**)`)] });
        }
        dispatcher.player.setVolume(nv / 100);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Volume set to ${nv}%.`)] });
    }

    static inRange(x, min, max) {
        return (x - min) * ( x - max) <= 0;
    }
}
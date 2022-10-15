import { MessageEmbed } from 'discord.js';
import { container } from '@sapphire/framework';

export default class Util {
    static embed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`${str}`)
                .setColor(container.client.config.color || 'RANDOM');
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.color || 'RANDOM');
    }
    static errorEmbed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`${container.client.config.emojis.error} ${str}`)
                .setColor(container.client.config.errorColor || 'RED');
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.errorColor || 'RED');
    }
    static successEmbed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`${container.client.config.emojis.success} ${str}`)
                .setColor(container.client.config.successColor || 'GREEN');
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.successColor || 'GREEN');
    }
    static createProgressBar(current, end, size) {
        if (isNaN(current) || isNaN(end)) return 'Arguments current and end have to be integers.';
        const percentage = current / end;
        const progress = Math.round(size * percentage);
        const emptyProgress = size - progress;

        const progressText = '▇'.repeat(progress);
        const emptyProgressText = '—'.repeat(emptyProgress);

        return `[${progressText}${emptyProgressText}]`;
    }
}

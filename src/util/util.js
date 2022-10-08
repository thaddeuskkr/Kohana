import { MessageEmbed } from 'discord.js';
import { container } from '@sapphire/framework';

export default class Util {
    static embed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`${str}`)
                .setColor(container.client.config.color);
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.color);
    }
    static errorEmbed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`<a:red:1028261185918865408> ${str}`)
                .setColor(container.client.config.errorColor);
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.errorColor);
    }
    static successEmbed(str) {
        if (str) {
            return new MessageEmbed()
                .setDescription(`<a:green:1009497462978924604> ${str}`)
                .setColor(container.client.config.successColor);
        }
        return new MessageEmbed()
            .setFooter(container.client.config.footer)
            .setColor(container.client.config.successColor);
    }
}
import { Command } from '@sapphire/framework';
import { ApplicationCommandType } from 'discord-api-types/v9';
import { GuildMember } from 'discord.js';

export class KickCommand extends Command {
    constructor(context, options) {
        super(context, {
            ...options,
            name: 'kick',
            description: 'Kicks the specified user.',
            preconditions: [],
            requiredClientPermissions: ['KICK_MEMBERS'],
            requiredUserPermissions: ['KICK_MEMBERS']
        });
    }

    registerApplicationCommands(registry) {
        registry.registerChatInputCommand((builder) => 
            builder
                .setName(this.name)
                .setDescription(this.description)
                .setDMPermission(false)
                .addUserOption((option) => 
                    option
                        .setName('member')
                        .setDescription('Who would you like to kick?')
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName('reason')
                        .setDescription('Please provide a reason for kicking this user.')
                        .setRequired(false)
                )
        );
        registry.registerContextMenuCommand((builder) =>
            builder
                .setName(this.name)
                .setType(ApplicationCommandType.User)
        );
    }
    
    async chatInputRun(interaction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('member');
        const member = interaction.guild.members.cache.get(user.id);
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        await this.kickMember(member, reason);
        await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Kicked **<@${member.id}>**. | \`${reason}\``)] });
    }
    async contextMenuRun(interaction) {
        if (interaction.isUserContextMenu() && interaction.targetMember instanceof GuildMember) {
            await this.kickMember(interaction.targetMember, 'Kicked using context menu - reason cannot be provided.');
            await interaction.reply({ embeds: [this.container.client.util.successEmbed(`Kicked **<@${interaction.targetMember.id}>**.`)] });
        }
    }

    async kickMember(member, reason) {
        await member.kick(reason);
    }
}

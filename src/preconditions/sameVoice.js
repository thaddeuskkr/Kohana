import { Precondition } from '@sapphire/framework';

export class SameVoicePrecondition extends Precondition {
    constructor(context, options) {
        super(context, {
            ...options,
            enabled: true,
            name: 'sameVoice'
        });
    }
    async chatInputRun(interaction) {
        return this.checkInSameVc(interaction.member, interaction.guild.me);
    }

    async checkInSameVc(member, me) {
        if (me.voice.channelId === null) return this.ok();
        return member.voice.channel.id === me.voice.channel.id ? this.ok() : this.error({ message: `Join <#${me.voice.channel.id}> before executing this command.` });
    }
}
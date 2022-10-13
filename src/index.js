import { LogLevel, SapphireClient, container } from '@sapphire/framework';
import { Shoukaku, Connectors } from 'shoukaku';
import { Intents } from 'discord.js';
import { AutoPoster } from 'topgg-autoposter';
import Keyv from 'keyv';

import { Queue } from './util/queue.js';
import config from './config.js';
import Util from './util/util.js';

import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-hmr/register';

const client = new SapphireClient({ 
    intents: [
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_SCHEDULED_EVENTS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.MESSAGE_CONTENT
    ],
    partials: [
        'CHANNEL'
    ],
    logger: {
        level: process.env.NODE_ENV === 'development' ? LogLevel.Debug : LogLevel.Info
    }
});

client.config = config;
client.shoukaku = new Shoukaku(new Connectors.DiscordJS(client), client.config.lavalink, {
    userAgent: `Kohana-v${client.config.version}`,
    reconnectTries: 100
});
client.util = Util;
client.queue = new Queue(client);
client.ap = AutoPoster(client.config.dbl, client);
client.db = new Keyv(client.config.db, { collection: 'kohana-db1' });

process.on('unhandledRejection', (error) => {
    container.logger.error(error);
});

client.login(client.config.token);
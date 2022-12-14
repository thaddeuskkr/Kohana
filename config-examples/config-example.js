import * as dotenv from 'dotenv';
import { createRequire } from 'module';
dotenv.config();
const require = createRequire(import.meta.url);
const { version } = require('../package.json');

export default {
    version,
    // Discord bot token (Obtained from https://discord.com/developers/applications)
    token: '' || process.env.TOKEN,
    // Discord bot client ID and secret (Obtained from https://discord.com/developers/applications) 
    clientId: '' || process.env.CLIENT_ID, // Optional
    clientSecret: '' || process.env.CLIENT_SECRET, // Optional
    // Database URL (MongoDB recommended, others require extra setup)
    db: '' || process.env.DB,
    // Lavalink nodes
    lavalink: [
        {
            name: '' || process.env.LAVALINK_NAME,
            url: '' || process.env.LAVALINK_URL,
            auth: '' || process.env.LAVALINK_AUTH
        }
    ],
    // top.gg token (Discord Bot List)
    dbl: '' || process.env.DBL,
    // Array of owner IDs
    ownerIds: ['275830234262142978'],
    // Queue options (defaults to 10)
    tracksPerPage: 20,
    defaultVolume: 75, // %
    minVol: 0,
    maxVol: 200,
    // Emotes
    emojis: {
        error: '<a:red:1028261185918865408>',
        success: '<a:green:1009497462978924604>',
        playing: '<a:playing:1028255145814933514>'
    },
    // Default embed options
    color: '#e7d1ff',
    errorColor: 'RED',
    successColor: 'GREEN',
    footer: { text: `Kohana • v${version}`, iconURL: 'https://i.imgur.com/oAqF63j.png' },
    // Bot presence
    status: 'dnd',
    activityRotateDelay: 30,
    activities: [ // Rotates from top down, every {activityRotateDelay} seconds.
        { name: `/ • v${version}`, type: 'LISTENING' }
    ]
};

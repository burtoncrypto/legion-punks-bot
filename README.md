# Legion Punks Bot
Legion punks sales and listings bot. Sales get posted to Discord and Twitter and Listings to Discord only.

## Setup
When running not in production the app will pull env vars from a .env file. In production (NODE_ENV=production) it is expected that env vars are passed to the process.

Required env vars:
- DISCORD_BOT_TOKEN
- DISCORD_CHANNEL_ID_LISTINGS
- DISCORD_CHANNEL_ID_SALES
- TWITTER_API_KEY
- TWITTER_API_SECRET
- TWITTER_ACCESS_TOKEN
- TWITTER_ACCESS_SECRET

Optional env vars:
- DISCORD_GUILD_ID

DISCORD_GUILD_ID can be used in development to allow slash commands to be instantly available.
## Slash commands
- /floor
- /last_listed
- /last_sold

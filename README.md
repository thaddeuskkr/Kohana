![Kohana (2)](https://user-images.githubusercontent.com/49682825/195895335-b74190eb-b04a-4edb-8921-da8fa703219e.png)
<p align="center">
Kohana is a clean, feature-rich Discord bot. Made with Node.js, utilises the <strong>Sapphire Framework</strong> and <strong>discord.js</strong> to bring you the optimal performance at a very reasonable cost - free!  
</p>  
  
### Features
- **High-quality music** (with support for multiple sources such as YouTube, Spotify, SoundCloud and more)
- **Slash commands** (easy to use and modern - we even recently implemented autocomplete!)
- **Free forever** (no vote-locked commands, no paywalls)
- **Reliable** (basically no downtime after release)
- **Actively developed** (new features are added regularly and your feedback is greatly appreciated)
- More features coming soon
  
### Links
- [Invite Kohana](https://kohana.tkkr.tk/invite)
- [Source Code](https://kohana.tkkr.tk/github)
- [top.gg (Discord Bot List)](https://top.gg/bot/998515288117096559)
- [Community / Support](https://discord.com/invite/8ZxsPYwgJ9)  
  
### Self-hosting (not recommended)
***You are highly encouraged to use the public version (invite above) since doing so helps me as well, therefore no self-hosting support will be provided. However, if you're a developer and would like to contribute, here are instructions to self-host.***  
  
**Kohana utilises Docker in production. In order to run the bot, ensure you have Docker and Docker Compose installed.**  
1. Clone the repository to your computer / server  
```sh
git clone https://github.com/thaddeuskkr/Kohana.git && cd Kohana
```  
2. Copy the configuration files to the relevant directories
```sh
cp config-examples/config-example.js src/config.js && cp config-examples/.env.example .env
```  
3. Fill in the configuration files
```sh
nano .env
nano src/config.js
```  
4. Run the bot using Docker Compose
```sh
docker compose up -d # Compose V2
```  
Do take note that edits to the bot's pieces outside of the container will still be hot-reloaded, since the filesystems are linked via a volume.

### License
Kohana is published under the GNU General Public License v3.0, which allows you to distribute, use commercially, modify and privately use the bot. However, should you choose to do so, you are to disclose the source of the code, state the changes you have made, and publish the modified code under the same license.  
```
Kohana - a modern Discord bot.
Copyright (C) 2022 : thaddeuskkr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
```

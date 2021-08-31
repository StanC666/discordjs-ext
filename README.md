<h1>discordjs-ext</h1>

A possibly useless minimal abstraction of the (discord.js)[https://github.com/discordjs/discord.js] library for making bots. Sort of Inspired by ((discord.ext).py)[https://github.com/Rapptz/discord.py/tree/master/discord/ext]
Upon further additions, seeks to replace (discord.js-commando)[https://github.com/discordjs/Commando]

<h3>Usage</h3>

```js
const { Bot, Command } = require("discordjs-ext");

const bot = new Bot("prefix", path.join(__dirname, "path/to/config.json"));

class Punch extends Command {
  constructor(bot) {
    this.name = "punch"; // default: ""
    this.description = "punch one or two users"; // default: ""
    this.usage = "!punch <user1!:UserMention> "; // default: `${prefix}punch`
    this.aliases = [ "hit" ]; // default: []
    this.nsfw = false; // default: false
    this.args = [ "u1", "u2" ]; // default: []
  }
  async execute(message, args) {
    message.channel.send(`<@${args.user1}>`);
  }
}

bot.add_command(x => new Punch(x));
bot.run();
```

<h1>discordjs-ext</h1>

A possibly useless minimal abstraction of the <a href="https://github.com/discordjs/discord.js">discord.js</a>library for making bots. 
Upon further additions, seeks to replace <a href="https://github.com/discordjs/Commando">discord.js-commando</a>

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

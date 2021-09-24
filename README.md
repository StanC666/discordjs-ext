<h1>discordjs-ext</h1>

A possibly useless minimal abstraction of the <a href="https://github.com/discordjs/discord.js">discord.js</a>library for making bots. 
Upon further additions, seeks to replace <a href="https://github.com/discordjs/Commando">discord.js-commando</a>

<h2>Installation</h2>
Once the base goals have been achieved, this library will be available for installation from `npm`.
For now though, you'll have to clone the repo. Sorry :(

<h2>Usage</h2>

```js
const { Bot, Command, Inputs, InputComponents, ReplyBuilder } = require("discordjs-ext");

const bot = new Bot({
  prefix: "!", // default: !
  token: "<my_very_secret_token>",
  applicationID: "<my_application_id on your discord.com/developers page"
});

class Punch extends Command {
  constructor(bot) {
    this.name = "punch"; // default: ""
    this.description = "punch one or two users"; // default: ""
    this.usage = "!punch <user1!:UserMention> "; // default: `${prefix}punch`
    this.aliases = [ "hit" ]; // default: []
    this.inputs = new Inputs([ // default: new Inputs([])
      {
        name: "user1",
        required: true,
        description: "A user",
        type: "USER"
      }
    ]);
    // OR
    this.inputs = new Inputs([
      new InputComponent("user1", "A user", "USER", true)
    ]);
    this.isSlashCommand = false; // default: false
  }
  async execute(ctx, args) {
    const reply = new ReplyBuilder();
    reply.setText(`${args.user1} was punched by ${ctx.mentionAuthor()}`)
    await ctx.reply(reply);
  }
}

bot.addCommand(x => new Punch(x));
bot.run();
```
<h2>Notes</h2>
TypeScript support soming soon.
const { Command, ReplyBuilder } = require("../");

class Help extends Command {
  constructor(bot) {
    super(bot);
    this.name = "help";
    this.description = "the help command";
    this.args = [ "command" ];
    this.usage = "!help <command>";
  }

  async execute(ctx, args) {
    const fields = [];
    const reply = new ReplyBuilder();
    
    this.bot.modules.forEach((v, k) => {
      fields.push({
        name: v.name,
        value: `**aliases**:\t${k.join(", ")}\n**description**:\t${v.description}\n**arguments**:\t${v.args.join(", ")}\n**usage**:\t${v.usage}\n**is slash command**:\t${v.is_slash_command ? "Yes" : "No"}`
      });
    });
    reply.addEmbeds([
      new ctx.MessageEmbed()
      .setTitle("Help")
      .setDescription("help_commands")
      .addFields(fields)
    ]);
    message.reply(reply);
  }
}

module.exports = bot => new Help(bot);
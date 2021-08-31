const { Command } = require("../");
const { Message, MessageEmbed } = require("discord.js");

class Help extends Command {
  constructor(bot) {
    super(bot);
    this.name = "help";
    this.description = "the help command";
    this.args = [ "command" ];
  }
  /**
   * 
   * @param {Message} message 
   * @param {*} args 
   */
  async execute(message, args) {
    const embeds = [];
    this.bot.modules.forEach((v, k) => {
      embeds.push({
        name: v.name,
        value: `${v.description}\n**aliases:**${k}\n**usage:**${v.usage ? v.usage : this.bot.prefix + v.name}\n**`
      });
    });

    
    message.reply({
      allowedMentions: {
        parse: [ "users", "roles" ],
        repliedUser: false
      },
      embeds: new MessageEmbed()
        .addFields(embeds)
    });
    
  }
}

module.exports = bot => new Help(bot);
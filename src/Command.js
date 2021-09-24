const Inputs = require("./Inputs");

class Command {
  constructor(bot) {
    this.bot = bot;
    this.name = "<unnamed>";
    this.description = "";
    this.aliases = [];
    this.inputs = new Inputs([]);
    this.usage = this.bot.prefix + this.name;
    this.isSlashCommand = false;
  }
  async execute(message, args) {
    await message.reply(`Command ${this.name ? this.name : "<unnamed>"} is coming soon!`);
  }
}

module.exports = Command;
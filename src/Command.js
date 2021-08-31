class Command {
  constructor(bot) {
    this.bot = bot;
    this.name = "";
    this.aliases = [];
    this.args = [];
    this.description = "";
    this.usage = this.bot.prefix + this.name;
  }
  async execute(message, args) {
    await message.reply(`Command ${this.name ? this.name : "<unnamed>"} is coming soon!`);
  }
}

module.exports = Command;
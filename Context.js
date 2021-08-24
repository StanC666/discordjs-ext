class Context {
  constructor(bot, message, args) {
    this.bot = bot;
    this.message = message;
    this.args = args;
  }
}

module.exports = Context;
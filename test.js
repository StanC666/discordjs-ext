const { Bot } = require("./");

const main = () => {
  const bot = new Bot("!", "../config.json");
  bot.run();
}

main();
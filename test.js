const { Bot } = require("./");

const main = () => {
  const bot = new Bot("t.");
  bot
  .command({
    name: "ping"
  })
  .add(async ctx => {
    ctx.message.reply("Ok")
  });

  bot.run();
}

main();
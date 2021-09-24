class ReplyBuilder {
  constructor() {
    this.allowedMentions = new Object();
    this.buttons = [];
    this.embeds = [];
    this.selectMenus = [];
    this.files = [];
    this.stickers = [];
    this.text_content = "";
  }
  
  addButtons(array_of_buttons) {
    this.buttons.push(...array_of_buttons);
    return this;
  }

  addEmbeds(embeds) {
    this.embeds.push(...embeds);
    return this;
  }

  setText(txt) {
    this.text_content = txt;
    return this;
  }

  addSelectMenus(menus) {
    this.selectMenus.push(...menus);
    return this;
  }
}

module.exports = ReplyBuilder;
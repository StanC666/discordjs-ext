const InputComponent = require("./InputComponent");

class Inputs {
  /**
   * Specify Inputs
   * @param {InputComponent[]} inputs 
   */
  constructor(inputs) {
    if (!inputs || inputs.length === 0) {
      this.inputs = [];
    }
    this.inputs = inputs;
  }
  addBooleanInput(name, description, r) {
    this.inputs.push(new InputComponent(name, description, "BOOLEAN", r));
    return this;
  }
  addStringInput(name, description, r) {
    this.inputs.push(new InputComponent(name, description, "STRING", r));
    return this;
  }
  addChannelInput(name, d, r) {
    this.inputs.push(new InputComponent(name, d, "CHANNEL", r));
    return this;
  }
  addNumberInput(n, d, r) {
    this.inputs.push(new InputComponent(n, d, "NUMBER", r));
    return this;
  }
  addUserInput(n, d, r) {
    this.inputs.push(new InputComponent(n, d, "USER"));
    return this;
  }
  addRoleInput(n, d, r) {
    this.inputs.push(new InputComponent(n, d, "ROLE", r));
    return this;
  }
  addMentionableInput(n, d, r) {
    this.inputs.push(new InputComponent(n, d, "MENTIONABLE", r));
    return this;
  }
  addIntegerInput(n, d, r) {
    this.inputs.push(new InputComponent(n, d, "INTEGER", r));
    return this;
  }
}

module.exports = Inputs;
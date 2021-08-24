class Command {
  constructor(options, fn) {
    this.options = options;
    this.fn = fn;
  }
}

module.exports = Command;
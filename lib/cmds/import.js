const fs = require('fs')
const chalk = require('chalk')

exports.command = 'import <file>'
exports.desc = 'Import a Curse/Twitch manifest.'
exports.builder = {}
exports.handler = (argv) => {
  try {
    const result = argv.updater.import(argv.file)
    argv.updater.save(argv.directory)

    if (result.imported.length > 0) console.log(chalk`{green Imported {yellow ${result.imported.length} mod(s)}.}`)
    if (result.skipped.length > 0) console.log(chalk`{cyan Skipped {yellow ${result.skipped.length} duplicate mod(s)}.}`)
  } catch (error) {
    console.error(chalk.red(error.message))
  }
}

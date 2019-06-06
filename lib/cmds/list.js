const chalk = require('chalk')

exports.command = 'list'
exports.desc = 'List installed mods.'
exports.builder = {}
exports.handler = (argv) => {
  const mods = argv.updater.getManifest().mods
  console.log(chalk`{cyan Listing {yellow ${mods.length} mod(s)}...}`)

  for (const mod of mods) {
    let space = ' '
    let idLen = (mod.id + '').length
    for (let i = 6; i > idLen; i--) space += ' '
    console.log(chalk`{blue [${mod.id}]}${space}${mod.file} {grey ${mod.fileName || '?'}}`)
  }
}

const fs = require('fs')
const readlineSync = require('readline-sync')
const {version} = require('../package.json')
const chalk = require('chalk')
const ForgeModUpdater = require('forge-mod-updater')

console.log(chalk`Forge Mod Updater CLI {magenta ${version}}`)

/* eslint-disable */
require('yargs')
  .option('directory', {
    alias: 'd',
    type: 'string'
  })
  .commandDir('cmds')
  .demandCommand()
  .help()
  .middleware(async (argv) => {
    // manipulate args and make sure manifest is loaded before commands are run
    if (!argv.directory) {
      argv.directory = argv.d = process.cwd()
    } else {
      if (!fs.existsSync(argv.directory)) fs.mkdirSync(arv.directory)
    }

    const updater = new ForgeModUpdater(argv.directory)

    const manifestExists = await updater.exists()
    if (manifestExists) {
      await updater.load()
    } else {
      console.error('Manifest not found! Please provide information to create one...')
      const gameVersion = readlineSync.question(chalk`Minecraft Version: {grey (1.16.5)} `, {
        defaultInput: '1.16.5'
      })

      await updater.init(gameVersion)
      await updater.save()
    }

    argv.updater = updater
  })
  .argv

const ProgressBar = require('progress')
const prettyBytes = require('pretty-bytes')
const chalk = require('chalk')

exports.command = 'update'
exports.desc = 'Update installed mods.'
exports.builder = {
  limit: {
    alias: 'l',
    desc: 'Limit concurrent downloads.',
    default: 10
  }
}
exports.handler = (argv) => {
  if (argv.limit <= 0) {
    console.error(chalk`{red Limit must be greater than {yellow 0}!}`)
    return
  }
  return new Promise(async (resolve) => {
    const mf = argv.updater.getManifest()

    if (!mf.mods || mf.mods.length === 0) {
      console.log(chalk`{red Manifest contains {bold.yellow no mods}.}`)
      resolve()
      return
    }

    const checkRes = await argv.updater.check()

    // nothing is out of date, exit early
    if (checkRes.updates.length === 0) {
      console.log(chalk`{cyan {bold.yellow ${checkRes.upToDate.length} mod(s)} already up to date.}`)
      resolve()
      return
    } else {
      console.log(chalk`{cyan Update required for {yellow ${checkRes.updates.length} mod(s)}.}\n`)
    }

    let bar = new ProgressBar(chalk`[:bar] {blue :percent} Preparing... {yellow (:current / :total) mod(s)} {cyan :tPretty}`, {
      total: checkRes.updates.length,
      complete: '=',
      incomplete: ' ',
      width: 30
    })

    const updater = argv.updater.update(checkRes.updates, argv.limit)
    updater
      .on('modprepared', (mod) => {
        bar.tick(1, {
          tPretty: prettyBytes(updater.totalBytes)
        })
      })
      .on('allprepared', () => {
        console.log()
        bar = new ProgressBar(chalk`[:bar] {blue :percent} Updating... {yellow (:curPretty / ${prettyBytes(updater.totalBytes)})}`, {
          total: updater.totalBytes,
          complete: '=',
          incomplete: ' ',
          width: 30
        })
      })
      .on('data', (size) => {
        bar.tick(size, {
          curPretty: prettyBytes(updater.downloadedBytes)
        })
      })
      .on('done', (err, result) => {
        if (err) throw err

        if (result.updated.length > 0) console.log(chalk`\n{green {bold.yellow ${result.updated.length} mod(s)} updated.}`)
        if (checkRes.upToDate.length > 0) console.log(chalk`{cyan {bold.yellow ${checkRes.upToDate.length} mod(s)} already up to date.}`)
        if (result.failed.length > 0) console.log(chalk`{red {bold.yellow ${result.failed.length} mod(s)} failed to download.}`)

        resolve()
      })
  })
}

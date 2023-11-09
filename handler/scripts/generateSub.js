const path = require('path');
const { existsSync } = require("original-fs");
const { getDir } = require("../../global/variables");
const { mkdirSync } = require('fs');
const globalVariables = require('../../global/variables');
const { ENGINE_GENERATE } = require('../../global/constants');
const logger = require('./logger');
const assignGlobal = require('./assignGlobal');
const handleGenerate = require('../handleGenerate');
const watcher = require('../../util/watcher');

const _directory = [
  '_include',
  '_layout',
  '_post',
  '_page',
  '_assets',
  '_config',
]

module.exports = async () => {
  watcher.clear();
  try {
    globalVariables.resetState();
    const mainDir = getDir();
    globalVariables.setButtonMenu('');
    if (!mainDir) throw 'No _dir specified';
    for (const _dir of _directory) {
      let targetDir = path.join(mainDir, _dir);
      const targetExist = existsSync(targetDir);
      if (!targetExist) mkdirSync(targetDir);
      await assignGlobal(_dir);
    }
    watcher.watch();
    handleGenerate();
  } catch (error) {
    logger.error(error);
    resetGlobal();
    watcher.clear();
  }
  const state = globalVariables.getState();
  globalVariables.getMainWindow().webContents.send(ENGINE_GENERATE, state);
}

async function resetGlobal() {
  for (const _dir of _directory) {
    console.log(_dir);
    await assignGlobal(_dir, null);
  }
}
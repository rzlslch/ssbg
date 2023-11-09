const path = require("path");
const hound = require("hound");
const { getDir, getState, setState, getMainWindow } = require("../../global/variables");
const assignGlobal = require("../../handler/scripts/assignGlobal");
const loadContent = require("../../handler/scripts/loadContent");
const logger = require("../../handler/scripts/logger");
const generateSub = require("../../handler/scripts/generateSub");
const handleGenerate = require("../../handler/handleGenerate");

let watcher;
let watcher_include;
let watcher_layout;
let watcher_post;
let watcher_page;

module.exports = {
  watch: () => {
    try {
      const mainDir = getDir();
      if (!mainDir || mainDir == "") throw "No target";
      watcher_include = hound.watch(path.join(mainDir, "_include"));
      watcher_layout = hound.watch(path.join(mainDir, "_layout"));
      watcher_post = hound.watch(path.join(mainDir, "_post"));
      watcher_page = hound.watch(path.join(mainDir, "_page"));

      watcher_include.on("create", (file) => watchFunctionCreateOrDelete(file, "create", "_include"))
      watcher_layout.on("create", (file) => watchFunctionCreateOrDelete(file, "create", "_layout"))
      watcher_post.on("create", (file) => watchFunctionCreateOrDelete(file, "create", "_post"))
      watcher_page.on("create", (file) => watchFunctionCreateOrDelete(file, "create", "_page"))

      watcher_include.on("change", (file) => watchFunctionCreateOrDelete(file, "update", "_include"))
      watcher_layout.on("change", (file) => watchFunctionCreateOrDelete(file, "update", "_layout"))
      watcher_post.on("change", (file) => watchFunctionCreateOrDelete(file, "update", "_post"))
      watcher_page.on("change", (file) => watchFunctionCreateOrDelete(file, "update", "_page"))

      watcher_include.on("delete", (file) => watchFunctionCreateOrDelete(file, "delete", "_include"))
      watcher_layout.on("delete", (file) => watchFunctionCreateOrDelete(file, "delete", "_layout"))
      watcher_post.on("delete", (file) => watchFunctionCreateOrDelete(file, "delete", "_post"))
      watcher_page.on("delete", (file) => watchFunctionCreateOrDelete(file, "delete", "_page"))
    } catch (error) {
      logger.error(error);
    }
  },
  clear: () => {
    try {
      if (watcher_include) watcher_include.clear();
      if (watcher_layout) watcher_layout.clear();
      if (watcher_post) watcher_post.clear();
      if (watcher_page) watcher_page.clear();
      if (watcher) watcher.clear();
    } catch (error) {
      logger.error(error);
    }
  }
}

async function watchFunctionCreateOrDelete(file, type, _dir) {
  // if (type === "create") watchFunctionCreate(file);
  // if (type === "delete") watchFunctionDelete(file);
  watchFunctionLogger(file, type);
  await assignGlobal(_dir);
  let content = loadContent(_dir.replace(/_/g,''));
  await handleGenerate();
  console.log("done generate");
  setState({content});
  const state = getState()
  console.log(content);
  getMainWindow().webContents.send(ENGINE_GENERATE, state);
}

function watchFunctionLogger(file, message) {
  logger.info(`${file} is ${message}d`);
}

function watchFunctionCreate(file) {
  logger.info(`${file} is created`);
}

function watchFunctionDelete(file) {
  logger.info(`${file} is deleted`);
}
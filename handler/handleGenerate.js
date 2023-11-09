const { get_post, get_page } = require("../global/variables");
const cleanBuildDir = require("./scripts/cleanBuildDir");
const generateHTML = require("./scripts/generateHTML");
const logger = require("./scripts/logger")

module.exports = async () => {
  try {
    let time_start = performance.now();
    let page = get_page();
    let post = get_post();
    let pageDir = '_page';
    let postDir = '_post';
    await cleanBuildDir();
    await generateHTML(page, pageDir);
    await generateHTML(post, postDir);
    let time_end = performance.now();
    logger.info(`generated in ${time_end - time_start}ms`);
  } catch (error) {
    logger.error(error);
  }
}
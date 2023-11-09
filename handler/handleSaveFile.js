const { writeFileSync, writeFile } = require("original-fs");
const logger = require("./scripts/logger");

module.exports = async (_, args) => {
  try {
    let filepath = args.filepath;
    let value = args.value;
    writeFile(filepath, value, (error) => {
      if (error) throw error;
      logger.info(`saved to ${filepath}`);
    })
  } catch (error) {
    logger.error(error);
  }
}
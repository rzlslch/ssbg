const { writeFile } = require("original-fs");
const logger = require("./scripts/logger");
const handleGenerate = require("./handleGenerate");

module.exports = async (_, args) => {
  try {
    let filepath = args.filepath;
    let value = args.value;
    writeFile(filepath, value, async (error) => {
      if (error) throw error;
      logger.info(`saved to ${filepath}`);
      await handleGenerate();
    })
  } catch (error) {
    logger.error(error);
  }
}
const path = require("path");
const { writeFileSync } = require("original-fs");
const { getDir } = require("../global/variables");
const logger = require("./scripts/logger");
const { existsSync } = require("fs");

module.exports = async (_, args) => {
  try {
    const dir = args.dir;
    const filename = args.filename;
    const mainDir = getDir();
    if (!mainDir || mainDir == '' || !dir || !filename) throw 'No dir/filename specfied';
    let filenameFormat;
    let config = {};
    if (dir.includes('post')) {
      let date = new Date();
      let timezone = (date.getTimezoneOffset() / -0.6);
      let timezoneString = timezone.toString().padStart(4, '0');
      let timezoneCalc = (timezone > 0 ? '+' : '-') + timezoneString;
      let fullDate = date.toISOString().split('T')[0];
      let fullTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      let formatDate = `${fullDate} ${fullTime} ${timezoneCalc}`;
      let strTitle = filename.replace(/ /g, '-');
      config.layout = 'post';
      config.title = filename;
      config.permalink = `/${strTitle}`
      config.date = formatDate;
      filenameFormat = `${fullDate}-${strTitle}.md`;
    }
    else if (dir.includes('page')) {
      config.layout = 'default';
      filenameFormat = `${filename}.md`;
    }
    else {
      filenameFormat = `${filename}.html`;
    }

    let textValue = '';
    if (Object.keys(config).length) {
      textValue += '---';
      for (const [key, value] of Object.entries(config)) {
        textValue += `\n${key}: ${value}`;
      }
      textValue += '\n---\n';
    } else {
      textValue = ' ';
    }
    let pathFile = path.join(mainDir, dir, filenameFormat);
    let existFile = existsSync(pathFile);
    if (existFile) throw 'File already existed';
    writeFileSync(pathFile, textValue);
  } catch (error) {
    logger.error(error);
  }
}
const { get_post, get_page, get_include, get_layout } = require("../../global/variables");
const logger = require("./logger");

module.exports = (args) => {
  try {
    let content = [];
    if (args == 'include') content = get_include();
    if (args == 'layout') content = get_layout();
    if (args == 'post') content = get_post();
    if (args == 'page') content = get_page();
    content = content.sort((a,b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return 0;
    })
    return content;
  } catch (error) {
    logger.error(error);
  }
}
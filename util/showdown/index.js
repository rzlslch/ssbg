const Showdown = require("showdown")

const converter = new Showdown.Converter();
converter.setOption("tables", true);
converter.setOption("parseImgDimensions", true);

module.exports = {
  converter
}
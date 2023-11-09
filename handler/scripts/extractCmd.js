module.exports = async (line, withContent = false) => {
  let status = false;
  let chainCmd = [];
  let checkPrefix = line.indexOf("{%");
  let checkSuffix = line.indexOf("%}");
  let content;
  if (checkPrefix > -1 && checkSuffix > -1) {
    status = true;
    content = line.substring(checkPrefix + 2, checkSuffix);
    chainCmd = content.trim().split(" ");
  }
  let result = {
    status, chainCmd, content: withContent ? content : undefined,
  }
  return result;
}
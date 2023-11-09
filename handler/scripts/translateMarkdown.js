const hljs = require("highlight.js");
const extractCmd = require("./extractCmd");
const { get_post } = require("../../global/variables");

const actualContentPlaceholder = "XXXXXreplaceXXXXXreplaceXXXXX";

module.exports = async (md) => {
  try {
    let mdParsed = '';
    let stopRecording = true;
    let stringCode = '';
    let formatCode = null;
    let parsedCode = [];
    for (const line of md.split("\n")) {
      let cmd = await extractCmd(line);
      let record = `${line}\n`;
      
      if (cmd.status && cmd.chainCmd[0] === 'highlight') {
        stopRecording = false;
        formatCode = cmd.chainCmd[1];
        record = '';
      }

      let string = stopRecording ? `${line}\n` : '';

      if (cmd.status && cmd.chainCmd[0] === 'endhighlight') {
        stopRecording = true;
        hljs.registerLanguage(`${formatCode}`, require(`highlight.js/lib/languages/${formatCode}`));
        let code = await hljs.highlight(stringCode, { language: formatCode }).value;
        parsedCode.push(`<pre><code class="hljs">${code}</code></pre>`);
        string = actualContentPlaceholder + "\n";
        stringCode = '';
        formatCode = null;
      }

      if (cmd.status && cmd.chainCmd[0] === 'post_url') {
        let post_url = await translatePostUrl(line);
        string = post_url.line;
      }

      if (!stopRecording) stringCode += record;
      mdParsed += string;
    }
    return {parsed:mdParsed, code:parsedCode};
  } catch (error) {
    logger.error(error);
  }
}

async function translatePostUrl(line) {
  try {
    let cmd = await extractCmd(line, true);
    let chainCmd = cmd.chainCmd;
    let status = cmd.status;
    let content = cmd.content;
    let postList = get_post();
    if (status) {
      let postFind = postList.find(e => e.filename.split(".")[0] === chainCmd[1]);
      let url;
      if (postFind?.permalink) {
        url = postFind.permalink;
      } else {
        url = postFind?.title ? postFind.title.replace(/[^\w\s]/gi, '').replace(/ /g, '-') : postFind.filename;
      }
      let parsedLine = line.replace(`{%${content}%}`, `${url}`);
      return await translatePostUrl(parsedLine);
    }
    return {line};
  } catch (error) {
    logger.error(error);
  }

}
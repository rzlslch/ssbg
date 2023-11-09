const { get_post } = require("../../global/variables");
const fileReadOfDir = require("./fileReadOfDir");

module.exports = async (post, html) => {
  // let time_start = performance.now();
  try {
    // let time_end = performance.now()
    // console.log(`${time_end - time_start}ms`);
    return await translateLine(post, html);
  } catch (error) {
    return {error};
  }
}

async function translateInclude(html) {
  let string = "";
  for (const e of html.split("\n")) {
    string += await translateCommand(e);
  }
  return string;
}

async function translateLine(content, html) {
  try {
    let post = get_post();
    post = post.map((e,i) => {
      let next = post[i-1];
      let prev = post[i+1];
      if (next) {
      let pass = JSON.parse(JSON.stringify(next));
        delete pass.prev;
        delete pass.next;
        e.next = pass;
      }
      if (prev) {
        let pass = JSON.parse(JSON.stringify(prev));
        delete pass.prev;
        delete pass.next;
        e.prev = pass;
      }
      return e;
    })
    let stringCode = "";
    stringCode += "let site = {\n";
    stringCode += "title: '@rzlslch',\n"
    stringCode += `posts: (${JSON.stringify(post)}),\n`;
    stringCode += "}\n";
    stringCode += "let page = {\n";
    for (const [key, value] of Object.entries(content)) {
      stringCode += `${key}: '${value}',\n`
    }
    stringCode += "}\n";
    stringCode += "let value = '';\n";
    for (const e of html.split("\n")) {
      let stringCommand = await translateCommand(e);
      if (stringCommand && stringCommand != '') stringCode += `${stringCommand}`;
    }
    // console.log(stringCode);
    stringCode += "return value;";
    stringCode = `function formatDate(date, fmt) {
      let date_extract = date.split(' ');
      let fmt_fulldate = date_extract[0].split('-');
      let fmt_hoursminute = date_extract[1].split(':');
      let date_ = new Date(date_extract[0]);
      date_.setHours(fmt_hoursminute[0], fmt_hoursminute[1]);
      let _Y = date_.getFullYear();
      let _y = date_.getFullYear() % 100;
      let _m = (date_.getMonth() + 1).toString().padStart(2,'0');
      let _F = date_.toLocaleString('default', { month: 'long' });
      let _d = (date_.getDate()).toString().padStart(2,'0');
      let _l = date_.toLocaleString('default', { weekday: 'long' });
      let _H = date_.getHours();
      let _M = date_.getMinutes();
      
      let convertFmt = fmt;
      convertFmt = convertFmt.replace(/%Y/g, _Y);
      convertFmt = convertFmt.replace(/%y/g, _y);
      convertFmt = convertFmt.replace(/%m/g, _m);
      convertFmt = convertFmt.replace(/%F/g, _F);
      convertFmt = convertFmt.replace(/%d/g, _d);
      convertFmt = convertFmt.replace(/%l/g, _l);
      convertFmt = convertFmt.replace(/%H/g, _H);
      convertFmt = convertFmt.replace(/%M/g, _M);
      
      return convertFmt;
    }
    (function(){${stringCode}}())`;
    let evalString = eval(stringCode);
    return evalString;
  } catch (error) {
    logger.error(error);
    return "";
  }
}

async function translateCommand(line) {
  try {
    let stringTranslate = "";
    let cmdLine = await extractCommand(line);
    if (cmdLine.status) {
      stringTranslate += cmdLine.line;
    } else {
      let fmtLine = await extractFormat(cmdLine.line);
      if (fmtLine.status) {
        stringTranslate += `value += \`${fmtLine.line}\\n\`;\n`;
      }
      else {
        stringTranslate += `value += \`${line}\\n\`;\n`;
      }
    }
    return stringTranslate;
  } catch (error) {
    logger.error(error);
    return "";
  }
}

async function extractCommand(line, iteration = 0) {
  let iterate = iteration;
  let cmdPre = "{%";
  let cmdSuf = "%}";
  let checkPrefix = line.indexOf(cmdPre);
  let checkSuffix = line.indexOf(cmdSuf);
  if (checkPrefix > -1 && checkSuffix > -1) {
    let fmtLine = (await extractFormat(line, 0, true)).line;
    let content = fmtLine.substring(checkPrefix + 2, checkSuffix);
    let stringTranslate = await translateSyntax(content);
    let replaceString = `${cmdPre}${content}${cmdSuf}`;
    let replace = fmtLine.replace(replaceString, stringTranslate);
    iterate++;
    return await extractCommand(replace, iterate);
  }
  let status = iterate > 0 ? true : false;
  // console.log(status,line);
  return {status, line};
}

async function translateSyntax(content) {
  let stringTranslate = '';
  let chainCmd = content.trim().split(" ");
  let param = [...chainCmd];
  param.shift();
  if (chainCmd[0] === "include") {
    const fileInclude = await fileReadOfDir("_include", chainCmd[1]);
    stringTranslate += await translateInclude(fileInclude);
  }
  if (chainCmd[0] === "if") {
    stringTranslate += `if (${param.join(' ')}) {`;
  }
  if (chainCmd[0] === "else") {
    stringTranslate += `} else {`;
  }
  if (chainCmd[0] === "for") {
    if (param[1] == 'in') param[1] = 'of';
    stringTranslate += `for (const ${param.join(' ')}) {`;
  }
  if (chainCmd[0] == "unless") {
    stringTranslate += `if (!${param.join(" ")}) {`;
  }
  if (chainCmd[0] == "endif"
    || chainCmd[0] == "endfor"
    || chainCmd[0] == "endunless") {
    stringTranslate += `}`
  }
  if (chainCmd[0] == "capture") {
    stringTranslate += `let ${param[0]} = `;
  }
  if (chainCmd[0] == "endcapture") {
    stringTranslate += `;`;
  }
  // console.log(stringTranslate);
  return stringTranslate;
}

async function extractFormat(line, iteration = 0, nowrapper = false) {
  let iterate = iteration;
  let checkPrefix = line.indexOf("{{");
  let checkSuffix = line.indexOf("}}");
  if (checkPrefix > -1 && checkSuffix > -1) {
    let content = line.substring(checkPrefix + 2, checkSuffix);
    let placeholder = `{{${content}}}`;
    let checkPipeIdx = content.indexOf("|");
    if (checkPipeIdx > -1) {
      let chainPipe = content.split("|");
      let pipeFmt = chainPipe[1].trim().split(":");
      if (pipeFmt[0] === 'date') {
        content = `formatDate(${chainPipe[0].trim()},${pipeFmt[1].trim()})`;
      }
    }
    content = nowrapper ? content : "${"+content+"}";
    let translate = line.replace(placeholder, content);
    iterate++;
    return extractFormat(translate, iterate, nowrapper);
  }
  let status = iterate > 0 ? true : false;
  return {status, line};
}
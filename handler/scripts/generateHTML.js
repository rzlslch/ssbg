const path = require("path");
const { get_layout, getDir, getSite } = require("../../global/variables");
const logger = require("./logger");
const processConfig = require("./processConfig");
const { converter } = require("../../util/showdown");
const translateHTML = require("./translateHTML");
const fileReadOfDir = require("./fileReadOfDir");
const { existsSync, mkdirSync, writeFileSync } = require("fs");
const translateMarkdown = require("./translateMarkdown");

const actualContentPlaceholder = "...%%...%%...%%..."

module.exports = async (listMD, _dir) => {
  let time_start = performance.now();
  try {
    for (const e of listMD) {
      let readpost = await readPost(e, _dir);
      let mdTranslate = await translateMarkdown(readpost);
      let convert = await convertMarkdown(mdTranslate.parsed);
      let render = await loadLayout(e, actualContentPlaceholder);
      let trslt = await translateHTML(e, render);
      let result = await applyContent(trslt, convert);
      let replace = await replaceCode(result, mdTranslate.code);
      await writeToPublic(e, replace);
    }
  } catch (error) {
    logger.error(error);
  }
  let time_end = performance.now();
  logger.info(`${_dir} generated in ${time_end - time_start}ms`);
}

async function readPost(content, _dir) {
  let fileRead = await fileReadOfDir(_dir, content.filename);
  return fileRead;
}

async function convertMarkdown(md) {
  let process = processConfig(md, true);
  let html = converter.makeHtml(process.value);
  html = await applyProps(html);
  return html;
}

async function applyProps(html) {
  let parsedHTML = "";
  for (const line of html.split("\n")) {
    let output = await extractProps(line);
    parsedHTML += output + "\n";
  }
  return parsedHTML;
}

async function extractProps(line) {
  let propPre = "{:";
  let propSuf = "}";
  let checkPrefix = line.indexOf(propPre);
  let checkSuffix = line.indexOf(propSuf);
  let output = line;
  if (checkPrefix > -1 && checkSuffix > -1) {
    let content = line.substring(checkPrefix+2,checkSuffix);
    let targetHTML = line.replace("<p>", "").replace("</p>", "").replace(`{:${content}}`, "");
    let targetElement1 = targetHTML.indexOf("<");
    let targetElement2 = targetHTML.indexOf(" ");
    output = targetHTML;
    if (targetElement1 > -1 && targetElement2 > -1) {
      let chainProps = content.split(" ").map(e => {
        if (e.indexOf(".") == 0) e = `class="${e.replace(".", "")}"`;
        return e;
      })
      output = [targetHTML.slice(0,targetElement2), " ", chainProps.join(" "), targetHTML.slice(targetElement2)].join("");
      return await extractProps(output);
    }
  }
  return output;
}

async function replaceCode(html, code) {
  let placeholder = "<p>XXXXXreplaceXXXXXreplaceXXXXX</p>"
  html = html.replace(placeholder, code[0]);
  code.shift();
  let checkIndex = html.indexOf(placeholder);
  if (checkIndex > -1) return replaceCode(html, code);
  return html;
}

async function writeToPublic(post, content) {
  let pathFile = ''
  let siteConfig = getSite();
  let mainDir = path.join(getDir(), siteConfig.build_dir);
  if (post.permalink) {
    let chainLink = post.permalink.split("/");
    let lastChainLink = chainLink[chainLink.length-1];
    let link = (lastChainLink === "" ? "index" : lastChainLink) + ".html";
    chainLink.pop();
    let checkPath = path.join(mainDir, ...chainLink);
    let existPath = await existsSync(checkPath);
    if (!existPath) await mkdirSync(checkPath, { recursive: true });
    pathFile = path.join(checkPath, link);
  } else {
    let checkTitle = post.title ? post.title.replace(/[^\w\s]/gi, '').replace(/ /g, '-') + ".html" : post.filename.replace(/.md/g, '') + ".html";
    pathFile = path.join(mainDir, checkTitle);
  }
  await writeFileSync(pathFile, content);
}

async function applyContent(translate, content) {
  return translate.replace(actualContentPlaceholder, content);
}

async function applyLayout(layout, target) {
  try {
    let fileRead = await fileReadOfDir("_layout", layout.filename);
    let process = processConfig(fileRead, true);
    const contentIndex = process.value.indexOf("{{ content }}");
    let result = process.value;
    if (contentIndex > -1) {
      result = result.replace("{{ content }}", target);
    }
    return result;
  } catch (error) {
    logger.error(error);
  }
}

async function loadLayout(post, rendered) {
  let layoutList = get_layout();
  let layout = layoutList.find(e => e.filename == post.layout + '.html');
  let content = await applyLayout(layout, rendered);
  if (layout.layout) return loadLayout(layout, content);
  // console.log(content);
  return content;
}
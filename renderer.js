window.electronAPI.loadState();

const set_dir_btn       = document.getElementById("set_dir_btn");
const set_dir_path      = document.getElementById("set_dir_path");

const test_btn = document.getElementById("test_btn");

set_dir_btn.addEventListener('click', async () => {
  const dirPath = await window.electronAPI.openDir();
  if (!dirPath) set_dir_path.innerText = "No Directory Selected";
  if (dirPath) set_dir_path.innerText = dirPath;
})

const btn_menu_config  = document.getElementById("btn_menu_config");
const btn_menu_layout  = document.getElementById("btn_menu_layout");
const btn_menu_include = document.getElementById("btn_menu_include");
const btn_menu_post    = document.getElementById("btn_menu_post");
const btn_menu_page    = document.getElementById("btn_menu_page");

btn_menu_config.addEventListener('click', async () => {
  await window.electronAPI.loadSomething('config');
})

btn_menu_layout.addEventListener('click', async () => {
  await window.electronAPI.loadSomething('layout');
})

btn_menu_include.addEventListener('click', async () => {
  await window.electronAPI.loadSomething('include');
})

btn_menu_post.addEventListener('click', async () => {
  await window.electronAPI.loadSomething('post');
})

btn_menu_page.addEventListener('click', async () => {
  await window.electronAPI.loadSomething('page');
})

function resetButton() {
  btn_menu_config.removeAttribute("class");
  btn_menu_layout.removeAttribute("class");
  btn_menu_include.removeAttribute("class");
  btn_menu_post.removeAttribute("class");
  btn_menu_page.removeAttribute("class");
}

function reRenderButton(type) {
  resetButton();
  if (type == 'config') btn_menu_config.setAttribute("class", "selected");
  if (type == 'layout') btn_menu_layout.setAttribute("class", "selected");
  if (type == 'include') btn_menu_include.setAttribute("class", "selected");
  if (type == 'post') btn_menu_post.setAttribute("class", "selected");
  if (type == 'page') btn_menu_page.setAttribute("class", "selected");
}

const fill_control    = document.getElementById("fill_control");
const fill_content    = document.getElementById("fill_content");
const fill_value      = document.getElementById("fill_value");
const text_value      = document.getElementById("text_value");

window.electronAPI.handleRefresh((evt, data) => {
  const state = data;
  reRenderButton();
  resetParent();

  let state_selectedButton;
  let state_selectedContent;
  let state_content;
  let state_value;
  let state_valuePath;

  if (state.selectedButton && state.selectedButton != '')   state_selectedButton  = state.selectedButton;
  if (state.selectedContent && state.selectedContent != '') state_selectedContent = state.selectedContent;
  if (state.content && state.content.length > 0)            state_content         = state.content;
  if (state.value && state.value != '')                     state_value           = state.value; 
  if (state.valuePath && state.valuePath != '')             state_valuePath       = state.valuePath;

  if (state_selectedButton) { reRenderButton(state_selectedButton); createControlButton(state_selectedButton); }
  if (state_content) createContentButton(state_content, state_selectedButton, state_selectedContent);
  if (state_value) createValueText(state_valuePath, state_value);
})

function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args) }, timeout);
  }
} 

async function textOnChange(event) {
  let filepath = event.target.getAttribute("attr-filepath");
  let value = event.target.value;
  await window.electronAPI.saveFile({filepath, value});
}

function resetParent() {
  fill_control.innerHTML = null;
  fill_content.innerHTML = null;
  text_value.removeAttribute('attr-filepath');
  text_value.value = null;
}

function createControlButton(type) {
  let list = [];
  if (type != 'index') {
    let addInput = document.createElement("input");
    addInput.setAttribute("id", `${type}_add`);
    addInput.addEventListener('keydown', async event => {
      if (event.key === 'Enter') {
        const dir = `_${type}`;
        let value = event.target.value;
        await window.electronAPI.createFile({dir:dir,filename:value});
        event.target.value = null;
      }
    })
    let addButton = document.createElement("button");
    addButton['attr-dir'] = `_${type}`;
    addButton.innerHTML = `Add ${type}`;
    addButton.addEventListener('click', async event => {
      const inputTarget = document.getElementById(`${type}_add`);
      const dir = event.srcElement['attr-dir'];
      await window.electronAPI.createFile({dir:dir, filename:inputTarget.value});
      inputTarget.value = null;
    });
    list = [addInput,addButton];
    const documentFragmentControl = document.createDocumentFragment();
    list.forEach(e => documentFragmentControl.appendChild(e));
    fill_control.appendChild(documentFragmentControl);
  }
}

function createContentButton(data, type, selectedContent = null) {
  let list = [];
  for (const e of data) {
    let contentButton = document.createElement("button");
    contentButton['attr-dir'] = `_${type}`;
    contentButton['attr-filename'] = e.filename;
    if (selectedContent && selectedContent == e.filename) contentButton.setAttribute("class", "selected");
    contentButton.innerHTML = e?.title ? e.title : e.filename;
    contentButton.addEventListener('click', async event => {
      let dir = event.srcElement['attr-dir'];
      let filename = event.srcElement['attr-filename'];
      console.log(dir,filename);
      await window.electronAPI.loadFile({dir,filename});
    })
    list.push(contentButton);
  }
  const documentFragmentContent = document.createDocumentFragment();
  list.forEach(e => documentFragmentContent.appendChild(e));
  fill_content.appendChild(documentFragmentContent);
}

function createValueText(valuePath, value) {
  let filepath = document.createAttribute("attr-filepath");
  filepath.value = valuePath;
  text_value.setAttributeNode(filepath);
  text_value.value = value;
  text_value.onkeyup = debounce(textOnChange);
}

window.electronAPI.handleLog((_, data) => {
  console.log(data);
})
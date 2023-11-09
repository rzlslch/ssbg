global.mainDir;
global._layout = [];
global._include = [];
global._post = [];
global._page = [];

global.site = {};
global.site.title = '';
global.site.email = '';
global.site.description = '';
global.site.baseurl = '';
global.site.url = '';
global.site.github_username = '';
global.site.build_dir = 'public';

global.state = {};
global.state.selectedButton = '';
global.state.content = [];
global.state.selectedContent = '';
global.state.value = '';
global.state.valuePath = '';

global.mainWindow;


module.exports = {
  getSite: () => {
    return global.site;
  },
  resetSite: () => {
    global.site = {};
    global.site.title             = '';
    global.site.email             = '';
    global.site.description       = '';
    global.site.baseurl           = '';
    global.site.url               = '';
    global.site.github_username   = '';
    global.site.build_dir         = 'public';
  },
  setSite: (site) => {
    if (site.title)            global.site.title              = site.title;
    if (site.email)            global.site.email              = site.email;
    if (site.description)      global.site.description        = site.description;
    if (site.baseurl)          global.site.baseurl            = site.baseurl;
    if (site.github_username)  global.site.github_username    = site.github_username;
    if (site.build_dir)        global.site.build_dir          = site.build_dir;
  },
  getState: () => {
    return global.state;
  },
  resetState: () => {
    global.state = {};
    global.state.selectedButton   = '';
    global.state.content          = [];
    global.state.selectedContent  = '';
    global.state.value            = '';
    global.state.valuePath        = '';
  },
  setState: (state) => {
    if (state.selectedButton)   global.state.selectedButton   = state.selectedButton;
    if (state.content)          global.state.content          = state.content;
    if (state.selectedContent)  global.state.selectedContent  = state.selectedContent;
    if (state.value)            global.state.value            = state.value;
    if (state.valuePath)        global.state.valuePath        = state.valuePath;
  },
  setMainWindow: (window) => {
    global.mainWindow = window;
  },
  getMainWindow: () => {
    return global.mainWindow;
  },
  setButtonMenu: (menu) => {
    global.buttonMenu = menu;
  },
  getButtonMenu: () => {
    return global.buttonMenu;
  },
  setDir: (dir) => {
    global.mainDir = dir; 
  },
  getDir: () => {
    return global.mainDir;
  },
  add_post: (file) => {
    global._post = postFormat([new Set([...global._post, ...file])])
  },
  set_post: (list) => {
    global._post = postFormat(list)
  },
  get_post: () => {
    return global._post;
  },
  add_layout: (file) => {
    global._layout = [new Set([...global._layout, ...file])];
  },
  set_layout: (list) => {
    global._layout = list;
  },
  get_layout: () => {
    return global._layout;
  },
  add_include: (file) => {
    global._include = [new Set([...global._include, ...file])];
  },
  set_include: (list) => {
    global._include = list;
  },
  get_include: () => {
    return global._include;
  },
  add_page: (file) => {
    global._page = [new Set([...global._page, ...file])];
  },
  set_page: (list) => {
    global._page = list;
  },
  get_page: () => {
    return global._page;
  },
}

function postFormat(list) {
  return list.sort((a,b) => {
    if (a.date > b.date) return -1;
    if (a.date < b.date) return 1;
    return 0;
  }).map(e => {
    if (e.permalink) e.url = e.permalink;
    else e.url = `/${filename}`;
    return e;
  })
}
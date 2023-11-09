const { contextBridge, ipcRenderer } = require("electron");
const { DIALOG_OPEN_DIR, ENGINE_GENERATE, MENU_LOAD_SOMETHING, MENU_LOAD_FILE, MENU_SAVE_FILE, ENGINE_LOG, MENU_LOAD_STATE, MENU_CREATE_FILE } = require("./global/constants");

contextBridge.exposeInMainWorld('electronAPI', {
  handleRefresh:    (callback)  => ipcRenderer.on(ENGINE_GENERATE, callback), 
  handleLog:        (callback)  => ipcRenderer.on(ENGINE_LOG, callback),
  openDir:          ()          => ipcRenderer.invoke(DIALOG_OPEN_DIR),
  loadState:        ()          => ipcRenderer.invoke(MENU_LOAD_STATE),
  loadSomething:    (data)      => ipcRenderer.invoke(MENU_LOAD_SOMETHING, data),
  loadFile:         (data)      => ipcRenderer.invoke(MENU_LOAD_FILE, data),
  saveFile:         (data)      => ipcRenderer.invoke(MENU_SAVE_FILE, data),
  createFile:       (data)      => ipcRenderer.invoke(MENU_CREATE_FILE, data),
})
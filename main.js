const path = require('path');
const env = process.env.NODE_ENV || 'development';

const { app, BrowserWindow, ipcMain } = require('electron');
const handleDirOpen = require('./handler/handleDirOpen');
const handleTest = require('./handler/handleTest');
const { TEST, DIALOG_OPEN_DIR, MENU_LOAD_SOMETHING, MENU_LOAD_FILE, MENU_SAVE_FILE, MENU_LOAD_STATE, MENU_CREATE_FILE } = require('./global/constants');
const { setMainWindow } = require('./global/variables');
const handleLoadSomething = require('./handler/handleLoadSomething');
const handleLoadFile = require('./handler/handleLoadFile');
const handleSaveFile = require('./handler/handleSaveFile');
const handleLoadState = require('./handler/handleLoadState');
const logger = require('./handler/scripts/logger');
const handleCreateFile = require('./handler/handleCreateFile');

if (env === 'development') {
  try {
    require('electron-reloader')(module)
  } catch (_) {
    logger.info(_);
  }
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  mainWindow.setMenu(null);
  mainWindow.loadFile('src/index.html');
  if (env === 'development') mainWindow.webContents.openDevTools();
  else mainWindow.maximize();
  setMainWindow(mainWindow);
}

app.whenReady().then(() => {
  ipcMain.handle(DIALOG_OPEN_DIR, handleDirOpen);
  ipcMain.handle(TEST, handleTest);
  ipcMain.handle(MENU_LOAD_STATE, handleLoadState);
  ipcMain.handle(MENU_LOAD_SOMETHING, handleLoadSomething);
  ipcMain.handle(MENU_LOAD_FILE, handleLoadFile);
  ipcMain.handle(MENU_SAVE_FILE, handleSaveFile);
  ipcMain.handle(MENU_CREATE_FILE, handleCreateFile);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
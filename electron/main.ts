import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { AppStorage } from "../src/types";
import Store from 'electron-store';

require("babel-polyfill");

let mainWindow: Electron.BrowserWindow | null;
const devMode = process.env.NODE_ENV === "development"

function createWindow() {
  // TODO: remove that, this is just set for now to reduce the logs at start
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = (!devMode).toString();

  mainWindow = new BrowserWindow({
    width: devMode ? 1080 : 1200,
    height: devMode ? 650 : 900,
    backgroundColor: '#2222',
    minimizable: false,
    maximizable: false,
    resizable: devMode,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  if (devMode) {
    mainWindow.loadURL(`http://localhost:4000`);
    mainWindow.webContents.openDevTools();
  } else {
    const url = `file://${__dirname}/index.html`;
    mainWindow.loadURL(url);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);
app.allowRendererProcessReuse = true;
Store.initRenderer();

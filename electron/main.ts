import { app, BrowserWindow } from "electron";
import * as path from "path";
import * as url from "url";
import { AppStorage } from "../src/types";
import Store from 'electron-store';

require("babel-polyfill");

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
  // TODO: remove that, this is just set for now to reduce the logs at start
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

  mainWindow = new BrowserWindow({
    width: process.env.NODE_ENV === "development" ? 1800 : 1100,
    height: process.env.NODE_ENV === "development" ? 1200 : 750,
    backgroundColor: '#2222',
    minimizable: false,
    maximizable: false,
    resizable: process.env.NODE_ENV === "development",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
  });

  if (process.env.NODE_ENV === "development") {
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

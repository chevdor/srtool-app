import { app, BrowserWindow } from 'electron'
import Store from 'electron-store'
require('babel-polyfill')

let mainWindow: Electron.BrowserWindow | null
const devMode = process.env.NODE_ENV === 'development'

function createWindow(): void {
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
	})

	if (devMode) {
		mainWindow.loadURL('http://localhost:4000')
		mainWindow.webContents.openDevTools()
	} else {
		const url = `file://${__dirname}/index.html`
		mainWindow.loadURL(url)
	}

	mainWindow.on('closed', () => {
		mainWindow = null
	})
}

app.on('ready', createWindow)
app.allowRendererProcessReuse = true
Store.initRenderer()

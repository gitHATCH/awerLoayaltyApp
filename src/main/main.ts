import { app, BrowserWindow, Menu, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import { join } from "node:path"

const isDev = process.env.NODE_ENV === "development"
let win: BrowserWindow | null = null

function createWindow() {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })
  Menu.setApplicationMenu(null)
  win.once("ready-to-show", () => win.show())

  if (isDev) {
    win.loadURL("http://localhost:5173") // 👈 dev con Vite
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html")) // 👈 prod
  }
}

app.whenReady().then(() => {
  createWindow()
  autoUpdater.autoDownload = false
  autoUpdater.checkForUpdates()

  ipcMain.on("start_update", () => autoUpdater.downloadUpdate())

  autoUpdater.on("update-available", () => {
    win?.webContents.send("update_available")
  })

  autoUpdater.on("download-progress", (progress) => {
    win?.webContents.send("download_progress", progress)
  })

  autoUpdater.on("update-downloaded", () => {
    win?.webContents.send("update_downloaded")
    setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 1000)
  })
})

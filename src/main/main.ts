import { app, BrowserWindow } from "electron"
import { join } from "node:path"

const isDev = process.env.NODE_ENV === "development"

function createWindow() {
  const win = new BrowserWindow({
    width: 1024, height: 768, show: false,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true, nodeIntegration: false, sandbox: true
    }
  })
  win.once("ready-to-show", () => win.show())

  if (isDev) {
    win.loadURL("http://localhost:5173")          // 👈 dev con Vite
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html")) // 👈 prod
  }
}
app.whenReady().then(createWindow)

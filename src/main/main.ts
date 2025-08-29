import { app, BrowserWindow, Menu, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import { join } from "node:path"
import { get } from "node:https"

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
  win.once("ready-to-show", () => win?.show())

  if (isDev) {
    win.loadURL("http://localhost:5173") // 👈 dev con Vite
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html")) // 👈 prod
  }
}

app.whenReady().then(() => {
  createWindow()
  autoUpdater.autoDownload = false
  checkWinUpdate()
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

function checkWinUpdate() {
  if (process.platform !== "win32") return

  const feed = process.env.BUCKET_URL
    ? `${process.env.BUCKET_URL.replace(/\/$/, "")}/win`
    : autoUpdater.getFeedURL()

  if (!isValidHttpUrl(feed)) return

  try {
    autoUpdater.setFeedURL({ provider: "generic", url: feed })
  } catch (err) {
    console.error("failed to set feed URL", err)
    return
  }

  const url = `${feed.replace(/\/$/, "")}/latest.yml`
  get(url, (res) => {
    if (res.statusCode !== 200) return
    let data = ""
    res.on("data", (d) => (data += d))
    res.on("end", () => {
      const match = data.match(/version:\s*([\d.]+)/)
      if (!match) return
      const latest = match[1].trim()
      if (isNewerVersion(app.getVersion(), latest)) {
        win?.webContents.send("update_available")
      }
    })
  }).on("error", (e) => console.error("update check failed", e))
}

function isValidHttpUrl(url?: string | null): url is string {
  if (!url) return false
  try {
    const { protocol } = new URL(url)
    return protocol === "http:" || protocol === "https:"
  } catch {
    return false
  }
}

function isNewerVersion(current: string, latest: string) {
  const c = current.split(".").map(Number)
  const l = latest.split(".").map(Number)
  for (let i = 0; i < Math.max(c.length, l.length); i++) {
    const cv = c[i] || 0
    const lv = l[i] || 0
    if (lv > cv) return true
    if (lv < cv) return false
  }
  return false
}

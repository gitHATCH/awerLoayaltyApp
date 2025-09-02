import "dotenv/config"
import { app, BrowserWindow, Menu, ipcMain } from "electron"
import { autoUpdater } from "electron-updater"
import { join } from "node:path"
import { existsSync, writeFileSync } from "node:fs"
import { get } from "node:https"

const isDev = process.env.NODE_ENV === "development"

function isUatEnv() {
  const env = (process.env.ENVIROMENT || "prod").toLowerCase()
  return env === "dev" || env === "uat"
}

function platformDir() {
  const suffix = isUatEnv() ? "-uat" : ""
  switch (process.platform) {
    case "darwin":
      return `mac${suffix}`
    case "win32":
      return `win${suffix}`
    case "linux":
    default:
      return `linux${suffix}`
  }
}
let win: BrowserWindow | null = null
let updateAvailable = false

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

  // If update was detected before renderer finished loading, notify after load
  win.webContents.on("did-finish-load", () => {
    if (updateAvailable) {
      win?.webContents.send("update_available")
    }
  })

  if (isDev) {
    win.loadURL("http://localhost:5173") // 👈 dev con Vite
  } else {
    win.loadFile(join(__dirname, "../renderer/index.html")) // 👈 prod
  }
}

app.whenReady().then(() => {
  createWindow()
  autoUpdater.autoDownload = false
  // Allow updates while running unpacked in development
  if (isDev) {
    try {
      ;(autoUpdater as any).forceDevUpdateConfig = true
      // Ensure dev-app-update.yml exists for electron-updater
      const devCfgPath = join(process.cwd(), "dev-app-update.yml")
      if (!existsSync(devCfgPath) && process.env.BUCKET_URL) {
        const feed = `${process.env.BUCKET_URL.replace(/\/$/, "")}/${platformDir()}`
        const yaml = `provider: generic\nurl: ${feed}\n`
        try {
          writeFileSync(devCfgPath, yaml, "utf8")
          console.log("Created dev-app-update.yml pointing to:", feed)
        } catch (e) {
          console.error("Failed to write dev-app-update.yml", e)
        }
      }
    } catch {}
  }
  checkWinUpdate()
  autoUpdater.checkForUpdates()

  ipcMain.handle("start_update", async () => {
    try {
      // Ensure updater has update info; re-check before downloading
      await autoUpdater.checkForUpdates()
      await autoUpdater.downloadUpdate()
      return { ok: true }
    } catch (err) {
      console.error("start_update failed", err)
      throw err
    }
  })

  autoUpdater.on("update-available", () => {
    updateAvailable = true
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

  // Allow renderer to query current update state in case it missed the event
  ipcMain.handle("get_update_state", () => updateAvailable)
  ipcMain.handle("get_app_version", () => app.getVersion())
})

function checkWinUpdate() {
  if (process.platform !== "win32") return
  
  const feed = process.env.BUCKET_URL
  ? `${process.env.BUCKET_URL.replace(/\/$/, "")}/${platformDir()}`
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
        console.log("New version!")
        updateAvailable = true
        win?.webContents.send("update_available")
        // Ensure electron-updater also recognizes the update
        autoUpdater.checkForUpdates().catch((e) =>
          console.error("autoUpdater.checkForUpdates after manual detect failed", e)
        )
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

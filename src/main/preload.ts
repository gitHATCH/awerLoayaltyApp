import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("awer", {
  ping: () => ipcRenderer.invoke("ping"),
  onUpdateAvailable: (cb: () => void) => ipcRenderer.on("update_available", () => cb()),
  onDownloadProgress: (cb: (p: { percent: number }) => void) =>
    ipcRenderer.on("download_progress", (_e, p) => cb(p)),
  onUpdateDownloaded: (cb: () => void) => ipcRenderer.on("update_downloaded", cb),
  startUpdate: () => ipcRenderer.invoke("start_update"),
  getUpdateState: () => ipcRenderer.invoke("get_update_state"),
  getVersion: () => ipcRenderer.invoke("get_app_version"),
  openExternal: (url: string) => ipcRenderer.invoke("open_external", url),
  // acá vas exponiendo funciones específicas que necesite tu UI
})

export {}

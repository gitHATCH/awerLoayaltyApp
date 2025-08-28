import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("awer", {
  ping: () => ipcRenderer.invoke("ping"),
  onUpdateAvailable: (cb: () => void) => ipcRenderer.on("update_available", cb),
  onDownloadProgress: (cb: (p: { percent: number }) => void) =>
    ipcRenderer.on("download_progress", (_e, p) => cb(p)),
  onUpdateDownloaded: (cb: () => void) => ipcRenderer.on("update_downloaded", cb),
  startUpdate: () => ipcRenderer.send("start_update"),
  // acá vas exponiendo funciones específicas que necesite tu UI
})

export {}

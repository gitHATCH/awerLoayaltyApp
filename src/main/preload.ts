import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld("awer", {
  ping: () => ipcRenderer.invoke("ping"),
  // acá vas exponiendo funciones específicas que necesite tu UI
})

export {}

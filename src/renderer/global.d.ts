export {}

declare global {
  interface Window {
    awer?: {
      ping: () => Promise<string>
      onUpdateAvailable: (cb: () => void) => void
      onDownloadProgress: (cb: (p: { percent: number }) => void) => void
      onUpdateDownloaded: (cb: () => void) => void
      startUpdate: () => Promise<unknown>
      getUpdateState: () => Promise<boolean>
      getVersion: () => Promise<string>
      openExternal: (url: string) => Promise<void>
    }
  }
}


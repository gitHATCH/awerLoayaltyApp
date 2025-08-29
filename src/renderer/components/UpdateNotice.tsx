import React from 'react'

const UpdateNotice: React.FC = () => {
  const [available, setAvailable] = React.useState(false)
  const [downloading, setDownloading] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    window.awer?.onUpdateAvailable(() => setAvailable(true))
    window.awer?.onDownloadProgress((p) => setProgress(p.percent))
    window.awer?.onUpdateDownloaded(() => {
      setProgress(100)
      setDownloading(false)
    })
    // Ask main for current state in case event fired earlier
    window.awer?.getUpdateState?.().then((v: boolean) => {
      if (v) setAvailable(true)
    })
  }, [])

  const start = () => {
    setDownloading(true)
    window.awer?.startUpdate()
  }

  if (!available) return null

  return (
    <div className="fixed z-50 bottom-4 right-4 w-72 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-4 rounded shadow-lg text-center space-y-2">
      {downloading ? (
        <>
          <p>Descargando actualización...</p>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${Math.round(progress)}%` }}
            />
          </div>
          <span className="text-sm">{Math.round(progress)}%</span>
        </>
      ) : (
        <>
          <p>Nueva versión disponible</p>
          <button
            onClick={start}
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Actualizar
          </button>
        </>
      )}
    </div>
  )
}

export default UpdateNotice


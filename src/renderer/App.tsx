import React from "react"

declare global {
  interface Window {
    awer: {
      ping: () => Promise<string>
    }
  }
}

export default function App() {
  const [msg, setMsg] = React.useState("...")

  const handlePing = async () => {
    const res = await window.awer.ping()
    setMsg(res)
  }

  return (
    <div style={{ padding: 24, fontFamily: "Inter, system-ui, Arial" }}>
      <h1>Awer Desktop 🖥️</h1>
      <p>Stack pro con Electron + React + TS + Vite</p>
      <button onClick={handlePing}>Probar IPC</button>
      <p>Respuesta: {msg}</p>
    </div>
  )
}

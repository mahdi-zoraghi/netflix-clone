import React, { useState } from "react"
import ReactDOM from "react-dom"

import App from "./App"

import darkModeContext from "./context/darkModeContext"

import "./index.scss"

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <darkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </darkModeContext.Provider>
  )
}

ReactDOM.render(
  <ThemeProvider>
    <App />
  </ThemeProvider>,
  document.getElementById("root")
)

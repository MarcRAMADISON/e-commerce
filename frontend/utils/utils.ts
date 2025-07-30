import { createTheme } from "@mui/material"
import { createContext, useCallback } from "react"
import { articleObject } from "../interfaces"

export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key)
}

export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

export const UserContext = createContext({ articlesContext: [], setArticleContext: (prev) => { } });

export const theme = createTheme({
  palette: {
    primary: {
      main: '#1E2460',
      contrastText: '#fff'
    },
    secondary: {
      main: '#025669',
      contrastText: '#fff'
    },
    error: {
      main: '#FF4c84',
      contrastText: '#fff'
    }
  }
})
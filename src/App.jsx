import { useState, useEffect } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [apiMessage, setApiMessage] = useState(null)

  useEffect(() => {
    const url = 'http://localhost:3000/api/hello'
    fetch(url)
      .then((res) => res.json())
      .then((data) => setApiMessage(data?.message ?? null))
      .catch(() => setApiMessage('Error fetching'))
  }, [])

  return (
    <>
      
          <p>Backend message: {apiMessage ?? 'loading...'}</p>
          </>)
}

export default App



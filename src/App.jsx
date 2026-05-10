import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Absensi from './pages/Absensi'
import Izin from './pages/Izin'
import Riwayat from './pages/Riwayat'

function App() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main style={{
          flex: 1,
          marginLeft: collapsed ? '68px' : '240px',
          transition: 'margin-left 0.3s cubic-bezier(.4,0,.2,1)',
          minHeight: '100vh',
          background: '#f1f5f9',
        }}>
          <Routes>
            <Route path="/" element={<Absensi />} />
            <Route path="/izin" element={<Izin />} />
            <Route path="/riwayat" element={<Riwayat />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Absensi from './pages/Absensi'
import Izin from './pages/Izin'
import Riwayat from './pages/Riwayat'
import Navbar from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Absensi />} />
        <Route path="/izin" element={<Izin />} />
        <Route path="/riwayat" element={<Riwayat />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
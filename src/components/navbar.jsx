import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  const navStyle = {
    display: 'flex', gap: '8px', padding: '12px 16px',
    background: '#fff', borderBottom: '1px solid #e5e7eb',
    position: 'sticky', top: 0, zIndex: 100
  }
  const btnStyle = (path) => ({
    flex: 1, padding: '10px', border: '1px solid #e5e7eb',
    borderRadius: '8px', textDecoration: 'none', textAlign: 'center',
    fontSize: '13px', fontWeight: pathname === path ? '600' : '400',
    background: pathname === path ? '#eff6ff' : '#fff',
    color: pathname === path ? '#2563eb' : '#6b7280',
    borderColor: pathname === path ? '#bfdbfe' : '#e5e7eb'
  })

  return (
    <nav style={navStyle}>
      <Link to="/" style={btnStyle('/')}>Absensi</Link>
      <Link to="/izin" style={btnStyle('/izin')}>Pengajuan Izin</Link>
      <Link to="/riwayat" style={btnStyle('/riwayat')}>Riwayat</Link>
    </nav>
  )
}
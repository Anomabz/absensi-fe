import { Link, useLocation } from 'react-router-dom'
import { ClipboardCheck, FileText, History, ChevronLeft, ChevronRight, Fingerprint } from 'lucide-react'

const menu = [
  { path: '/', label: 'Absensi', icon: ClipboardCheck, desc: 'Catat kehadiran' },
  { path: '/izin', label: 'Pengajuan Izin', icon: FileText, desc: 'Sakit / cuti' },
  { path: '/riwayat', label: 'Riwayat', icon: History, desc: 'Lihat history' },
]

export default function Sidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation()

  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200,
      width: collapsed ? '68px' : '240px',
      background: '#0f172a',
      transition: 'width 0.3s cubic-bezier(.4,0,.2,1)',
      display: 'flex', flexDirection: 'column',
      boxShadow: '2px 0 24px rgba(0,0,0,0.12)',
      overflow: 'hidden'
    }}>

      {/* Logo area */}
      <div style={{
        padding: collapsed ? '24px 0' : '24px 20px',
        display: 'flex', alignItems: 'center', gap: '12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderBottom: '1px solid #1e293b',
        minHeight: '76px', flexShrink: 0
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99,102,241,0.4)'
        }}>
          <Fingerprint size={19} color="#fff" />
        </div>
        {!collapsed && (
          <div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', letterSpacing: '-0.01em' }}>SiAbsen</div>
            <div style={{ fontSize: '10px', color: '#475569', marginTop: '1px' }}>Sistem Absensi Pegawai</div>
          </div>
        )}
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {!collapsed && (
          <div style={{ fontSize: '10px', fontWeight: '600', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 10px 10px' }}>
            Navigasi
          </div>
        )}
        {menu.map(({ path, label, desc, icon: Icon }) => {
          const active = pathname === path
          return (
            <Link key={path} to={path} title={collapsed ? label : ''} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              padding: collapsed ? '13px 0' : '11px 12px',
              borderRadius: '10px', textDecoration: 'none',
              background: active ? 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))' : 'transparent',
              border: `1px solid ${active ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
              transition: 'all 0.15s',
              position: 'relative', overflow: 'hidden'
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#1e293b' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
            >
              {active && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: '3px', background: 'linear-gradient(to bottom, #6366f1, #8b5cf6)', borderRadius: '0 4px 4px 0' }} />}
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: active ? 'rgba(99,102,241,0.25)' : 'rgba(255,255,255,0.04)',
              }}>
                <Icon size={16} color={active ? '#a5b4fc' : '#64748b'} />
              </div>
              {!collapsed && (
                <div>
                  <div style={{ fontSize: '13px', fontWeight: active ? '600' : '500', color: active ? '#e2e8f0' : '#94a3b8', lineHeight: 1 }}>{label}</div>
                  <div style={{ fontSize: '11px', color: active ? '#6366f1' : '#334155', marginTop: '3px' }}>{desc}</div>
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Tanggal & waktu */}
      {!collapsed && (
        <div style={{ margin: '0 10px 10px', padding: '12px 14px', background: '#1e293b', borderRadius: '10px', border: '1px solid #263045' }}>
          <div style={{ fontSize: '11px', color: '#475569', marginBottom: '3px' }}>Hari ini</div>
          <div style={{ fontSize: '13px', fontWeight: '600', color: '#e2e8f0' }}>
            {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div style={{ fontSize: '12px', color: '#6366f1', marginTop: '2px' }}>
            {new Date().toLocaleDateString('id-ID', { year: 'numeric' })}
          </div>
        </div>
      )}

      {/* Collapse button */}
      <div style={{ padding: '10px', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
        <button onClick={() => setCollapsed(!collapsed)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between',
          padding: '10px 12px', borderRadius: '9px', border: '1px solid #1e293b',
          cursor: 'pointer', background: '#1e293b', color: '#475569',
          fontSize: '12px', transition: 'all 0.15s'
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#263045'; e.currentTarget.style.color = '#94a3b8' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#1e293b'; e.currentTarget.style.color = '#475569' }}
        >
          {!collapsed && <span>Collapse</span>}
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>
    </aside>
  )
}
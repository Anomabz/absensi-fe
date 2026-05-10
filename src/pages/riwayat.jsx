import { History, Clock, FileText } from 'lucide-react'

export default function Riwayat() {
  return (
    <div style={{ maxWidth: '820px', padding: '28px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>Riwayat</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>History absensi dan pengajuan izin</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { icon: Clock, title: 'Riwayat Absensi', desc: 'Akan tampil setelah backend tersambung', color: '#eef2ff', iconColor: '#6366f1' },
          { icon: FileText, title: 'Riwayat Izin', desc: 'Akan tampil setelah backend tersambung', color: '#f0fdf4', iconColor: '#22c55e' },
        ].map((item, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <item.icon size={24} color={item.iconColor} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '6px' }}>{item.title}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
import { useState } from 'react'
import { getPegawaiByNIM, submitIzin } from '../services/api'
import { Search, CheckCircle, XCircle, Upload, Send, Calendar, FileText } from 'lucide-react'

const jenisIzin = [
  { val: 'sakit', label: 'Sakit', emoji: '🤒', color: '#fef2f2', border: '#fecaca', text: '#dc2626' },
  { val: 'cuti', label: 'Cuti', emoji: '🏖️', color: '#eff6ff', border: '#bfdbfe', text: '#2563eb' },
  { val: 'keperluan_pribadi', label: 'Pribadi', emoji: '🏠', color: '#fefce8', border: '#fef08a', text: '#ca8a04' },
  { val: 'lainnya', label: 'Lainnya', emoji: '📝', color: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
]

export default function Izin() {
  const today = new Date().toISOString().split('T')[0]
  const [nim, setNim] = useState('')
  const [pegawai, setPegawai] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ jenis: '', mulai: today, selesai: today, keterangan: '' })
  const [buktiURL, setBuktiURL] = useState(null)
  const [buktiFile, setBuktiFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sukses, setSukses] = useState(false)

  const cekNIM = async (val) => {
    setNim(val)
    if (val.length < 3) { setPegawai(null); setNotFound(false); return }
    const result = await getPegawaiByNIM(val)
    if (result) { setPegawai(result); setNotFound(false) }
    else { setPegawai(null); setNotFound(true) }
  }

  const pilisBukti = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setBuktiFile(file); setBuktiURL(URL.createObjectURL(file))
  }

  const kirim = async () => {
    if (!pegawai) return alert('NIM tidak valid')
    if (!form.jenis) return alert('Pilih jenis izin dulu')
    if (!form.keterangan) return alert('Isi keterangan dulu')
    setLoading(true)
    const fd = new FormData()
    fd.append('nim', nim)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (buktiFile) fd.append('bukti_foto', buktiFile)
    await submitIzin(fd)
    setSukses(true)
    setTimeout(() => {
      setSukses(false)
      setNim(''); setPegawai(null)
      setForm({ jenis: '', mulai: today, selesai: today, keterangan: '' })
      setBuktiURL(null); setBuktiFile(null)
    }, 3000)
    setLoading(false)
  }

  const input = { width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', outline: 'none' }

  if (sukses) return (
    <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' }}>
          <CheckCircle size={30} color="#fff" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Izin Terkirim!</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{pegawai?.nama}</p>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>Pengajuan {form.jenis} berhasil dikirim</p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '820px', padding: '28px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>Pengajuan Izin</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px' }}>Sakit, cuti, atau keperluan pribadi</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>

        {/* Kiri */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* NIM */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Data Pegawai</div>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input style={{ ...input, paddingLeft: '36px' }} placeholder="Masukkan NIM..." value={nim} onChange={e => cekNIM(e.target.value)} />
            </div>
            {pegawai && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
                  {pegawai.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d' }}>{pegawai.nama}</div>
                  <div style={{ fontSize: '11px', color: '#86efac' }}>NIM {nim}</div>
                </div>
                <CheckCircle size={16} color="#22c55e" />
              </div>
            )}
            {notFound && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#fef2f2', borderRadius: '10px', border: '1px solid #fecaca' }}>
                <XCircle size={15} color="#ef4444" />
                <span style={{ fontSize: '13px', color: '#dc2626' }}>NIM tidak ditemukan</span>
              </div>
            )}
          </div>

          {/* Jenis */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Jenis Izin</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {jenisIzin.map(j => (
                <button key={j.val} onClick={() => setForm({ ...form, jenis: j.val })} style={{
                  padding: '12px 8px', borderRadius: '10px', border: '1.5px solid',
                  borderColor: form.jenis === j.val ? j.border : '#e2e8f0',
                  background: form.jenis === j.val ? j.color : '#f8fafc',
                  color: form.jenis === j.val ? j.text : '#94a3b8',
                  fontWeight: form.jenis === j.val ? '600' : '400',
                  fontSize: '12px', cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{j.emoji}</div>
                  {j.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Kanan */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Tanggal & Keterangan */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Detail</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
              {[{ key: 'mulai', label: 'Dari tanggal' }, { key: 'selesai', label: 'Sampai tanggal' }].map(d => (
                <div key={d.key}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '5px' }}>
                    <Calendar size={11} />{d.label}
                  </div>
                  <input type="date" style={input} value={form[d.key]} onChange={e => setForm({ ...form, [d.key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FileText size={11} /> Keterangan
            </div>
            <textarea style={{ ...input, minHeight: '90px', resize: 'vertical' }} placeholder="Jelaskan alasan izin..." value={form.keterangan} onChange={e => setForm({ ...form, keterangan: e.target.value })} />
          </div>

          {/* Upload */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
              Bukti Foto <span style={{ fontWeight: '400', textTransform: 'none', letterSpacing: 0 }}>(opsional)</span>
            </div>
            <div onClick={() => document.getElementById('bukti-upload').click()} style={{ border: '2px dashed #e2e8f0', borderRadius: '10px', padding: '20px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#a5b4fc'; e.currentTarget.style.background = '#f5f3ff' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = 'transparent' }}
            >
              <Upload size={20} color="#c7d2fe" style={{ margin: '0 auto 6px' }} />
              <p style={{ fontSize: '12px', color: '#94a3b8' }}>{buktiFile ? buktiFile.name : 'Upload foto bukti'}</p>
            </div>
            <input id="bukti-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={pilisBukti} />
            {buktiURL && <img src={buktiURL} alt="bukti" style={{ width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '10px', marginTop: '10px' }} />}
          </div>

          <button onClick={kirim} disabled={loading} style={{
            width: '100%', padding: '13px', borderRadius: '12px', border: 'none',
            background: loading ? '#94a3b8' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', fontWeight: '700', fontSize: '14px',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(99,102,241,0.35)',
            transition: 'all 0.2s'
          }}>
            <Send size={15} />
            {loading ? 'Mengirim...' : 'Kirim Pengajuan Izin'}
          </button>
        </div>
      </div>
    </div>
  )
}
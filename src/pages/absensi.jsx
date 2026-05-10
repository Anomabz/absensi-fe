import { useState, useRef } from 'react'
import { getPegawaiByNIM, submitAbsensi } from '../services/api'

export default function Absensi() {
  const [nim, setNim] = useState('')
  const [pegawai, setPegawai] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [tipe, setTipe] = useState('masuk')
  const [streaming, setStreaming] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const [photoBlob, setPhotoBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pesan, setPesan] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  const cekNIM = async (val) => {
    setNim(val)
    if (val.length < 3) { setPegawai(null); setNotFound(false); return }
    const result = await getPegawaiByNIM(val)
    if (result) { setPegawai(result); setNotFound(false) }
    else { setPegawai(null); setNotFound(true) }
  }

  const bukaKamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = s
      videoRef.current.srcObject = s
      setStreaming(true)
      setPhotoURL(null)
    } catch { alert('Kamera tidak bisa diakses. Izinkan akses kamera di browser.') }
  }

  const jepret = () => {
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
    canvas.toBlob(blob => {
      setPhotoBlob(blob)
      setPhotoURL(URL.createObjectURL(blob))
      setStreaming(false)
      streamRef.current?.getTracks().forEach(t => t.stop())
    }, 'image/jpeg', 0.92)
  }

  const ulangi = () => {
    setPhotoURL(null)
    setPhotoBlob(null)
    bukaKamera()
  }

  const kirim = async () => {
    if (!pegawai) return alert('NIM tidak valid')
    if (!photoBlob) return alert('Ambil foto dulu')
    setLoading(true)
    const fd = new FormData()
    fd.append('nim', nim)
    fd.append('foto', photoBlob, 'selfie.jpg')
    fd.append('timestamp', new Date().toISOString())
    fd.append('tipe', tipe)
    await submitAbsensi(fd)
    setPesan(`✅ Absensi ${tipe} ${pegawai.nama} berhasil!`)
    setNim(''); setPegawai(null); setPhotoURL(null); setPhotoBlob(null)
    setLoading(false)
    setTimeout(() => setPesan(''), 3000)
  }

  const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '12px' }
  const input = { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }
  const btn = (color) => ({
    flex: 1, padding: '9px', borderRadius: '8px', border: 'none',
    background: color, color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer'
  })

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      {pesan && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#16a34a' }}>{pesan}</div>}

      <div style={card}>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>NIM Pegawai</p>
        <input style={input} placeholder="Ketik NIM..." value={nim} onChange={e => cekNIM(e.target.value)} />
        {pegawai && <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>✅ {pegawai.nama}</div>}
        {notFound && <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>❌ NIM tidak ditemukan</div>}

        <p style={{ fontSize: '13px', color: '#6b7280', margin: '14px 0 8px' }}>Tipe Absensi</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['masuk', 'pulang'].map(t => (
            <button key={t} onClick={() => setTipe(t)} style={{
              flex: 1, padding: '8px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: tipe === t ? '600' : '400',
              border: `1px solid ${tipe === t ? (t === 'masuk' ? '#86efac' : '#fcd34d') : '#e5e7eb'}`,
              background: tipe === t ? (t === 'masuk' ? '#f0fdf4' : '#fffbeb') : '#f9fafb',
              color: tipe === t ? (t === 'masuk' ? '#16a34a' : '#d97706') : '#6b7280'
            }}>{t === 'masuk' ? '🟢 Masuk' : '🟡 Pulang'}</button>
          ))}
        </div>
      </div>

      <div style={card}>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>Foto Selfie</p>
        <div style={{ background: '#f3f4f6', borderRadius: '10px', overflow: 'hidden', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: streaming ? 'block' : 'none' }} />
          {photoURL && <img src={photoURL} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />}
          {!streaming && !photoURL && <div style={{ textAlign: 'center', color: '#9ca3af' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📷</div>
            <p style={{ fontSize: '13px' }}>Klik tombol di bawah untuk buka kamera</p>
          </div>}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          {!streaming && !photoURL && <button style={btn('#2563eb')} onClick={bukaKamera}>Buka Kamera</button>}
          {streaming && <button style={btn('#16a34a')} onClick={jepret}>📸 Jepret!</button>}
          {streaming && <button style={btn('#dc2626')} onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); setStreaming(false) }}>Batal</button>}
          {photoURL && <button style={btn('#6b7280')} onClick={ulangi}>Foto Ulang</button>}
        </div>
      </div>

      <button onClick={kirim} disabled={loading} style={{ ...btn('#16a34a'), width: '100%', padding: '12px', fontSize: '14px' }}>
        {loading ? 'Mengirim...' : 'Kirim Absensi'}
      </button>
    </div>
  )
}
import { useState, useRef } from 'react'
import { getPegawaiByNIM, submitAbsensi } from '../services/api'
import { Camera, RotateCcw, Send, Search, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function Absensi() {
  const [nim, setNim] = useState('')
  const [pegawai, setPegawai] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [tipe, setTipe] = useState('masuk')
  const [streaming, setStreaming] = useState(false)
  const [photoURL, setPhotoURL] = useState(null)
  const [photoBlob, setPhotoBlob] = useState(null)
  const [loading, setLoading] = useState(false)
  const [sukses, setSukses] = useState(false)
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
      setStreaming(true); setPhotoURL(null)
    } catch { alert('Izinkan akses kamera di browser ya!') }
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

  const ulangi = () => { setPhotoURL(null); setPhotoBlob(null); bukaKamera() }
  const stopKamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); setStreaming(false) }

  const kirim = async () => {
    if (!pegawai) return alert('NIM tidak valid')
    if (!photoBlob) return alert('Ambil foto selfie dulu')
    setLoading(true)
    const fd = new FormData()
    fd.append('nim', nim); fd.append('foto', photoBlob, 'selfie.jpg')
    fd.append('timestamp', new Date().toISOString()); fd.append('tipe', tipe)
    await submitAbsensi(fd)
    setSukses(true)
    setTimeout(() => {
      setSukses(false)
      setNim(''); setPegawai(null); setPhotoURL(null); setPhotoBlob(null)
    }, 3000)
    setLoading(false)
  }

  if (sukses) return (
    <div style={{ maxWidth: '500px', margin: '60px auto', textAlign: 'center', padding: '0 20px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '48px 32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(34,197,94,0.3)' }}>
          <CheckCircle size={30} color="#fff" />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Absensi Berhasil!</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '4px' }}>{pegawai?.nama}</p>
        <p style={{ color: '#94a3b8', fontSize: '13px' }}>
          {tipe === 'masuk' ? '🟢 Masuk' : '🟡 Pulang'} • {new Date().toLocaleTimeString('id-ID')}
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '820px', padding: '28px 24px' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.02em' }}>Absensi Pegawai</h1>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <Clock size={12} />
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} — {new Date().toLocaleTimeString('id-ID')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'start' }}>

        {/* Kiri: NIM + Tipe */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Data Pegawai</div>
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                style={{ width: '100%', padding: '10px 12px 10px 36px', border: '1.5px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', background: '#f8fafc', outline: 'none', transition: 'border-color 0.15s' }}
                placeholder="Masukkan NIM..."
                value={nim}
                onChange={e => cekNIM(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'}
              />
            </div>

            {pegawai && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', color: '#fff', flexShrink: 0 }}>
                  {pegawai.nama.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#15803d' }}>{pegawai.nama}</div>
                  <div style={{ fontSize: '11px', color: '#86efac', marginTop: '1px' }}>NIM {nim}</div>
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

          {/* Tipe */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Tipe Absensi</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { val: 'masuk', label: 'Masuk', emoji: '🟢', bg: '#f0fdf4', border: '#86efac', text: '#15803d' },
                { val: 'pulang', label: 'Pulang', emoji: '🟡', bg: '#fffbeb', border: '#fcd34d', text: '#b45309' }
              ].map(t => (
                <button key={t.val} onClick={() => setTipe(t.val)} style={{
                  flex: 1, padding: '12px 8px', borderRadius: '10px', border: '1.5px solid',
                  borderColor: tipe === t.val ? t.border : '#e2e8f0',
                  background: tipe === t.val ? t.bg : '#f8fafc',
                  color: tipe === t.val ? t.text : '#94a3b8',
                  fontWeight: tipe === t.val ? '600' : '400',
                  fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s'
                }}>
                  <div style={{ fontSize: '20px', marginBottom: '4px' }}>{t.emoji}</div>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
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
            {loading ? 'Mengirim...' : 'Kirim Absensi'}
          </button>
        </div>

        {/* Kanan: Kamera */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>Foto Selfie</div>
          <div style={{ borderRadius: '12px', overflow: 'hidden', aspectRatio: '3/4', background: '#0f172a', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <video ref={videoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', display: streaming ? 'block' : 'none' }} />
            {photoURL && <img src={photoURL} alt="selfie" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />}
            {!streaming && !photoURL && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Camera size={24} color="#6366f1" />
                </div>
                <p style={{ fontSize: '13px', color: '#64748b' }}>Kamera belum aktif</p>
                <p style={{ fontSize: '11px', color: '#334155', marginTop: '4px' }}>Klik tombol di bawah</p>
              </div>
            )}
            {streaming && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '12px', left: '12px', width: '20px', height: '20px', borderTop: '2px solid #6366f1', borderLeft: '2px solid #6366f1', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', top: '12px', right: '12px', width: '20px', height: '20px', borderTop: '2px solid #6366f1', borderRight: '2px solid #6366f1', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '20px', height: '20px', borderBottom: '2px solid #6366f1', borderLeft: '2px solid #6366f1', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '20px', height: '20px', borderBottom: '2px solid #6366f1', borderRight: '2px solid #6366f1', borderRadius: '2px' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', borderRadius: '99px', padding: '4px 14px' }}>
                  <span style={{ fontSize: '11px', color: '#fff' }}>Posisikan wajah di tengah</span>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {!streaming && !photoURL && (
              <button onClick={bukaKamera} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', border: '1.5px solid #c7d2fe', background: '#eef2ff', color: '#4f46e5', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                <Camera size={15} /> Buka Kamera
              </button>
            )}
            {streaming && (
              <>
                <button onClick={jepret} style={{ flex: 2, padding: '11px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99,102,241,0.3)' }}>
                  📸 Jepret!
                </button>
                <button onClick={stopKamera} style={{ padding: '11px 14px', borderRadius: '10px', border: '1px solid #fecaca', background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: '13px' }}>
                  Batal
                </button>
              </>
            )}
            {photoURL && (
              <button onClick={ulangi} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '13px', cursor: 'pointer' }}>
                <RotateCcw size={14} /> Foto Ulang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
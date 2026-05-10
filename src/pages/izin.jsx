import { useState } from 'react'
import { getPegawaiByNIM, submitIzin } from '../services/api'

export default function Izin() {
  const [nim, setNim] = useState('')
  const [pegawai, setPegawai] = useState(null)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState({ jenis: '', mulai: '', selesai: '', keterangan: '' })
  const [buktiURL, setBuktiURL] = useState(null)
  const [buktiFile, setBuktiFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [pesan, setPesan] = useState('')

  const today = new Date().toISOString().split('T')[0]

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
    setBuktiFile(file)
    setBuktiURL(URL.createObjectURL(file))
  }

  const kirim = async () => {
    if (!pegawai) return alert('NIM tidak valid')
    if (!form.jenis) return alert('Pilih jenis izin')
    if (!form.mulai || !form.selesai) return alert('Isi tanggal izin')
    if (!form.keterangan) return alert('Isi keterangan')
    setLoading(true)
    const fd = new FormData()
    fd.append('nim', nim)
    Object.entries(form).forEach(([k, v]) => fd.append(k, v))
    if (buktiFile) fd.append('bukti_foto', buktiFile)
    await submitIzin(fd)
    setPesan(`✅ Pengajuan izin ${form.jenis} ${pegawai.nama} berhasil dikirim!`)
    setNim(''); setPegawai(null); setForm({ jenis: '', mulai: today, selesai: today, keterangan: '' })
    setBuktiURL(null); setBuktiFile(null)
    setLoading(false)
    setTimeout(() => setPesan(''), 3000)
  }

  const card = { background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '16px', marginBottom: '12px' }
  const input = { width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', fontFamily: 'inherit' }
  const label = { fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px' }
  const group = { marginBottom: '14px' }

  return (
    <div style={{ padding: '16px', maxWidth: '480px', margin: '0 auto' }}>
      {pesan && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', fontSize: '13px', color: '#16a34a' }}>{pesan}</div>}

      <div style={card}>
        <div style={group}>
          <label style={label}>NIM Pegawai</label>
          <input style={input} placeholder="Ketik NIM..." value={nim} onChange={e => cekNIM(e.target.value)} />
          {pegawai && <div style={{ marginTop: '8px', padding: '8px 12px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>✅ {pegawai.nama}</div>}
          {notFound && <div style={{ marginTop: '8px', padding: '8px 12px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>❌ NIM tidak ditemukan</div>}
        </div>
      </div>

      <div style={card}>
        <div style={group}>
          <label style={label}>Jenis Izin</label>
          <select style={input} value={form.jenis} onChange={e => setForm({...form, jenis: e.target.value})}>
            <option value="">Pilih jenis izin...</option>
            <option value="sakit">🤒 Sakit</option>
            <option value="cuti">🏖️ Cuti Tahunan</option>
            <option value="keperluan_pribadi">🏠 Keperluan Pribadi</option>
            <option value="lainnya">📝 Lainnya</option>
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
          <div>
            <label style={label}>Tanggal Mulai</label>
            <input style={input} type="date" value={form.mulai || today} onChange={e => setForm({...form, mulai: e.target.value})} />
          </div>
          <div>
            <label style={label}>Tanggal Selesai</label>
            <input style={input} type="date" value={form.selesai || today} onChange={e => setForm({...form, selesai: e.target.value})} />
          </div>
        </div>
        <div style={group}>
          <label style={label}>Keterangan</label>
          <textarea style={{...input, minHeight: '80px', resize: 'vertical'}} placeholder="Jelaskan alasan izin..." value={form.keterangan} onChange={e => setForm({...form, keterangan: e.target.value})} />
        </div>
        <div style={group}>
          <label style={label}>Bukti Foto (opsional)</label>
          <div onClick={() => document.getElementById('bukti-upload').click()} style={{ border: '2px dashed #d1d5db', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', color: '#9ca3af', fontSize: '13px' }}>
            📎 Klik untuk upload foto bukti
          </div>
          <input id="bukti-upload" type="file" accept="image/*" style={{ display: 'none' }} onChange={pilisBukti} />
          {buktiURL && <img src={buktiURL} style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }} />}
        </div>
      </div>

      <button onClick={kirim} disabled={loading} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#2563eb', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
        {loading ? 'Mengirim...' : 'Kirim Pengajuan Izin'}
      </button>
    </div>
  )
}
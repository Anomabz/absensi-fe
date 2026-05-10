import axios from 'axios'

const BASE_URL = 'http://localhost:8080/api'

// Mock data pegawai (sementara sebelum backend jadi)
const MOCK_PEGAWAI = [
  { nim: '12345', nama: 'Budi Santoso' },
  { nim: '67890', nama: 'Siti Rahayu' },
  { nim: '11111', nama: 'Ahmad Fauzi' },
  { nim: '22222', nama: 'Dewi Lestari' },
  { nim: '33333', nama: 'Rizky Pratama' },
]

export const getPegawaiByNIM = async (nim) => {
  // Ganti baris ini kalau backend sudah jadi:
  // const res = await axios.get(`${BASE_URL}/pegawai/${nim}`)
  // return res.data
  return MOCK_PEGAWAI.find(p => p.nim === nim) || null
}

export const submitAbsensi = async (formData) => {
  // Ganti baris ini kalau backend sudah jadi:
  // return await axios.post(`${BASE_URL}/absensi`, formData)
  console.log('MOCK submitAbsensi:', formData)
  return { message: 'Absensi berhasil (mock)' }
}

export const submitIzin = async (formData) => {
  // Ganti baris ini kalau backend sudah jadi:
  // return await axios.post(`${BASE_URL}/izin`, formData)
  console.log('MOCK submitIzin:', formData)
  return { message: 'Izin berhasil dikirim (mock)' }
}
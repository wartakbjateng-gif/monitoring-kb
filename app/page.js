'use client'; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [dataKampung, setDataKampung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State baru untuk mengatur apakah filter sedang menyala atau mati
  const [filterMenyala, setFilterMenyala] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const merespon = await fetch('/api/get-data');
      if (!merespon.ok) {
        throw new Error('Gagal mengambil data dari server');
      }
      const hasilnya = await merespon.json();
      setDataKampung(hasilnya);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Dapatkan nama bulan dan tahun saat ini secara otomatis
  // (Menggunakan format bahasa Inggris menyesuaikan teks dari web BKKBN, misal: "September 2026")
  const namaBulanIni = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // 2. Logika Menyaring Data
  const dataYangDitampilkan = dataKampung.filter((item) => {
    if (!filterMenyala) {
      return true; // Jika filter mati, tampilkan semua data
    } else {
      // Jika filter menyala, TAMPILKAN hanya yang tanggalnya TIDAK mengandung namaBulanIni
      return !item.tanggal_terakhir.includes(namaBulanIni);
    }
  });

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Dashboard Monitoring Kampung KB</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {/* Tombol Refresh */}
          <button 
            onClick={fetchData} 
            disabled={loading}
            style={gayaTombol(loading ? '#ccc' : '#0070f3', loading)}
          >
            {loading ? "Menarik Data..." : "Refresh Data"}
          </button>

          {/* Tombol Filter Baru */}
          <button 
            onClick={() => setFilterMenyala(!filterMenyala)} 
            disabled={loading}
            style={gayaTombol(filterMenyala ? '#d9534f' : '#5cb85c', loading)}
          >
            {filterMenyala ? "Tampilkan Semua Data" : `Tampilkan Yang Belum Mengisi (${namaBulanIni})`}
          </button>
      </div>

      {error && (
        <p style={{ textAlign: 'center', color: 'red' }}>Terjadi kesalahan: {error}</p>
      )}

      {loading ? (
          <p style={{ textAlign: 'center' }}>Mohon tunggu, sedang menarik data dari 54 Kampung KB...</p>
      ) : (
        <>
          <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
            Total ditampilkan: {dataYangDitampilkan.length} Kampung KB
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f2f2f2' }}>
                <th style={gayaTabel}>No</th>
                <th style={gayaTabel}>Nama Kampung KB</th>
                <th style={gayaTabel}>Update Terakhir</th>
                <th style={gayaTabel}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataYangDitampilkan.length > 0 ? (
                dataYangDitampilkan.map((item, index) => (
                  <tr key={index}>
                    <td style={gayaTabel_Tengah}>{index + 1}</td>
                    <td style={gayaTabel}><strong>{item.nama_kampung}</strong></td>
                    <td style={gayaTabel_Tengah}>
                      {/* Memberi warna merah jika belum update bulan ini agar lebih mencolok */}
                      <span style={{ color: item.tanggal_terakhir.includes(namaBulanIni) ? 'black' : 'red' }}>
                        {item.tanggal_terakhir}
                      </span>
                    </td>
                    <td style={gayaTabel_Tengah}>
                      <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                        Lihat Web
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                    Semua Kampung KB sudah mengisi di bulan {namaBulanIni} 🎉
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

// Kumpulan gaya CSS sederhana
const gayaTabel = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const gayaTabel_Tengah = { border: '1px solid #ddd', padding: '12px', textAlign: 'center' };
const gayaTombol = (warnaLatar, loading) => ({
  padding: '10px 20px', 
  fontSize: '16px', 
  cursor: loading ? 'not-allowed' : 'pointer', 
  backgroundColor: warnaLatar, 
  color: 'white', 
  border: 'none', 
  borderRadius: '5px' 
});
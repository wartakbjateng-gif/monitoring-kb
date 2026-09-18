'use client'; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [dataKampung, setDataKampung] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk filter dan status maintenis
  const [filterMenyala, setFilterMenyala] = useState(false);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setIsMaintenance(false);
    
    // Membuat batas waktu (timeout) 12 detik. 
    // Jika lebih dari 12 detik tidak ada respons, hentikan paksa.
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); 

    try {
      const merespon = await fetch('/api/get-data', { signal: controller.signal });
      clearTimeout(timeoutId);

      // Jika Vercel mengembalikan status error (biasanya karena web target down)
      if (!merespon.ok) {
         throw new Error('Server error');
      }
      
      const hasilnya = await merespon.json();
      
      // Mengecek apakah SEMUA data gagal diakses (indikasi kuat website target sedang down)
      const semuaGagal = hasilnya.every(item => item.nama_kampung === "Gagal Mengakses Halaman");
      if (semuaGagal && hasilnya.length > 0) {
         throw new Error('Semua target gagal diakses');
      }

      setDataKampung(hasilnya);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error("Gagal menarik data:", error);
      // Jika terjadi error atau timeout, aktifkan halaman Maintenis
      setIsMaintenance(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Format bulan dan tahun bahasa Inggris untuk mencocokkan teks website target
  const namaBulanIni = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Logika Filter Data
  const dataYangDitampilkan = dataKampung.filter((item) => {
    if (!filterMenyala) return true;
    return !item.tanggal_terakhir.includes(namaBulanIni);
  });

  // ==========================================
  // TAMPILAN JIKA WEBSITE SEDANG MAIN-TENIS
  // ==========================================
  if (isMaintenance) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <h1 style={{ color: '#d9534f', fontSize: '36px' }}>Waduh, Website Kampung KB Sedang Main-Tenis! 🐼🎾</h1>
        <p style={{ fontSize: '18px', color: '#555', maxWidth: '600px', margin: '0 auto' }}>
          Sistem kami mendeteksi bahwa server website target (BKKBN) tidak merespons atau membutuhkan waktu terlalu lama. Kemungkinan sedang ada perbaikan (maintenance).
        </p>
        
        {/* GIF Panda Main Tenis */}
        <div style={{ margin: '30px 0' }}>
          <img 
            src="https://media1.tenor.com/m/XF-yP8F9MewAAAAC/panda-playing-ping-pong.gif" 
            alt="Panda Main Tenis" 
            style={{ width: '100%', maxWidth: '400px', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}
          />
        </div>
        
        <button onClick={fetchData} style={gayaTombol('#0070f3', loading)}>
          {loading ? "Mencoba Menghubungi Kembali..." : "Coba Tarik Data Lagi"}
        </button>
      </div>
    );
  }

  // ==========================================
  // TAMPILAN NORMAL (DASHBOARD)
  // ==========================================
  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Dashboard Monitoring Kampung KB</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button 
            onClick={fetchData} 
            disabled={loading}
            style={gayaTombol(loading ? '#ccc' : '#0070f3', loading)}
          >
            {loading ? "Menarik Data..." : "Refresh Data"}
          </button>

          <button 
            onClick={() => setFilterMenyala(!filterMenyala)} 
            disabled={loading}
            style={gayaTombol(filterMenyala ? '#d9534f' : '#5cb85c', loading)}
          >
            {filterMenyala ? "Tampilkan Semua Data" : `Tampilkan Yang Belum Mengisi (${namaBulanIni})`}
          </button>
      </div>

      {loading ? (
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Mohon tunggu, sedang menarik data dari 54 Kampung KB...</p>
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
                      <span style={{ color: item.tanggal_terakhir.includes(namaBulanIni) ? 'black' : 'red', fontWeight: item.tanggal_terakhir.includes(namaBulanIni) ? 'normal' : 'bold' }}>
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
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', fontSize: '16px' }}>
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

// Gaya CSS
const gayaTabel = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const gayaTabel_Tengah = { border: '1px solid #ddd', padding: '12px', textAlign: 'center' };
const gayaTombol = (warnaLatar, loading) => ({
  padding: '10px 20px', 
  fontSize: '16px', 
  cursor: loading ? 'not-allowed' : 'pointer', 
  backgroundColor: warnaLatar, 
  color: 'white', 
  border: 'none', 
  borderRadius: '8px',
  fontWeight: 'bold'
});
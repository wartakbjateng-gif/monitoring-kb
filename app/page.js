'use client'; 

import { useEffect, useState } from 'react';

export default function Home() {
  const [dataKampung, setDataKampung] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Otomatis mengambil data saat web pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Dashboard Monitoring Kampung KB</h1>
      
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <button 
            onClick={fetchData} 
            disabled={loading}
            style={{ 
              padding: '10px 20px', 
              fontSize: '16px', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              backgroundColor: loading ? '#ccc' : '#0070f3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px' 
            }}
          >
            {loading ? "Sedang Mengambil Data..." : "Refresh Data"}
          </button>
      </div>

      {error && (
        <p style={{ textAlign: 'center', color: 'red' }}>Terjadi kesalahan: {error}</p>
      )}

      {loading ? (
          <p style={{ textAlign: 'center' }}>Mohon tunggu, sedang menarik data...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={gayaTabel}>No</th>
              <th style={gayaTabel}>Nama Kampung KB</th>
              <th style={gayaTabel}>Update Terakhir</th>
              <th style={gayaTabel}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {dataKampung.map((item, index) => (
              <tr key={index}>
                <td style={gayaTabel_Tengah}>{index + 1}</td>
                <td style={gayaTabel}><strong>{item.nama_kampung}</strong></td>
                <td style={gayaTabel_Tengah}>{item.tanggal_terakhir}</td>
                <td style={gayaTabel_Tengah}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                    Lihat Web
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// CSS sederhana untuk merapikan tabel
const gayaTabel = { border: '1px solid #ddd', padding: '12px', textAlign: 'left' };
const gayaTabel_Tengah = { border: '1px solid #ddd', padding: '12px', textAlign: 'center' };
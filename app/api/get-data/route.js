import * as cheerio from 'cheerio';

// MASUKKAN 54 LINK ANDA DI SINI NANTINYA
// Pisahkan dengan koma dan gunakan tanda kutip seperti contoh di bawah
const urlsTarget = [
    "https://kampungkb.kemendukbangga.go.id/kampung/87736/intervensi",
    // Tambahkan link lainnya di bawah sini...
];

export async function GET() {
    try {
        const scrapePromises = urlsTarget.map(async (url) => {
            try {
                // Proses mengambil data halaman website
                const response = await fetch(url, { cache: 'no-store' });
                const html = await response.text();
                
                // Proses membaca HTML menggunakan Cheerio
                const $ = cheerio.load(html);
                
                // Mengambil Nama Kampung dari tag h1 dan Tanggal dari tag small pertama
                const namaKampung = $('header h1').text().trim();
                const lastDate = $('small').first().text().trim();
                
                return {
                    url: url,
                    nama_kampung: namaKampung || "Nama Tidak Ditemukan",
                    tanggal_terakhir: lastDate || "Belum ada update"
                };
            } catch (error) {
                return {
                    url: url,
                    nama_kampung: "Gagal Mengakses Halaman",
                    tanggal_terakhir: "Error"
                };
            }
        });

        const results = await Promise.all(scrapePromises);
        return Response.json(results);
        
    } catch (error) {
        return Response.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 });
    }
}
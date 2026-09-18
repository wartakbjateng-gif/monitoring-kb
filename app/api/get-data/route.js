import * as cheerio from 'cheerio';

// MASUKKAN 54 LINK ANDA DI SINI NANTINYA
// Pisahkan dengan koma dan gunakan tanda kutip seperti contoh di bawah
const urlsTarget = [
    "https:/kampungkb.kemendukbangga.go.id/kampung/40502/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87732/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87736/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37309/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/20021/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37701/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37610/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87730/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37700/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37616/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/11651/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/10245/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/40109/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87701/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87720/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37740/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37694/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/11186/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87734/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87735/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/16543/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87700/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/10249/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/19042/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37708/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87729/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37283/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87717/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/39997/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87705/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87721/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/16205/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87722/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87733/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87731/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87726/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87725/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87719/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87724/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/9202/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87723/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87738/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87718/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87703/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/16262/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87728/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87727/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/14508/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87702/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/40650/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/39994/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/20949/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/87737/intervensi",
"https:/kampungkb.kemendukbangga.go.id/kampung/37650/intervensi"

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
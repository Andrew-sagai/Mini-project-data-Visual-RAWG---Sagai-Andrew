import React from 'react';

export default function Insights({ 
  totalGames, 
  avgRating, 
  topGame, 
  peakYear, 
  topGenre, 
  topTag,
  dominantGenreForHighRated, 
  topPlatform, 
  animationDelay = 'delay-5' 
}) {
  return (
    <section className={`dashboard-insights fade-slide-up ${animationDelay}`}>
      <div className="insights-header">
        <h2 className="insights-title">Insight, Tren & Rekomendasi Eksekutif</h2>
        <p className="insights-subtitle">Analisis strategis dan rangkuman data industri berdasarkan skala penuh database RAWG</p>
      </div>
      
      <div className="insights-grid">

        <div className="insight-card">
          <h3>Insight</h3>
          <p>
            Berdasarkan agregasi komprehensif dari <strong>{Number(totalGames || 0).toLocaleString('id-ID')} judul game</strong> global, ekosistem industri game secara keseluruhan memperlihatkan adaptabilitas dan pertumbuhan yang impresif. Dominasi <strong>{topPlatform?.[0] || 'N/A'}</strong> sebagai infrastruktur utama dengan capaian <strong>{Number(topPlatform?.[1] || 0).toLocaleString('id-ID')} game</strong> membuktikan kokohnya fondasi platform tersebut di mata para developer. Selain itu, sinergi antara penerbit ternama dan keberagaman tema permainan terus menjadi motor penggerak bertahannya retensi pemain di seluruh spektrum populasi global.
          </p>
        </div>

        <div className="insight-card">
          <h3>Tren</h3>
          <p>
            Lintasan perilisan mencapai puncaknya pada tahun <strong>{peakYear?.year || 'N/A'}</strong> dengan menembus angkat <strong>{Number(peakYear?.jumlah || 0).toLocaleString('id-ID')} perilisan karya</strong>. Di sisi lain, pasar sebagian besar terpusat pada genre konvensional seperti <strong>{topGenre?.name || 'N/A'}</strong> (mencapai lebih dari <strong>{Number(topGenre?.value || 0).toLocaleString('id-ID')} rilis</strong>). Dari aspek identitas permainan, observasi pada tren <em>tags</em> menunjukkan preferensi komunitas secara masif tertuju pada tag seperti <strong>{topTag?.tagName || 'Singleplayer'}</strong> (<strong>{Number(topTag?.count || 0).toLocaleString('id-ID')} entri</strong>), yang mengindikasikan kuatnya minat audiens akan pengalaman bermain yang personal. Menariknya, apresiasi tertinggi selalu diraih oleh game yang berfokus ke kualitas, mencuatnya game <strong>{topGame?.name || 'N/A'}</strong> dengan skor near-perfect <strong>{topGame?.rating?.toFixed(2) || 'N/A'}/5.0</strong> membuktikan bahwa kedalaman kualitas mematahkan saturasi genre di pasar.
          </p>
        </div>

        <div className="insight-card">
          <h3>Rekomendasi</h3>
          <p style={{ marginBottom: '10px' }}>
            <strong>1. Fokus Retensi melalui Kedalaman Tags:</strong> Daripada sekadar bersaing di genre yang jenuh, pengembang sebaiknya memasukkan elemen dari tag populer seperti <em>{topTag?.tagName || 'Singleplayer'}</em> atau tema spesifik lain guna menjaring audiens <em>niche</em> yang lebih setia.
          </p>
          <p style={{ marginBottom: '10px' }}>
            <strong>2. Maksimalkan Ekosistem Rilis Utama:</strong> Meluncurkan game di platform dominan (seperti {topPlatform?.[0] || 'PC'}) sangat esensial untuk menarik basis pemain dalam skala besar, sembari menjaga opsi kolaborasi publisher bagi portofolio komersial yang mantap.
          </p>
          <p>
            <strong>3. QA & Prioritas Kualitas Resolutif:</strong> Mengingat standar rata-rata rating yang stabil di rentang <strong>{Number(avgRating || 0).toFixed(2)}</strong>, fokuslah pada penyelesaian akhir permainan terbebas dari bug fundamental; karena ulasan awal pemain punya efek domino tak terbendung pada sentimen rilis secara keseluruhan.
          </p>
        </div>

      </div>
    </section>
  );
}

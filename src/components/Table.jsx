import React from 'react';

export default function Table({ data, sortOrder, setSortOrder, animationDelay = 'delay-4' }) {
  const handleSort = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className={`table-container fade-slide-up ${animationDelay}`}>
      <div className="table-header-control">
        <h2 className="table-title">RAWG Games Database - Top 20 Rating Games</h2>
        <div className="table-actions">
          <button className="sort-btn" onClick={handleSort}>
            Sort Rating ({sortOrder === 'desc' ? 'Teratas' : 'Terbawah'})
          </button>
        </div>
      </div>
      
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Judul Game</th>
              <th>Tahun Rilis</th>
              <th>Rating</th>
              <th>Total Pengulas</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((game, index) => {
                return (
                  <tr key={index}>
                    <td className="game-name-cell">
                      {game.background_image && (
                        <div className="table-img-wrapper" style={{ backgroundImage: `url(${game.background_image})` }}></div>
                      )}
                      <span>{game.name}</span>
                    </td>
                    <td>{game.released ? new Date(game.released).getFullYear() : 'N/A'}</td>
                    <td>
                      <span className="rating-badge">
                        ⭐ {game.rating?.toFixed(2) || 'N/A'}
                      </span>
                    </td>
                    <td>{game.ratings_count ? game.ratings_count.toLocaleString('id-ID') : 0}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
                  Tidak ada game yang cocok dengan pencarian.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

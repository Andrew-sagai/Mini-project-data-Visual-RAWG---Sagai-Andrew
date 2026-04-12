import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import KPI from '../components/KPI';
import LineChartComp from '../components/charts/LineChartComp';
import BarChartComp from '../components/charts/BarChartComp';
import PieChartComp from '../components/charts/PieChartComp';
import PlatformBarChartComp from '../components/charts/PlatformBarChartComp';
import RatingTrendAreaChartComp from '../components/charts/RatingTrendAreaChartComp';
import GenrePopularityRadarChartComp from '../components/charts/GenrePopularityRadarChartComp';
import TagsComposedChartComp from '../components/charts/TagsComposedChartComp';
import Table from '../components/Table';
import Insights from '../components/Insights';

const API_URL = 'https://api.rawg.io/api/games';
const PUB_URL = 'https://api.rawg.io/api/publishers';
const API_KEY = 'ff9410adfec2473fa35c07c08f0e2c19';

export default function Dashboard() {
  const [games, setGames] = useState([]);
  const [publishersCountData, setPublishersCountData] = useState([]);
  const [publishersHypeData, setPublishersHypeData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterYear, setFilterYear] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [filterPublisher, setFilterPublisher] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');
  const [globalProcessedData, setGlobalProcessedData] = useState(null);
  const [globalTrends, setGlobalTrends] = useState(null);

  // ── MULTI-FETCH DATA (TRUE GLOBAL DATABASE) ──
  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const datesParam = filterYear ? `${filterYear}-01-01,${filterYear}-12-31` : '2000-01-01,2024-12-31';

      const baseParams = { key: API_KEY };
      if (filterYear) baseParams.dates = datesParam;
      if (filterGenre) baseParams.genres = filterGenre;
      if (filterTag) baseParams.tags = filterTag;
      if (filterPublisher) baseParams.publishers = filterPublisher;

      const topParams = { ...baseParams, dates: datesParam }; 

      // 1. Fetch Global Aggregation Endpoints
      const promises = [
        axios.get(API_URL, { params: { ...baseParams, page_size: 1 } }),
        axios.get('https://api.rawg.io/api/genres', { params: { key: API_KEY, page_size: 40 } }),
        axios.get('https://api.rawg.io/api/platforms', { params: { key: API_KEY, page_size: 40 } }),
        axios.get('https://api.rawg.io/api/tags', { params: { key: API_KEY, page_size: 40 } }),
        axios.get('https://api.rawg.io/api/publishers', { params: { key: API_KEY, page_size: 15 } }),
        axios.get(API_URL, { params: { ...topParams, page_size: 40, ordering: '-added' } }),
        axios.get(API_URL, { params: { ...topParams, page_size: 40, ordering: '-rating' } })
      ];

      // 2. Fetch True Global Year Trend (2000 - 2024) - ONLY ONCE
      let gamesPerYear = globalTrends;
      if (!gamesPerYear) {
        const yearPromises = [];
        for (let y = 2000; y <= 2024; y++) {
          yearPromises.push(
            axios.get(API_URL, {
              params: { key: API_KEY, dates: `${y}-01-01,${y}-12-31`, page_size: 15, ordering: '-added' }
            })
              .then(res => {
                const results = res.data?.results || [];
                const ratedGames = results.filter(g => g.rating && g.rating > 0);
                const dynamicAvgRating = ratedGames.length ? ratedGames.reduce((acc, g) => acc + g.rating, 0) / ratedGames.length : 0;
                return { year: y, jumlah: res.data.count, avgRating: Number(dynamicAvgRating.toFixed(2)) };
              })
              .catch(() => ({ year: y, jumlah: 0, avgRating: 0 }))
          );
        }
        gamesPerYear = await Promise.all(yearPromises);
        gamesPerYear.sort((a, b) => a.year - b.year);
        setGlobalTrends(gamesPerYear);
      }

      const [
        globalGamesRes,
        genresRes,
        platformsRes,
        tagsRes,
        publishersRes,
        topGamesRes,
        topRatedRes
      ] = await Promise.all(promises);

      const globalTotalGames = globalGamesRes.data.count || 0;

      // 3. Process the Stats
      let genreData, genrePopularityData, platformData, tagData, top10PublisherPeminat;

      const allGenres = genresRes.data?.results || [];
      const allPlatforms = platformsRes.data?.results || [];
      const allTags = tagsRes.data?.results || [];
      const publishersRaw = publishersRes.data?.results || [];

      const yearGames = [...(topGamesRes.data?.results || []), ...(topRatedRes.data?.results || [])];
      const uniqueYearGames = Array.from(new Map(yearGames.map(g => [g.id, g])).values());

      const gCount = {};
      const pCount = {};
      const tCount = {};
      const genreStats = {};

      uniqueYearGames.forEach(g => {
        g.genres?.forEach(x => {
          gCount[x.name] = (gCount[x.name] || 0) + 1;
          if (!genreStats[x.name]) genreStats[x.name] = { count: 0, ratingSum: 0 };
          genreStats[x.name].count += 1;
          genreStats[x.name].ratingSum += (g.rating || 0);
        });
        g.platforms?.forEach(x => { if (x.platform) pCount[x.platform.name] = (pCount[x.platform.name] || 0) + 1 });
        g.tags?.forEach(x => tCount[x.name] = (tCount[x.name] || 0) + 1);
      });

      if (!filterYear && !filterGenre && !filterTag && !filterPublisher) {
        // GLOBAL MODE
        allGenres.sort((a, b) => b.games_count - a.games_count);
        const top5Genres = allGenres.slice(0, 5).map(g => ({ name: g.name, value: g.games_count }));
        const otherGenresCount = allGenres.slice(5).reduce((sum, g) => sum + g.games_count, 0);
        genreData = [...top5Genres, { name: 'Lainnya', value: otherGenresCount }];

        // Menghitung Popularitas Genre: Kuantitas Global dikali Pembobot Rating Rata-rata
        genrePopularityData = allGenres.map(g => {
          const stats = genreStats[g.name];
          const avgRating = stats && stats.count > 0 ? stats.ratingSum / stats.count : 3.5;
          const combinedScore = Math.round(g.games_count * (avgRating / 5));
          return { genre: g.name, popularityScore: combinedScore, baseCount: g.games_count, avgRating: avgRating };
        }).sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 6);

        allPlatforms.sort((a, b) => b.games_count - a.games_count);
        platformData = allPlatforms.slice(0, 10).map(p => ({ platform: p.name, count: p.games_count }));

        allTags.sort((a, b) => b.games_count - a.games_count);
        tagData = allTags.slice(0, 10).map(t => ({ tagName: t.name, count: t.games_count }));
      } else {
        // FILTERED MODE
        const sortedG = Object.entries(gCount).sort((a, b) => b[1] - a[1]);
        genreData = sortedG.slice(0, 5).map(x => ({ name: x[0], value: x[1] }));
        if (sortedG.length > 5) genreData.push({ name: 'Lainnya', value: sortedG.slice(5).reduce((s, x) => s + x[1], 0) });

        // Memakai data tahun ini, mengalikan kuantitas sampling dengan rating untuk skor yang reliabel
        genrePopularityData = Object.entries(genreStats).map(([name, stats]) => {
          const avgRating = stats.ratingSum / stats.count;
          const qty = stats.count;
          const combinedScore = Math.round(qty * 100 * (avgRating / 5)); // base scaling to look significant
          return { genre: name, popularityScore: combinedScore, baseCount: qty, avgRating: avgRating };
        }).sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 6);

        platformData = Object.entries(pCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(x => ({ platform: x[0], count: x[1] }));
        tagData = Object.entries(tCount).sort((a, b) => b[1] - a[1]).slice(0, 10).map(x => ({ tagName: x[0], count: x[1] }));
      }

      // Publisher data generally static as specific year publisher info requires heavy individual fetching
      top10PublisherPeminat = [...publishersRaw]
        .map(p => {
          const totalAdded = p.games ? p.games.reduce((s, g) => s + (g.added || 0), 0) : 0;
          return { name: p.name.length > 20 ? p.name.slice(0, 18) + '…' : p.name, fullName: p.name, totalPeminat: totalAdded + p.games_count };
        })
        .sort((a, b) => b.totalPeminat - a.totalPeminat)
        .slice(0, 10);

      setPublishersCountData(top10PublisherPeminat);

      // -- Setting Table Data --
      const topRatedRaw = topRatedRes.data?.results || [];
      setGames(topRatedRaw);

      // -- Top Games (Hype & Rating) --
      const topGamesRaw = topGamesRes.data?.results || [];

      const top10RatingCounts = [...topGamesRaw]
        .sort((a, b) => (b.ratings_count || 0) - (a.ratings_count || 0))
        .slice(0, 10)
        .map(g => ({
          name: g.name.length > 20 ? g.name.slice(0, 18) + '…' : g.name,
          fullName: g.name,
          ratings_count: g.ratings_count
        }));

      const top5InterestTable = [...topGamesRaw]
        .sort((a, b) => (b.added || 0) - (a.added || 0))
        .slice(0, 5)
        .map(g => ({
          name: g.name,
          hypeScore: g.added || 0
        }));

      // KPI Computations
      const topGenreObj = genreData && genreData.length ? genreData[0] : null;
      const topPlatformObj = platformData && platformData.length ? platformData[0] : null;
      const peakYearObj = gamesPerYear.length ? gamesPerYear.reduce((best, y) => y.jumlah > best.jumlah ? y : best, gamesPerYear[0]) : null;
      const topGameObj = topRatedRaw.length ? topRatedRaw[0] : null;

      // Average Rating (Global trend mapping or single year)
      let avgRatingNum = 0;
      if (filterYear || filterGenre || filterTag || filterPublisher) {
        if (filterYear && !filterGenre && !filterTag && !filterPublisher) {
          const yearData = gamesPerYear.find(y => y.year.toString() === filterYear.toString());
          if (yearData) avgRatingNum = yearData.avgRating;
        } else {
          // Compute dynamic average rating from the current valid fetch results
          const validGames = uniqueYearGames.filter(g => g.rating > 0);
          avgRatingNum = validGames.length ? validGames.reduce((s, g) => s + g.rating, 0) / validGames.length : 0;
        }
      } else {
        avgRatingNum = gamesPerYear.length ? gamesPerYear.reduce((sum, y) => sum + y.avgRating, 0) / gamesPerYear.length : 0;
      }

      const dominantGenreForHighRatedArray = ['Global Action', 1];

      setGlobalProcessedData({
        totalGames: globalTotalGames,
        avgRating: avgRatingNum,
        topGame: topGameObj,
        gamesPerYear,
        top10RatingCounts,
        genreData,
        genrePopularityData,
        platformData,
        tagData,
        top10PublisherPeminat,
        top5InterestTable,
        topGenre: topGenreObj,
        topPlatform: topPlatformObj,
        peakYear: peakYearObj,
        dominantGenreForHighRated: dominantGenreForHighRatedArray,
        dropdowns: {
          genres: allGenres,
          tags: allTags,
          publishers: publishersRaw
        }
      });

    } catch (err) {
      setError(err.message || 'Gagal memuat ekstensif data global database RAWG.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllData(); }, [filterYear, filterGenre, filterTag, filterPublisher]);

  const tableData = useMemo(() => {
    let filtered = [...games];
    filtered.sort((a, b) => sortOrder === 'desc' ? (b.rating || 0) - (a.rating || 0) : (a.rating || 0) - (b.rating || 0));
    return filtered;
  }, [games, sortOrder]);

  if (loading) return (
    <Layout>
      <div className="loading-wrapper fade-slide-up">
        <div className="gaming-spinner" />
        <p>Memuat Ekstensif Data RAWG API...</p>
      </div>
    </Layout>
  );

  if (error) return (
    <Layout>
      <div className="error-wrapper fade-slide-up">
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}></div>
        <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>
        <button className="retry-btn" onClick={fetchAllData}>Coba Lagi</button>
      </div>
    </Layout>
  );

  if (!globalProcessedData) return null;

  const {
    totalGames, avgRating, topGame,
    gamesPerYear, top10RatingCounts, genreData, genrePopularityData, platformData, tagData,
    top10PublisherPeminat, top5InterestTable,
    topGenre, topPlatform, peakYear, dominantGenreForHighRated
  } = globalProcessedData;

  return (
    <Layout>
      {/* HEADER */}
      <header className="dashboard-header fade-slide-up delay-1">
        <div className="header-title">
          <h1><span>Video Games</span> Dashboard</h1>
          <p>Visualisasi komprehensif metrik performa dan sentimen komunitas dari ratusan ribu judul video game.</p>
        </div>
        <div className="filter-container">
          <button className="filter-toggle-btn" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            Filters
          </button>

          {isFilterOpen && (
            <div className="filter-dropdown-panel fade-slide-up">
              <div className="filter-group">
                <label>Tahun Rilis</label>
                <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)} className="panel-filter-select">
                  <option value="">Semua Tahun</option>
                  {Array.from({ length: 25 }, (_, i) => 2024 - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Genre Game</label>
                <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)} className="panel-filter-select">
                  <option value="">Semua Genre</option>
                  {globalProcessedData.dropdowns.genres.map(g => (
                    <option key={g.id} value={g.slug}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Tag & Fitur</label>
                <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="panel-filter-select">
                  <option value="">Semua Tag</option>
                  {globalProcessedData.dropdowns.tags.map(t => (
                    <option key={t.id} value={t.slug}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Publisher</label>
                <select value={filterPublisher} onChange={(e) => setFilterPublisher(e.target.value)} className="panel-filter-select">
                  <option value="">Semua Publisher</option>
                  {globalProcessedData.dropdowns.publishers.map(p => (
                    <option key={p.id} value={p.slug}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* KPI GRID (5 Items) */}
      <section className="kpi-grid">
        <KPI icon="🎮" label="Total Games" value={totalGames} subText="Semua game termuat dari RAWG" animationDelay="delay-1" />
        <KPI icon="⭐" label="Average Rating" value={avgRating.toFixed(2)} subText="Skala 0 - 5" animationDelay="delay-1" />
        <KPI icon="🏆" label="Top Rated Game" value={topGame?.name} subText={`Rating: ${topGame?.rating?.toFixed(2)}`} animationDelay="delay-2" />
        <KPI icon="🎲" label="Most Common Genre" value={topGenre?.name} subText={`${topGenre?.value} Game`} animationDelay="delay-2" />
        <KPI icon="🕹️" label="Most Popular Platform" value={topPlatform?.platform} subText={`${topPlatform?.count} Game`} animationDelay="delay-2" />
      </section>

      {/* CHARTS GRID */}
      <section className="chart-grid">
        {/* Visual Genre */}
        <PieChartComp
          data={genreData}
          title="Proporsi Distribusi Genre"
          subtitle="Persentase penyumbang klasifikasi genre di pasar"
          animationDelay="delay-2"
        />
        <GenrePopularityRadarChartComp
          data={genrePopularityData}
          title="Popularitas Genre Overall"
          subtitle="Memetakan sebaran genre paling murni yang melibatkan rating dan kuantitas"
          animationDelay="delay-2"
        />

        {/* Publisher */}
        <PlatformBarChartComp
          data={platformData}
          title="Dukungan Terkuat Platform"
          subtitle="Grafik membandingkan kuantitas suplai game di berbagai platform"
          animationDelay="delay-3"
        />
        <BarChartComp
          data={top10PublisherPeminat}
          title="Top 10 Publisher Paling Diminati"
          subtitle="Komparasi publisher berdasarkan total interaksi peminat (added) dari seluruh portofolio top game mereka"
          dataKey="totalPeminat"
          xAxisKey="name"
          labelKey="Total Peminat / Wishlist"
          animationDelay="delay-3"
        />

        {/* Tag */}
        <TagsComposedChartComp
          data={tagData}
          title="Identitas Tags Permainan"
          subtitle="Membedah pengelompokan kultur gameplay dari dataset ini"
          animationDelay="delay-4"
        />

        {/* Game */}
        <RatingTrendAreaChartComp
          data={gamesPerYear}
          title="Tren Kualitas Game"
          subtitle="Grafik menunjukkan tren rata-rata rating game berdasar tahun rilis"
          animationDelay="delay-4"
        />
        <LineChartComp
          data={gamesPerYear}
          title="Tren Kuantitas Perilisan"
          subtitle="Grafik menunjukkan tren jumlah perilisan game ke pasar per tahun"
          animationDelay="delay-5"
        />
        <BarChartComp
          data={top10RatingCounts}
          title="Top 10 Game dengan Total Rating atau Review Terbanyak"
          subtitle="Grafik komparatif top 10 game berdasarkan daya tarik pengulas"
          dataKey="ratings_count"
          labelKey="Total Ratings"
          animationDelay="delay-5"
        />

        <div className={`chart-card publisher-hype-card fade-slide-up delay-5`}>
          <div className="chart-header">
            <h2 className="chart-title">Top 5 Game Hype Komunitas</h2>
            <p className="chart-subtitle">Skor Hype berdasarkan akumulasi ketertarikan komunitas terhadap judul tertentu</p>
          </div>
          <div className="publisher-hype-table">
            <table>
              <thead>
                <tr>
                  <th>Peringkat</th>
                  <th>Judul Game</th>
                  <th>Skor Hype</th>
                </tr>
              </thead>
              <tbody>
                {top5InterestTable.map((game, idx) => (
                  <tr key={idx}>
                    <td><span className="rank-badge">#{idx + 1}</span></td>
                    <td className="pub-name">{game.name}</td>
                    <td className="pub-hype">{game.hypeScore.toLocaleString('id-ID')} Interaksi</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TABLE DATA GAME */}
      <Table
        data={tableData}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        animationDelay="delay-5"
      />

      {/* INSIGHTS */}
      <Insights
        totalGames={totalGames}
        avgRating={avgRating}
        topGame={topGame}
        peakYear={peakYear}
        topGenre={topGenre}
        topTag={tagData?.[0]}
        dominantGenreForHighRated={dominantGenreForHighRated}
        topPlatform={topPlatform ? [topPlatform.platform, topPlatform.count] : null}
        animationDelay="delay-5"
      />
    </Layout>
  );
}

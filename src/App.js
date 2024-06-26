import React, { useState, useEffect } from "react";
import Modal from './Modal.js'

function App() {
  const [movies, setMovies] = useState(null);
  const [details, setDetails] = useState(null);
  const [genre, setGenre] = useState('All');
  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch('https://code-challenge.spectrumtoolbox.com/api/movies',
          {
            headers: {
              Authorization: 'Api-Key q3MNxtfep8Gt'
            },
          });
        const result = await response.json();
        setMovies(result.data);
        setFilter(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (!movies) fetchMovies();
    let filtered = [];
    if (genre === 'All') {
      filtered = movies
      setFilter(movies)
    } else if (genre !== 'All') {
      movies.forEach((m) => {
        if (m.genres.includes(genre)) {
          filtered.push(m)
        }
      })
    }
    let filterBySearch = filtered;
    if (search) {
      filterBySearch = [];
      filtered.forEach((m) => {
        if (m.title.toUpperCase().includes(search.toUpperCase())) {
          filterBySearch.push(m)
        }
      })
    }
    setFilter(filterBySearch)

  }, [genre, search]);

  const switchModal = () => {
    if (isModalOpen) {
      setModalOpen(false)
    } else {
      setModalOpen(true)
    }
  }

  const changeVal = (setState) => (e) => {
    let val = e.target.value;
    setState(val)
  }

  const fetchDetails = async (id) => {
    try {
      const response = await fetch(`https://code-challenge.spectrumtoolbox.com/api/movies/${id}`,
        {
          headers: {
            Authorization: 'Api-Key q3MNxtfep8Gt'
          },
        });
      const result = await response.json();
      setDetails(result.data);
      switchModal()
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  let movieDetails = null;
  let genreWheel = [<option key='All'>All</option>];

  if (loading) {
    return <p>Loading...</p>;
  }

  if (movies) {
    let genreSet = new Set();
    movies.forEach((m) => {
      m.genres.forEach((g) => {
        genreSet.add(g)
      })
    })
    let genres = Array.from(genreSet);
    genres.forEach((g) => {
      genreWheel.push(<option key={g} val={g}>{g}</option>)
    })
  }

  if (details) {
    let moods = null;
    if (details.moods.length > 0) moods = <span><strong>Moods:</strong> {details.moods.join(', ')}</span>
    let topCast = [];
    details.topCast.forEach((a) => {
      if (a.characterName) { // accounts for missing character names at end of each Top Cast array
        topCast.push(
          <div key={a.name}>
            <span>{a.name} as {a.characterName}</span>
            <br />
          </div>)
      }
    })
    movieDetails =
      <div className='details'>
        <h2>{details.title}</h2>
        <span>{details.description}</span><br />
        <br /><span><strong>Duration:</strong> {details.duration / 60} min</span><br />
        <span><strong>Release Year:</strong> {details.releaseYear}</span><br />
        <span><strong>Genre(s):</strong> {details.genres.join(', ')}</span><br />
        <br /><><strong>Top Cast:</strong><br />{topCast}</>
        {moods}
      </div>
  }

  return (
    <div className='Page'>
      <h1>Film Finder</h1><br />
      <span className='filters'>
        <div>Filter by Genre:&emsp;
          <select onChange={changeVal(setGenre)}>{genreWheel}</select>
        </div>
        <input onChange={changeVal(setSearch)} className='searchInput' name='name' type='text' placeholder='Search by Title' />
      </span>
      {(filter && filter.length > 0) ? (
        <div className='allMovies'>
          {filter.map((mov) => (
            <div className='movieBox' key={mov.id} onClick={() => fetchDetails(mov.id)}>
              <img className='poster'
                src={`../public/moviePosterImages/${mov.id}.jpeg`}
                alt={mov.title}
                onError={(e) => {
                  console.log(`No image found for ${mov.title}, default image used`)
                  e.target.src = '../public/moviePosterImages/defaultImage.jpeg';
                }}
              />
              <span>{mov.title}</span>
            </div>
          ))}
        </div>
      ) : <p className='noMovies'>Sorry, no matches found</p>}
      <Modal isOpen={isModalOpen} closeModal={switchModal}>
        {movieDetails}
      </Modal>
    </div>
  );

};

export default App;

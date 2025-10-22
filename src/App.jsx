import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentItem, setCurrentItem] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRandomCat = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.thecatapi.com/v1/breeds');
      const data = await response.json();
      
      const availableCats = data.filter(cat => 
        !banList.some(banItem => 
          banItem.type === 'breed' && banItem.value === cat.name
        )
      );
      
      if (availableCats.length === 0) {
        alert('No more cats available based on your ban list!');
        return;
      }
      
      const randomCat = availableCats[Math.floor(Math.random() * availableCats.length)];
      
      const imageResponse = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${randomCat.id}`);
      const imageData = await imageResponse.json();
      
      const catWithImage = {
        ...randomCat,
        image: imageData[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'
      };
      
      setCurrentItem(catWithImage);
      setHistory(prev => [catWithImage, ...prev]);
    } catch (error) {
      console.error('Error fetching cat data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAttributeClick = (type, value) => {
    const isBanned = banList.some(item => item.type === type && item.value === value);
    
    if (isBanned) {
      setBanList(banList.filter(item => !(item.type === type && item.value === value)));
    } else {
      setBanList([...banList, { type, value }]);
    }
  };

  const isAttributeBanned = (type, value) => {
    return banList.some(item => item.type === type && item.value === value);
  };

  useEffect(() => {
    fetchRandomCat();
  }, []);

  return (
    <div className="App">
      <header className="app-header">
        <h1>Project 4 - Cats API</h1>
        <p>Discover cats across the world</p>
      </header>

      <main className="app-main">
        <div className="discovery-section">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : currentItem ? (
            <div className="current-item">
              <div className="item-image">
                <img src={currentItem.image} alt={currentItem.name} />
              </div>
              
              <div className="item-info">
                <h2>{currentItem.name}</h2>
                
                <div className="attributes">
                  <div 
                    className={`attribute ${isAttributeBanned('origin', currentItem.origin) ? 'banned' : ''}`}
                    onClick={() => handleAttributeClick('origin', currentItem.origin)}
                  >
                    <strong>Origin:</strong> {currentItem.origin}
                  </div>
                  
                  <div 
                    className={`attribute ${isAttributeBanned('weight', currentItem.weight.metric) ? 'banned' : ''}`}
                    onClick={() => handleAttributeClick('weight', currentItem.weight.metric)}
                  >
                    <strong>Weight:</strong> {currentItem.weight.metric} kg
                  </div>
                  
                  <div 
                    className={`attribute ${isAttributeBanned('lifespan', currentItem.life_span) ? 'banned' : ''}`}
                    onClick={() => handleAttributeClick('lifespan', currentItem.life_span)}
                  >
                    <strong>Lifespan:</strong> {currentItem.life_span} years
                  </div>
                  
                  <div 
                    className={`attribute ${isAttributeBanned('temperament', currentItem.temperament) ? 'banned' : ''}`}
                    onClick={() => handleAttributeClick('temperament', currentItem.temperament)}
                  >
                    <strong>Temperament:</strong> {currentItem.temperament}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data">No cat data available</div>
          )}
          
          <button 
            className="discover-btn"
            onClick={fetchRandomCat}
            disabled={loading}
          >
            {loading ? 'Discovering...' : 'Discover!'}
          </button>
        </div>

        <div className="ban-list-section">
          <h3>Ban List</h3>
          <p>Select an attribute in your listing to ban it:</p>
          
          {banList.length === 0 ? (
            <p className="empty-ban-list">No items in ban list</p>
          ) : (
            <ul className="ban-list">
              {banList.map((item, index) => (
                <li 
                  key={index} 
                  className="ban-item"
                  onClick={() => handleAttributeClick(item.type, item.value)}
                >
                  <strong>{item.type}:</strong> {item.value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="history-section">
          <h3>Previously Discovered</h3>
          <div className="history-grid">
            {history.slice(1).map((item, index) => (
              <div key={index} className="history-item">
                <img src={item.image} alt={item.name} />
                <p>{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
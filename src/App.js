import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import './App.css';
import { debounce } from 'lodash';

function App() {
  const [cardName, setCardName] = useState('');
  const [cardData, setCardData] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchCard = async () => {
    try {
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=${cardName}`);
      setCardData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const openModal = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCard(null);
    setIsModalOpen(false);
  };

  const debouncedSearchCard = debounce(async (name) => {
    try {
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=${name}`);
      setCardData(response.data);
    } catch (error) {
      console.error(error);
    }
  }, 300);

  const handleInputChange = (e) => {
    const inputName = e.target.value;
    setCardName(inputName);
    if (inputName.trim() === '') {
      setCardData(null);
    } else {
      debouncedSearchCard(inputName);
    }
  };

  return (
    <div className="mtg-deck-viewer">
      <h1 className="header">MTG Card Viewer</h1>
      <div className="search-container">
        <input
          type="text"
          value={cardName}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              searchCard();
            }
          }}
        />
        <button onClick={searchCard}>Search</button>
      </div>

      {cardData && cardData.data && cardData.data.length > 0 && (
        <div className="cards-container">
          <h2 className="subheader">Cards Found:</h2>
          <div className="card-images">
            {cardData.data.map((card) => (
              <div key={card.id} className="card" onClick={() => openModal(card)}>
                <h3 className="card-title">{card.name}</h3>
                {card.image_uris && card.image_uris.small && (
                  <img src={card.image_uris.small} alt={card.name} className="card-image" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={closeModal} card={selectedCard} />
    </div>
  );
}

export default App;

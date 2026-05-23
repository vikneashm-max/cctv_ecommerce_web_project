import React from 'react';
import './FavoritesPage.css';

interface Product {
  id: number;
  img: string;
  name: string;
  price: string;
  sub: string;
  category: string;
}

interface FavoritesPageProps {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  addToCart: (product: Product) => void;
}

const FavoritesPage: React.FC<FavoritesPageProps> = ({ favorites, toggleFavorite, addToCart }) => {


  return (
    <div className="favorites-container">


      <main className="favorites-content">
        <header className="favorites-header">

          <h1>My Favorites</h1>
          <p>Items you've saved for later</p>
        </header>

        <div className="favorites-grid">
          {favorites.length > 0 ? (
            favorites.map((item) => (
              <div key={item.id} className="favorite-card">
                <div className="fav-img-wrapper">
                  <img src={item.img} alt={item.name} />
                  <button className="remove-fav" onClick={() => toggleFavorite(item)}>
                    <svg viewBox="0 0 24 24" width="18" fill="#f97316" stroke="#f97316" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="fav-info">
                  <h3>{item.name}</h3>
                  <p className="fav-sub">{item.sub}</p>
                  <div className="fav-footer">
                    <span className="fav-price">{item.price}</span>
                    <button className="add-to-cart-btn" onClick={() => addToCart(item)}>ADD TO CART</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-favorites">
              <p>You haven't added any favorites yet.</p>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default FavoritesPage;

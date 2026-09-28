import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";
import getImageUrl from "../utils/image";

function Favorites() {
  const [animals, setAnimals] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Favorites IDs localStorage se load
  useEffect(() => {
    try {
      const savedFavorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

      setFavoriteIds(savedFavorites);
    } catch (error) {
      console.log("Favorites load error:", error);
      setFavoriteIds([]);
    }
  }, []);

  // MongoDB se animals load
  useEffect(() => {
    const getAnimals = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          "http://localhost:5000/api/animals"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Animals load nahi ho sake."
          );
          return;
        }

        setAnimals(data.animals || []);
      } catch (error) {
        console.error(error);
        setError("Server se connection nahi ho raha.");
      } finally {
        setLoading(false);
      }
    };

    getAnimals();
  }, []);

  // Sirf favorite animals
  const favoriteAnimals = animals.filter((animal) =>
    favoriteIds.includes(animal._id)
  );

  // Remove favorite
  const removeFavorite = (id) => {
    const updatedFavorites = favoriteIds.filter(
      (favoriteId) => favoriteId !== id
    );

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );

    setFavoriteIds(updatedFavorites);
  };

  return (
    <div className="favorites-page">

      {/* Navbar */}
      <nav className="favorites-navbar">

        <Link
          to="/"
          className="favorites-logo"
        >
          🐄 JanwarMart
        </Link>

        <Link
          to="/"
          className="back-home"
        >
          ← Back to Home
        </Link>

      </nav>

      {/* Main */}
      <main className="favorites-container">

        <div className="favorites-heading">

          <h1>❤️ My Favorites</h1>

          {!loading && !error && (
            <p>
              {favoriteAnimals.length}{" "}
              {favoriteAnimals.length === 1
                ? "animal"
                : "animals"}{" "}
              saved in your favorites.
            </p>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="empty-favorites">

            <div className="empty-icon">
              🐾
            </div>

            <h2>Loading Favorites...</h2>

            <p>
              Animals load ho rahe hain.
            </p>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="empty-favorites">

            <div className="empty-icon">
              ⚠️
            </div>

            <h2>Something went wrong</h2>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* No Favorites */}
        {!loading &&
          !error &&
          favoriteAnimals.length === 0 && (

            <div className="empty-favorites">

              <div className="empty-icon">
                ♡
              </div>

              <h2>No Favorites Yet</h2>

              <p>
                You haven't added any animals
                to your favorites.
              </p>

              <Link
                to="/"
                className="browse-btn"
              >
                Browse Animals
              </Link>

            </div>
          )}

        {/* Favorites */}
        {!loading &&
          !error &&
          favoriteAnimals.length > 0 && (

            <div className="favorites-grid">

              {favoriteAnimals.map((animal) => (

                <div
                  className="favorite-card"
                  key={animal._id}
                >

                  {/* Image */}
                  <div className="favorite-image">

                    {/* <img
                      src={
                        animal.image?.startsWith("http")
                          ? animal.image
                          : `http://localhost:5000${animal.image}`
                      }
                      alt={animal.name}
                    /> */}
                    <img
                      src={getImageUrl(animal.image)}
                      alt={animal.name}
                    />
                    <span className="favorite-label">
                      ♥ Favorite
                    </span>

                  </div>

                  {/* Content */}
                  <div className="favorite-card-content">

                    <span className="animal-type">
                      {animal.type}
                    </span>

                    <h2>
                      {animal.name}
                    </h2>

                    <p className="animal-location">
                      📍 {animal.location}
                    </p>

                    <div className="animal-info">

                      <span>
                        Age: {animal.age}
                      </span>

                      <span>
                        Gender: {animal.gender}
                      </span>

                    </div>

                    <h3>
                      Rs.{" "}
                      {Number(
                        animal.price
                      ).toLocaleString()}
                    </h3>

                    {/* Buttons */}
                    <div className="favorite-actions">

                      <Link
                        to={`/animal/${animal._id}`}
                        className="view-btn"
                      >
                        View Details
                      </Link>

                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() =>
                          removeFavorite(
                            animal._id
                          )
                        }
                      >
                        🗑 Remove
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </main>

      {/* Footer */}
      <footer className="favorites-footer">

        <p>
          © 2026 JanwarMart. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Favorites;
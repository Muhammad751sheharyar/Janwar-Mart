import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./CategoryPage.css";
import getImageUrl from "../utils/image";

function CategoryPage() {
  const { category } = useParams();

  const [animals, setAnimals] = useState([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All");
  const [gender, setGender] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Favorites localStorage se load
  const [favoriteIds, setFavoriteIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch (error) {
      return [];
    }
  });

  // MongoDB se animals load
  useEffect(() => {
    const getAnimals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/animals"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Animals load nahi ho sake.");
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

  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

  // Favorite add/remove
  const handleFavorite = (animalId) => {
    try {
      const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

      if (favorites.includes(animalId)) {
        const updatedFavorites = favorites.filter(
          (id) => id !== animalId
        );

        localStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );

        setFavoriteIds(updatedFavorites);
      } else {
        const updatedFavorites = [
          ...favorites,
          animalId,
        ];

        localStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );

        setFavoriteIds(updatedFavorites);
      }
    } catch (error) {
      console.log("Favorite error:", error);
    }
  };

  // Filters
  const filteredAnimals = animals.filter((animal) => {
    const matchesCategory =
      animal.type?.toLowerCase() === category.toLowerCase();

    const matchesSearch =
      animal.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      animal.breed
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesLocation =
      location === "All" ||
      animal.location === location;

    const matchesGender =
      gender === "All" ||
      animal.gender === gender;

    return (
      matchesCategory &&
      matchesSearch &&
      matchesLocation &&
      matchesGender
    );
  });

  // Clear filters
  const clearFilters = () => {
    setSearch("");
    setLocation("All");
    setGender("All");
  };

  return (
    <div className="category-page">

      {/* Navbar */}
      <nav className="navbar">

        <Link to="/" className="logo">
          🐾 Janwar<span>Mart</span>
        </Link>

        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/animals/cow">
            Animals
          </Link>

          <Link to="/">
            Categories
          </Link>

          <Link to="/">
            About
          </Link>

          <Link to="/favorites">
            ❤️ Favorites
          </Link>

        </div>

        <div className="nav-buttons">

          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>

          <Link
            to="/sell-animal"
            className="sell-btn"
          >
            + Sell Animal
          </Link>

        </div>

      </nav>

      {/* Header */}
      <section className="category-header">

        <Link to="/" className="back-btn">
          ← Back to Home
        </Link>

        <h1>
          {categoryName}s
        </h1>

        <p>
          Find the best{" "}
          {categoryName.toLowerCase()}s
          available for sale
        </p>

      </section>

      {/* Filters */}
      <section className="filters-section">

        <input
          type="text"
          placeholder={`Search ${categoryName.toLowerCase()}...`}
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={location}
          onChange={(e) =>
            setLocation(e.target.value)
          }
        >
          <option value="All">
            All Locations
          </option>

          <option value="Karachi">
            Karachi
          </option>

          <option value="Lahore">
            Lahore
          </option>

          <option value="Islamabad">
            Islamabad
          </option>
        </select>

        <select
          value={gender}
          onChange={(e) =>
            setGender(e.target.value)
          }
        >
          <option value="All">
            All Genders
          </option>

          <option value="Male">
            Male
          </option>

          <option value="Female">
            Female
          </option>
        </select>

        <button
          onClick={clearFilters}
          className="clear-btn"
        >
          Clear Filters
        </button>

      </section>

      {/* Animals */}
      <section className="category-animals">

        <div className="category-title">

          <h2>
            Available {categoryName}s
          </h2>

          {!loading && (
            <span>
              {filteredAnimals.length} Animals Found
            </span>
          )}

        </div>

        {/* Loading */}
        {loading && (
          <div className="no-results">
            <div>🐾</div>
            <h3>Loading Animals...</h3>
            <p>
              MongoDB se animals load ho rahe hain.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="no-results">

            <div>⚠️</div>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* Animals */}
        {!loading &&
          !error &&
          filteredAnimals.length > 0 ? (

          <div className="animals-grid">

            {filteredAnimals.map((animal) => {

              const isFavorite =
                favoriteIds.includes(animal._id);

              return (
                <div
                  className="animal-card"
                  key={animal._id}
                >

                  {/* Image */}
                  <div className="animal-image">
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
                    {/* Favorite */}
                    <button
                      type="button"
                      className={`favorite-btn ${isFavorite ? "active" : ""
                        }`}
                      onClick={() =>
                        handleFavorite(animal._id)
                      }
                    >
                      {isFavorite ? "♥" : "♡"}
                    </button>

                  </div>

                  {/* Information */}
                  <div className="animal-info">

                    <h3>
                      {animal.name}
                    </h3>

                    <div className="animal-details">

                      <span>
                        🎂 {animal.age}
                      </span>

                      <span>
                        ⚥ {animal.gender}
                      </span>

                      <span>
                        📍 {animal.location}
                      </span>

                    </div>

                    <div className="animal-bottom">

                      <div>

                        <small>
                          Price
                        </small>

                        <strong>
                          Rs.{" "}
                          {Number(
                            animal.price
                          ).toLocaleString()}
                        </strong>

                      </div>

                      <Link
                        to={`/animal/${animal._id}`}
                        className="details-btn"
                      >
                        View Details
                      </Link>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (
          !loading &&
          !error && (
            <div className="no-results">

              <div>
                🐾
              </div>

              <h3>
                No {categoryName.toLowerCase()}s found
              </h3>

              <p>
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>
          )
        )}

      </section>

      {/* Footer */}
      <footer className="footer">

        <h2>
          🐾 JanwarMart
        </h2>

        <p>
          Pakistan's online marketplace for
          buying and selling animals.
        </p>

      </footer>

    </div>
  );
}

export default CategoryPage;
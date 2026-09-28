import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
} from "react-router-dom";

import "./App.css";

import CategoryPage from "./pages/CategoryPage";
import AnimalDetails from "./pages/AnimalDetails";
import Favorites from "./pages/Favorites";
import SellAnimal from "./pages/SellAnimal";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import EditAnimal from "./pages/EditAnimal";

import getImageUrl from "./utils/image";


function Home() {

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");


  // ============================
  // ANIMALS FROM BACKEND
  // ============================

  const [animals, setAnimals] = useState([]);
  const [loadingAnimals, setLoadingAnimals] =
    useState(true);
  const [animalError, setAnimalError] =
    useState("");


  // ============================
  // FETCH ANIMALS
  // ============================

  useEffect(() => {

    const fetchAnimals = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/animals"
        );

        const data = await response.json();

        if (!response.ok) {

          setAnimalError(
            data.message ||
            "Animals load nahi ho rahe."
          );

          return;
        }

        setAnimals(data.animals || []);

      } catch (error) {

        console.error(error);

        setAnimalError(
          "Backend se connection nahi ho raha."
        );

      } finally {

        setLoadingAnimals(false);

      }
    };

    fetchAnimals();

  }, []);


  // ============================
  // FAVORITES
  // ============================

  const [favoriteIds, setFavoriteIds] =
    useState(() => {

      try {

        return (
          JSON.parse(
            localStorage.getItem("favorites")
          ) || []
        );

      } catch (error) {

        return [];

      }

    });


  // ============================
  // CATEGORIES
  // ============================

  const categories = [

    {
      name: "Cow",
      label: "Cows",
      image: "/images/cow.jfif",
    },

    {
      name: "Buffalo",
      label: "Buffalo",
      image: "/images/cow.jfif",
    },

    {
      name: "Goat",
      label: "Goats",
      image: "/images/goat.jfif",
    },

    {
      name: "Sheep",
      label: "Sheep",
      image: "/images/sheep.jfif",
    },

    {
      name: "Horse",
      label: "Horses",
      image: "/images/horse.jfif",
    },

    {
      name: "Bird",
      label: "Birds",
      image: "/images/goat.jfif",
    },

    {
      name: "Dog",
      label: "Dogs",
      image: "/images/horse.jfif",
    },

    {
      name: "Cat",
      label: "Cats",
      image: "/images/sheep.jfif",
    },

  ];


  // ============================
  // CATEGORY SLIDER REF
  // ============================

  const categoriesRef = useRef(null);


  // ============================
  // CATEGORY SLIDER
  // ============================

  const slideCategories = (direction) => {

    if (!categoriesRef.current) {
      return;
    }

    categoriesRef.current.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });

  };


  // ============================
  // FAVORITE ADD / REMOVE
  // ============================

  const handleFavorite = (animalId) => {

    try {

      const favorites =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];


      if (favorites.includes(animalId)) {

        // Remove favorite

        const updatedFavorites =
          favorites.filter(
            (id) => id !== animalId
          );

        localStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );

        setFavoriteIds(updatedFavorites);

      } else {

        // Add favorite

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

      console.log(
        "Favorite error:",
        error
      );

    }

  };


  // ============================
  // SEARCH + CATEGORY FILTER
  // ============================

  const filteredAnimals = animals.filter(
    (animal) => {

      const searchText =
        search.toLowerCase();


      const matchesSearch =

        animal.name
          ?.toLowerCase()
          .includes(searchText)

        ||

        animal.type
          ?.toLowerCase()
          .includes(searchText)

        ||

        animal.location
          ?.toLowerCase()
          .includes(searchText)

        ||

        animal.breed
          ?.toLowerCase()
          .includes(searchText);


      const matchesCategory =

        selectedCategory === "All"

        ||

        animal.type?.toLowerCase() ===
        selectedCategory.toLowerCase();


      return (
        matchesSearch &&
        matchesCategory
      );

    }
  );


  // ============================
  // CLEAR FILTERS
  // ============================

  const clearFilters = () => {

    setSelectedCategory("All");
    setSearch("");

  };


  // ============================
  // MAIN UI
  // ============================

  return (

    <div className="app">


      {/* ================= NAVBAR ================= */}

      <nav className="navbar">

        <Link
          to="/"
          className="logo"
        >
          🐾 <span>Janwar</span>Mart
        </Link>


        <div className="nav-links">

          <Link to="/">
            Home
          </Link>

          <a href="#animals">
            Animals
          </a>

          <a href="#categories">
            Categories
          </a>

          <a href="#about">
            About
          </a>

          <Link to="/favorites">
            ❤️ Favorites
          </Link>

        </div>


        <div className="nav-buttons">
   
          <Link to="/profile" className="profile-link">
            <span className="navbar-profile-avatar">
              {localStorage.getItem("profileImage") ? (
                <img
                  src={localStorage.getItem("profileImage")}
                  alt="Profile"
                />
              ) : (
                JSON.parse(localStorage.getItem("user"))
                  ?.name
                  ?.charAt(0)
                  .toUpperCase() || "U"
              )}
            </span>
          </Link>

    

          {/* LOGIN ONLY WHEN USER IS NOT LOGGED IN */}

          {!localStorage.getItem("token") && (

            <Link
              to="/login"
              className="login-btn"
            >
              Login
            </Link>

          )}


          <Link
            to="/sell-animal"
            className="sell-btn"
          >
            + Sell Animal
          </Link>

        </div>

      </nav>


      {/* ================= HERO ================= */}

      <section
        className="hero"
        id="home"
      >

        <div className="hero-content">

          <p className="small-title">
            PAKISTAN'S ANIMAL MARKETPLACE
          </p>


          <h1>

            Find Your

            <span>
              Perfect Animal
            </span>

          </h1>


          <p className="hero-text">

            Buy and sell animals easily.
            Find trusted sellers, explore
            animals near you and get the
            best deals.

          </p>


          <div className="search-box">

            <span>
              🔍
            </span>


            <input
              type="text"
              placeholder="Search animals, breeds, location..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />


            <button>
              Search
            </button>

          </div>

        </div>


        <div className="hero-animal">

          <img
            src="/images/cow.jfif"
            alt="Sahiwal Cow"
          />

        </div>

      </section>


      {/* ================= CATEGORIES ================= */}

      <section
        className="categories-section"
        id="categories"
      >


        {/* CATEGORY HEADER */}

        <div className="categories-header">

          <h2>
            Explore Categories
          </h2>

          <p>
            Find the perfect animal for you
          </p>

        </div>


        {/* CATEGORY SLIDER */}

        <div className="categories-slider">


          {/* LEFT ARROW */}

          <button
            type="button"
            className="category-arrow left"
            onClick={() =>
              slideCategories("left")
            }
            aria-label="Previous categories"
          >
            ‹
          </button>


          {/* SLIDER TRACK */}

          <div
            className="categories-track"
            ref={categoriesRef}
          >

            {categories.map(
              (category) => (

                <Link
                  key={category.name}
                  to={`/animals/${category.name.toLowerCase()}`}
                  className="category-item"
                >

                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />


                  <span>
                    {category.name}
                  </span>

                </Link>

              )
            )}

          </div>


          {/* RIGHT ARROW */}

          <button
            type="button"
            className="category-arrow right"
            onClick={() =>
              slideCategories("right")
            }
            aria-label="Next categories"
          >
            ›
          </button>

        </div>

      </section>


      {/* ================= FEATURED ANIMALS ================= */}

      <section
        className="animals-section"
        id="animals"
      >


        <div className="section-heading">

          <h2>
            Featured Animals
          </h2>

          <p>
            Explore our latest available animals
          </p>

        </div>


        {/* LOADING */}

        {loadingAnimals && (

          <div className="no-results">

            <div>
              ⏳
            </div>

            <h3>
              Animals load ho rahe hain...
            </h3>

            <p>
              Please wait a moment.
            </p>

          </div>

        )}


        {/* ERROR */}

        {!loadingAnimals &&
          animalError && (

            <div className="no-results">

              <div>
                ⚠️
              </div>

              <h3>
                {animalError}
              </h3>

              <p>
                Make sure backend server
                is running.
              </p>

            </div>

          )}


        {/* ANIMALS */}

        {!loadingAnimals &&
          !animalError && (

            <div className="animals-grid">

              {filteredAnimals.map(
                (animal) => {

                  const isFavorite =
                    favoriteIds.includes(
                      animal._id
                    );


                  return (

                    <div
                      className="animal-card"
                      key={animal._id}
                    >


                      {/* IMAGE */}

                      <div className="animal-image">

                        <img
                          src={getImageUrl(
                            animal.image
                          )}
                          alt={animal.name}
                        />


                        {/* SMALL FAVORITE HEART */}

                        <button
                          type="button"
                          className={`favorite-btn ${isFavorite
                            ? "active"
                            : ""
                            }`}
                          onClick={() =>
                            handleFavorite(
                              animal._id
                            )
                          }
                          aria-label="Add to favorites"
                        >

                          {isFavorite
                            ? "♥"
                            : "♡"}

                        </button>

                      </div>


                      {/* CARD CONTENT */}

                      <div className="animal-card-content">

                        <span className="animal-type">
                          {animal.type}
                        </span>


                        <h3>
                          {animal.name}
                        </h3>


                        <p className="animal-location">
                          📍 {animal.location}
                        </p>


                        <div className="animal-info">

                          <span>
                            🎂 {animal.age}
                          </span>

                          <span>
                            ⚥ {animal.gender}
                          </span>

                        </div>


                        <div className="animal-bottom">

                          <div className="animal-price">

                            Rs.{" "}

                            {Number(
                              animal.price
                            ).toLocaleString()}

                          </div>


                          <Link
                            to={`/animal/${animal._id}`}
                            className="view-animal"
                          >
                            View Details
                          </Link>

                        </div>

                      </div>

                    </div>

                  );

                }
              )}

            </div>

          )}


        {/* NO RESULTS */}

        {!loadingAnimals &&
          !animalError &&
          filteredAnimals.length === 0 && (

            <div className="no-results">

              <div>
                🔍
              </div>

              <h3>
                No animals found
              </h3>

              <p>
                Try another search or category.
              </p>


              <button
                type="button"
                onClick={clearFilters}
              >
                Clear Filters
              </button>

            </div>

          )}

      </section>


      {/* ================= SELL CTA ================= */}

      <section className="cta">

        <div>

          <p>
            HAVE AN ANIMAL TO SELL?
          </p>

          <h2>
            Sell Your Animal Easily
          </h2>

          <p>
            Create your listing and
            connect with interested
            buyers.
          </p>

        </div>


        <Link
          to="/sell-animal"
          className="post-animal-link"
        >
          + Post Your Animal
        </Link>

      </section>


      {/* ================= FOOTER ================= */}

      <footer id="about">

        <div className="footer-logo">
          🐾 JanwarMart
        </div>


        <p>
          Pakistan's simple and trusted
          animal marketplace.
        </p>


        <p className="copyright">
          © 2026 JanwarMart. All rights reserved.
        </p>

      </footer>

    </div>

  );

}


/* ================= MAIN APP / ROUTES ================= */

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/animals/:category"
          element={<CategoryPage />}
        />

        <Route
          path="/animal/:id"
          element={<AnimalDetails />}
        />

        <Route
          path="/favorites"
          element={<Favorites />}
        />

        <Route
          path="/sell-animal"
          element={<SellAnimal />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/edit-animal/:id"
          element={<EditAnimal />}
        />

      </Routes>

    </BrowserRouter>

  );

}


export default App;
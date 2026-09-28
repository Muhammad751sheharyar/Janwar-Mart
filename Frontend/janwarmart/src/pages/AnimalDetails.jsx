import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./AnimalDetails.css";
import getImageUrl from "../utils/image";

function AnimalDetails() {
  const { id } = useParams();

  // ============================
  // STATES
  // ============================

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================
  // FAVORITE STATE
  // ============================

  const [isFavorite, setIsFavorite] = useState(() => {
    try {
      const savedFavorites =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

      return savedFavorites.includes(id);
    } catch (error) {
      console.log(
        "Favorite read error:",
        error
      );

      return false;
    }
  });

  // ============================
  // FETCH SINGLE ANIMAL
  // ============================

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/animals/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
            "Animal not found"
          );

          return;
        }

        setAnimal(data.animal);

      } catch (error) {
        console.error(error);

        setError(
          "Backend se connection nahi ho raha."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnimal();
  }, [id]);


  // ============================
  // FAVORITE ADD / REMOVE
  // ============================

  const handleFavorite = () => {
    try {
      const savedFavorites =
        JSON.parse(
          localStorage.getItem("favorites")
        ) || [];

      if (savedFavorites.includes(id)) {

        const updatedFavorites =
          savedFavorites.filter(
            (favoriteId) =>
              favoriteId !== id
          );

        localStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );

        setIsFavorite(false);

      } else {

        const updatedFavorites = [
          ...savedFavorites,
          id,
        ];

        localStorage.setItem(
          "favorites",
          JSON.stringify(updatedFavorites)
        );

        setIsFavorite(true);
      }

    } catch (error) {
      console.log(
        "Favorite error:",
        error
      );
    }
  };


  // ============================
  // LOADING
  // ============================

  if (loading) {
    return (
      <div className="not-found">

        <h2>
          Loading Animal...
        </h2>

        <p>
          Please wait.
        </p>

      </div>
    );
  }


  // ============================
  // ERROR / NOT FOUND
  // ============================

  if (error || !animal) {
    return (
      <div className="not-found">

        <h2>
          Animal Not Found
        </h2>

        <p>
          {error ||
            "This animal is no longer available."}
        </p>

        <Link to="/">
          ← Back to Home
        </Link>

      </div>
    );
  }


  // ============================
  // STATUS
  // ============================

  const isSold = animal.status === "Sold";

  const sellerEmail =
    animal.seller?.email || "";


  // ============================
  // MAIN UI
  // ============================

  return (
    <div className="details-page">

      {/* ================= NAVBAR ================= */}

      <nav className="details-navbar">

        <Link
          to="/"
          className="logo"
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


      {/* ================= MAIN ================= */}

      <main className="details-container">

        {/* ================= IMAGE ================= */}

        <div className="details-image-section">

          <img
            src={getImageUrl(animal.image)}
            alt={animal.name}
          />

          {/* Favorite Heart */}

          <button
            type="button"
            className={`heart-btn ${
              isFavorite
                ? "active"
                : ""
            }`}
            onClick={handleFavorite}
            aria-label="Add to favorites"
          >
            {isFavorite
              ? "♥"
              : "♡"}
          </button>

        </div>


        {/* ================= INFORMATION ================= */}

        <div className="details-info">

          {/* Animal Type */}

          <span className="animal-badge">
            {animal.type}
          </span>


          {/* STATUS */}

          <div
            style={{
              marginTop: "12px",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: "600",
                background: isSold
                  ? "#fee2e2"
                  : "#dcfce7",
                color: isSold
                  ? "#dc2626"
                  : "#16a34a",
              }}
            >
              {isSold
                ? "🔴 Sold"
                : "🟢 Available"}
            </span>
          </div>


          {/* Name */}

          <h1>
            {animal.name}
          </h1>


          {/* Location */}

          <p className="location">
            📍 {animal.location}
          </p>


          {/* Price */}

          <h2 className="price">
            Rs.{" "}
            {Number(
              animal.price
            ).toLocaleString()}
          </h2>


          {/* ================= ANIMAL INFO ================= */}

          <div className="info-grid">

            <div className="info-box">

              <span>
                Breed
              </span>

              <strong>
                {animal.breed}
              </strong>

            </div>


            <div className="info-box">

              <span>
                Age
              </span>

              <strong>
                {animal.age}
              </strong>

            </div>


            <div className="info-box">

              <span>
                Gender
              </span>

              <strong>
                {animal.gender}
              </strong>

            </div>


            <div className="info-box">

              <span>
                Location
              </span>

              <strong>
                {animal.location}
              </strong>

            </div>

          </div>


          {/* ================= DESCRIPTION ================= */}

          <div className="description">

            <h3>
              Description
            </h3>

            <p>
              {animal.description}
            </p>

          </div>


          {/* ================= SELLER ================= */}

          {animal.seller && (
            <div className="description">

              <h3>
                Seller Information
              </h3>

              <p>
                👤{" "}
                <strong>
                  {animal.seller.name}
                </strong>
              </p>

              <p>
                📧{" "}
                {animal.seller.email}
              </p>

            </div>
          )}


          {/* ================= BUTTONS ================= */}

          <div className="details-buttons">

            {!isSold ? (
              <>
                {/* CONTACT SELLER */}

                <button
                  type="button"
                  className="contact-btn"
                  onClick={() => {
                    if (sellerEmail) {
                      window.location.href =
                        `mailto:${sellerEmail}?subject=Interested in ${animal.name}`;
                    }
                  }}
                >
                  📞 Contact Seller
                </button>


                {/* FAVORITE */}

                <button
                  type="button"
                  className={`favorite-btn ${
                    isFavorite
                      ? "active"
                      : ""
                  }`}
                  onClick={handleFavorite}
                >
                  {isFavorite
                    ? "♥ Added to Favorites"
                    : "♡ Add to Favorites"}
                </button>
              </>
            ) : (

              /* SOLD MESSAGE */

              <div
                style={{
                  width: "100%",
                  padding: "14px 18px",
                  borderRadius: "10px",
                  background: "#fee2e2",
                  color: "#dc2626",
                  fontWeight: "600",
                  textAlign: "center",
                }}
              >
                🔴 This animal has already been sold.
              </div>

            )}

          </div>

        </div>

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="details-footer">

        <p>
          © 2026 JanwarMart.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default AnimalDetails;
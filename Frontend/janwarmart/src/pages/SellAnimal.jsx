import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SellAnimal.css";

const SellAnimal = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    location: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // IMAGE SELECT
  // =========================

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size 5MB se zyada nahi honi chahiye.");
      e.target.value = "";
      return;
    }

    setImage(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("name", formData.name);
      data.append("type", formData.type);
      data.append("breed", formData.breed);
      data.append("age", formData.age);
      data.append("gender", formData.gender);
      data.append("location", formData.location);
      data.append("price", formData.price);
      data.append("description", formData.description);

      // Image sirf agar select ki hai
      if (image) {
        data.append("image", image);
      }

      const response = await fetch(
        "http://localhost:5000/api/animals",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: data,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Animal post nahi ho saka"
        );
      }

      alert("Animal successfully posted! 🎉");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">

      <div className="sell-container">

        <div className="sell-header">
          <h1>🐄 Sell Your Animal</h1>

          <p>
            Apna animal JanwarMart par sell karne ke liye
            details fill karein.
          </p>
        </div>

        <form
          className="sell-form"
          onSubmit={handleSubmit}
        >

          {/* ================= IMAGE ================= */}

          <div className="form-group image-upload-group">

            <label>Animal Image</label>

            <div className="image-upload-box">

              {preview ? (
                <div className="image-preview">

                  <img
                    src={preview}
                    alt="Animal Preview"
                  />

                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setImage(null);
                      setPreview("");
                    }}
                  >
                    ✕ Remove
                  </button>

                </div>
              ) : (
                <label className="upload-label">

                  <span className="upload-icon">
                    📷
                  </span>

                  <span>
                    Click to choose animal image
                  </span>

                  <small>
                    JPG, PNG, WEBP — Max 5MB
                  </small>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jfif"
                    onChange={handleImageChange}
                    hidden
                  />

                </label>
              )}

            </div>

          </div>

          {/* ================= NAME ================= */}

          <div className="form-group">

            <label>Animal Name</label>

            <input
              type="text"
              name="name"
              placeholder="e.g. Sahiwal Cow"
              value={formData.name}
              onChange={handleChange}
              required
            />

          </div>

          {/* ================= TYPE ================= */}

          <div className="form-row">

            <div className="form-group">

              <label>Animal Type</label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select Type
                </option>

                <option value="Cow">
                  Cow
                </option>

                <option value="Buffalo">
                  Buffalo
                </option>

                <option value="Goat">
                  Goat
                </option>

                <option value="Sheep">
                  Sheep
                </option>

                <option value="Horse">
                  Horse
                </option>

                <option value="Bird">
                  Bird
                </option>

                <option value="Dog">
                  Dog
                </option>

                <option value="Cat">
                  Cat
                </option>

              </select>

            </div>

            {/* ================= BREED ================= */}

            <div className="form-group">

              <label>Breed</label>

              <input
                type="text"
                name="breed"
                placeholder="e.g. Sahiwal"
                value={formData.breed}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* ================= AGE + GENDER ================= */}

          <div className="form-row">

            <div className="form-group">

              <label>Age</label>

              <input
                type="text"
                name="age"
                placeholder="e.g. 2 Years"
                value={formData.age}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Gender</label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

              </select>

            </div>

          </div>

          {/* ================= LOCATION + PRICE ================= */}

          <div className="form-row">

            <div className="form-group">

              <label>Location</label>

              <input
                type="text"
                name="location"
                placeholder="e.g. Karachi"
                value={formData.location}
                onChange={handleChange}
                required
              />

            </div>

            <div className="form-group">

              <label>Price (PKR)</label>

              <input
                type="number"
                name="price"
                placeholder="e.g. 180000"
                value={formData.price}
                onChange={handleChange}
                min="1"
                required
              />

            </div>

          </div>

          {/* ================= DESCRIPTION ================= */}

          <div className="form-group">

            <label>Description</label>

            <textarea
              name="description"
              placeholder="Animal ke bare mein details likhein..."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              required
            />

          </div>

          {/* ================= SUBMIT ================= */}

          <button
            type="submit"
            className="sell-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Posting Animal..."
              : "🐾 Post Animal"}

          </button>

        </form>

      </div>

    </div>
  );
};

export default SellAnimal;
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./SellAnimal.css";

function EditAnimal() {
  const { id } = useParams();
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
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Existing animal load
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const getAnimal = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/animals/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Animal load nahi ho saka."
          );
          return;
        }

        const animal = data.animal;

        setFormData({
          name: animal.name || "",
          type: animal.type || "",
          breed: animal.breed || "",
          age: animal.age || "",
          gender: animal.gender || "",
          location: animal.location || "",
          price: animal.price || "",
          description: animal.description || "",
          image: animal.image || "",
        });
      } catch (error) {
        console.error(error);
        setError("Server se connection nahi ho raha.");
      } finally {
        setLoading(false);
      }
    };

    getAnimal();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/animals/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            price: Number(formData.price),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "Animal update nahi ho saka."
        );
        return;
      }

      alert("Animal successfully update ho gaya! 🎉");

      navigate("/profile");
    } catch (error) {
      console.error(error);
      setError("Server se connection nahi ho raha.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <h2>Loading Animal...</h2>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="profile-loading">
        <h2>{error}</h2>
        <Link to="/profile">
          ← Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="sell-page">
      <div className="sell-container">

        <div className="sell-header">
          <h1>✏️ Edit Animal</h1>
          <p>
            Apne animal ki information update karein.
          </p>
        </div>

        {error && (
          <div className="sell-error">
            {error}
          </div>
        )}

        <form
          className="sell-form"
          onSubmit={handleSubmit}
        >

          <div className="form-section">
            <h2>Animal Information</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Animal Name</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div className="form-group">
                <label>Breed</label>

                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age</label>

                <input
                  type="text"
                  name="age"
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

              <div className="form-group">
                <label>Location</label>

                <input
                  type="text"
                  name="location"
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
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>

            </div>
          </div>

          <div className="form-section">
            <h2>Description</h2>

            <div className="form-group">
              <label>Animal Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Animal Image</h2>

            <div className="form-group">
              <label>Image Path / URL</label>

              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="/images/cow.jfif"
              />
            </div>

            {formData.image && (
              <div className="image-preview">
                <img
                  src={formData.image}
                  alt={formData.name}
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
            }}
          >

            <button
              type="submit"
              className="sell-submit-btn"
              disabled={saving}
            >
              {saving
                ? "Updating..."
                : "💾 Update Animal"}
            </button>

            <Link
              to="/profile"
              className="sell-submit-btn"
              style={{
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Cancel
            </Link>

          </div>

        </form>
      </div>
    </div>
  );
}

export default EditAnimal;
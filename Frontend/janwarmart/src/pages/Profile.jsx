// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Profile.css";

// function Profile() {
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [animals, setAnimals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [animalsLoading, setAnimalsLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (!token) {
//       navigate("/login");
//       return;
//     }

//     const getProfile = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/auth/profile",
//           {
//             method: "GET",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//           navigate("/login");
//           return;
//         }

//         setUser(data.user);

//         localStorage.setItem(
//           "user",
//           JSON.stringify(data.user)
//         );
//       } catch (error) {
//         console.error(error);
//         setError("Server se connection nahi ho raha.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     const getMyAnimals = async () => {
//       try {
//         const response = await fetch(
//           "http://localhost:5000/api/animals"
//         );

//         const data = await response.json();

//         if (!response.ok) {
//           return;
//         }

//         const currentUser =
//           JSON.parse(localStorage.getItem("user"));

//         if (!currentUser) {
//           return;
//         }

//         const myAnimals = (data.animals || []).filter(
//           (animal) =>
//             animal.seller?._id === currentUser._id ||
//             animal.seller === currentUser._id
//         );

//         setAnimals(myAnimals);
//       } catch (error) {
//         console.error("My animals error:", error);
//       } finally {
//         setAnimalsLoading(false);
//       }
//     };

//     getProfile();
//     getMyAnimals();
//   }, [navigate]);

//   // =========================
//   // LOGOUT
//   // =========================

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/login");
//   };

//   // =========================
//   // DELETE ANIMAL
//   // =========================

//   const handleDelete = async (animalId) => {
//     const confirmDelete = window.confirm(
//       "Kya aap is animal ko delete karna chahte hain?"
//     );

//     if (!confirmDelete) {
//       return;
//     }

//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/animals/${animalId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         alert(
//           data.message ||
//             "Animal delete nahi ho saka."
//         );
//         return;
//       }

//       setAnimals((prevAnimals) =>
//         prevAnimals.filter(
//           (animal) => animal._id !== animalId
//         )
//       );

//       alert("Animal delete ho gaya.");
//     } catch (error) {
//       console.error(error);
//       alert("Server se connection nahi ho raha.");
//     }
//   };

//   // =========================
//   // MARK AS SOLD
//   // =========================

//   const handleMarkSold = async (animalId) => {
//     const confirmSold = window.confirm(
//       "Kya aap is animal ko Sold mark karna chahte hain?"
//     );

//     if (!confirmSold) {
//       return;
//     }

//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(
//         `http://localhost:5000/api/animals/${animalId}/sold`,
//         {
//           method: "PUT",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         alert(
//           data.message ||
//             "Animal ko Sold mark nahi kiya ja saka."
//         );
//         return;
//       }

//       setAnimals((prevAnimals) =>
//         prevAnimals.map((animal) =>
//           animal._id === animalId
//             ? {
//                 ...animal,
//                 status: "Sold",
//               }
//             : animal
//         )
//       );

//       alert("Animal Sold mark ho gaya 🔴");
//     } catch (error) {
//       console.error(error);
//       alert("Server se connection nahi ho raha.");
//     }
//   };

//   // =========================
//   // LOADING
//   // =========================

//   if (loading) {
//     return (
//       <div className="profile-loading">
//         <h2>Loading Profile...</h2>
//       </div>
//     );
//   }

//   // =========================
//   // ERROR
//   // =========================

//   if (error) {
//     return (
//       <div className="profile-loading">
//         <h2>{error}</h2>

//         <Link to="/login">
//           Go to Login
//         </Link>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   // =========================
//   // SOLD COUNT
//   // =========================

//   const soldAnimals = animals.filter(
//     (animal) => animal.status === "Sold"
//   ).length;

//   return (
//     <div className="profile-page">

//       <div className="profile-container">

//         {/* =========================
//             PROFILE HEADER
//         ========================= */}

//         <div className="profile-header">

//           <div className="profile-avatar">
//             {user.name
//               ?.charAt(0)
//               .toUpperCase()}
//           </div>

//           <div className="profile-info">

//             <h1>{user.name}</h1>

//             <p>{user.email}</p>

//             <span>
//               🐄 JanwarMart Member
//             </span>

//           </div>

//           <button
//             className="logout-btn"
//             onClick={handleLogout}
//           >
//             Logout
//           </button>

//         </div>

//         {/* =========================
//             STATS
//         ========================= */}

//         <div className="profile-stats">

//           <div className="stat-card">
//             <h2>{animals.length}</h2>
//             <p>My Animals</p>
//           </div>

//           <div className="stat-card">

//             <h2>
//               {JSON.parse(
//                 localStorage.getItem(
//                   "favorites"
//                 )
//               )?.length || 0}
//             </h2>

//             <p>Favorites</p>

//           </div>

//           <div className="stat-card">

//             <h2>{soldAnimals}</h2>

//             <p>Sold Animals</p>

//           </div>

//         </div>

//         {/* =========================
//             DASHBOARD
//         ========================= */}

//         <div className="profile-dashboard">

//           <h2>My Dashboard</h2>

//           <div className="dashboard-grid">

//             <Link
//               to="/sell-animal"
//               className="dashboard-card"
//             >

//               <div className="dashboard-icon">
//                 🐄
//               </div>

//               <h3>Sell an Animal</h3>

//               <p>
//                 Post your animal for sale
//               </p>

//             </Link>

//             <Link
//               to="/favorites"
//               className="dashboard-card"
//             >

//               <div className="dashboard-icon">
//                 ❤️
//               </div>

//               <h3>My Favorites</h3>

//               <p>
//                 View your favorite animals
//               </p>

//             </Link>

//             <Link
//               to="/"
//               className="dashboard-card"
//             >

//               <div className="dashboard-icon">
//                 🔍
//               </div>

//               <h3>Browse Animals</h3>

//               <p>
//                 Find animals available for sale
//               </p>

//             </Link>

//           </div>

//         </div>

//         {/* =========================
//             MY ANIMALS
//         ========================= */}

//         <div className="account-section">

//           <h2>🐄 My Animals</h2>

//           {animalsLoading ? (

//             <p>
//               Loading your animals...
//             </p>

//           ) : animals.length === 0 ? (

//             <div>

//               <p>
//                 Aap ne abhi koi animal post
//                 nahi kiya.
//               </p>

//               <Link to="/sell-animal">
//                 Post Your First Animal →
//               </Link>

//             </div>

//           ) : (

//             <div>

//               {animals.map((animal) => (

//                 <div
//                   key={animal._id}
//                   className="account-item"
//                 >

//                   {/* Animal Information */}

//                   <div>

//                     <strong>
//                       {animal.name}
//                     </strong>

//                     <span>
//                       {animal.type} •{" "}
//                       {animal.location} • Rs.{" "}
//                       {Number(
//                         animal.price
//                       ).toLocaleString()}
//                     </span>

//                     {/* STATUS */}

//                     <div
//                       style={{
//                         marginTop: "6px",
//                         fontWeight: "600",
//                         color:
//                           animal.status ===
//                           "Sold"
//                             ? "#d93025"
//                             : "#188038",
//                       }}
//                     >
//                       {animal.status ===
//                       "Sold"
//                         ? "🔴 Sold"
//                         : "🟢 Available"}
//                     </div>

//                   </div>

//                   {/* ACTION BUTTONS */}

//                   <div
//                     style={{
//                       display: "flex",
//                       gap: "10px",
//                       alignItems: "center",
//                       flexWrap: "wrap",
//                     }}
//                   >

//                     {/* VIEW */}

//                     <Link
//                       to={`/animal/${animal._id}`}
//                     >
//                       View
//                     </Link>

//                     {/* EDIT */}

//                     <Link
//                       to={`/edit-animal/${animal._id}`}
//                     >
//                       ✏️ Edit
//                     </Link>

//                     {/* MARK SOLD */}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleMarkSold(
//                           animal._id
//                         )
//                       }
//                       disabled={
//                         animal.status ===
//                         "Sold"
//                       }
//                       style={{
//                         border: "none",
//                         background:
//                           animal.status ===
//                           "Sold"
//                             ? "#eeeeee"
//                             : "#e8f5e9",
//                         color:
//                           animal.status ===
//                           "Sold"
//                             ? "#777"
//                             : "#188038",
//                         padding:
//                           "8px 12px",
//                         borderRadius: "6px",
//                         cursor:
//                           animal.status ===
//                           "Sold"
//                             ? "not-allowed"
//                             : "pointer",
//                         fontWeight: "600",
//                       }}
//                     >
//                       {animal.status ===
//                       "Sold"
//                         ? "🔴 Sold"
//                         : "🟢 Mark as Sold"}
//                     </button>

//                     {/* DELETE */}

//                     <button
//                       type="button"
//                       onClick={() =>
//                         handleDelete(
//                           animal._id
//                         )
//                       }
//                       style={{
//                         border: "none",
//                         background:
//                           "#ffe5e5",
//                         color: "#d93025",
//                         padding:
//                           "8px 12px",
//                         borderRadius: "6px",
//                         cursor: "pointer",
//                       }}
//                     >
//                       🗑 Delete
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           )}

//         </div>

//         {/* =========================
//             ACCOUNT INFORMATION
//         ========================= */}

//         <div className="account-section">

//           <h2>Account Information</h2>

//           <div className="account-item">

//             <strong>
//               Full Name
//             </strong>

//             <span>
//               {user.name}
//             </span>

//           </div>

//           <div className="account-item">

//             <strong>
//               Email Address
//             </strong>

//             <span>
//               {user.email}
//             </span>

//           </div>

//           <div className="account-item">

//             <strong>
//               Member Since
//             </strong>

//             <span>
//               {user.createdAt
//                 ? new Date(
//                     user.createdAt
//                   ).toLocaleDateString()
//                 : "Recently"}
//             </span>

//           </div>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default Profile;



import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // PROFILE IMAGE
  // =========================

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem("profileImage") || "";
  });


  // =========================
  // GET PROFILE
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const getProfile = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/login");
          return;
        }

        setUser(data.user);

        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      } catch (error) {
        console.error(error);

        setError(
          "Server se connection nahi ho raha."
        );
      } finally {
        setLoading(false);
      }
    };


    // =========================
    // GET MY ANIMALS
    // =========================

    const getMyAnimals = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/animals"
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const currentUser =
          JSON.parse(
            localStorage.getItem("user")
          );

        if (!currentUser) {
          return;
        }

        const myAnimals =
          (data.animals || []).filter(
            (animal) =>
              animal.seller?._id ===
                currentUser._id ||
              animal.seller === currentUser._id
          );

        setAnimals(myAnimals);
      } catch (error) {
        console.error(
          "My animals error:",
          error
        );
      } finally {
        setAnimalsLoading(false);
      }
    };


    getProfile();
    getMyAnimals();

  }, [navigate]);


  // =========================
  // PROFILE IMAGE UPLOAD
  // =========================

  const handleProfileImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }


    // Only images
    if (!file.type.startsWith("image/")) {
      alert("Sirf image file select karein.");
      return;
    }


    // Maximum 2MB
    if (file.size > 2 * 1024 * 1024) {
      alert(
        "Profile image 2MB se choti honi chahiye."
      );

      return;
    }


    const reader = new FileReader();

    reader.onloadend = () => {
      const imageData = reader.result;

      setProfileImage(imageData);

      localStorage.setItem(
        "profileImage",
        imageData
      );
    };

    reader.readAsDataURL(file);
  };


  // =========================
  // REMOVE PROFILE IMAGE
  // =========================

  const handleRemoveProfileImage = () => {
    setProfileImage("");

    localStorage.removeItem(
      "profileImage"
    );
  };


  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Profile image bhi remove karna ho
    // to ye line uncomment kar sakte ho:
    // localStorage.removeItem("profileImage");

    navigate("/login");
  };


  // =========================
  // DELETE ANIMAL
  // =========================

  const handleDelete = async (animalId) => {
    const confirmDelete =
      window.confirm(
        "Kya aap is animal ko delete karna chahte hain?"
      );

    if (!confirmDelete) {
      return;
    }

    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/animals/${animalId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Animal delete nahi ho saka."
        );

        return;
      }

      setAnimals((prevAnimals) =>
        prevAnimals.filter(
          (animal) =>
            animal._id !== animalId
        )
      );

      alert("Animal delete ho gaya.");

    } catch (error) {
      console.error(error);

      alert(
        "Server se connection nahi ho raha."
      );
    }
  };


  // =========================
  // MARK AS SOLD
  // =========================

  const handleMarkSold = async (animalId) => {
    const confirmSold =
      window.confirm(
        "Kya aap is animal ko Sold mark karna chahte hain?"
      );

    if (!confirmSold) {
      return;
    }

    const token =
      localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://localhost:5000/api/animals/${animalId}/sold`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(
          data.message ||
            "Animal ko Sold mark nahi kiya ja saka."
        );

        return;
      }

      setAnimals((prevAnimals) =>
        prevAnimals.map((animal) =>
          animal._id === animalId
            ? {
                ...animal,
                status: "Sold",
              }
            : animal
        )
      );

      alert(
        "Animal Sold mark ho gaya 🔴"
      );

    } catch (error) {
      console.error(error);

      alert(
        "Server se connection nahi ho raha."
      );
    }
  };


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="profile-loading">
        <h2>Loading Profile...</h2>
      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="profile-loading">

        <h2>{error}</h2>

        <Link to="/login">
          Go to Login
        </Link>

      </div>
    );
  }


  if (!user) {
    return null;
  }


  // =========================
  // SOLD COUNT
  // =========================

  const soldAnimals =
    animals.filter(
      (animal) =>
        animal.status === "Sold"
    ).length;


  // =========================
  // PROFILE LETTER
  // =========================

  const profileLetter =
    user.name
      ?.charAt(0)
      .toUpperCase() || "U";


  // =========================
  // FAVORITES COUNT
  // =========================

  const favoriteCount =
    JSON.parse(
      localStorage.getItem(
        "favorites"
      )
    )?.length || 0;


  return (

    <div className="profile-page">

      <div className="profile-container">


        {/* =========================
            PROFILE HEADER
        ========================= */}

        <div className="profile-header">


          {/* =========================
              PROFILE IMAGE
          ========================= */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >

            {/* IMAGE / LETTER */}

            <div
              className="profile-avatar"
              style={{
                width: "90px",
                height: "90px",
                minWidth: "90px",
                borderRadius: "50%",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#e8f5e9",
                color: "#39824a",
                fontSize: "34px",
                fontWeight: "700",
                border: "3px solid #d7ead9",
                boxSizing: "border-box",
              }}
            >

              {profileImage ? (

                <img
                  src={profileImage}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

              ) : (

                profileLetter

              )}

            </div>


            {/* UPLOAD */}

            <label
              htmlFor="profile-image-input"
              style={{
                cursor: "pointer",
                color: "#39824a",
                fontSize: "13px",
                fontWeight: "600",
              }}
            >
              📷 Change Photo
            </label>


            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleProfileImage}
              style={{
                display: "none",
              }}
            />


            {/* REMOVE */}

            {profileImage && (

              <button
                type="button"
                onClick={
                  handleRemoveProfileImage
                }
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#d93025",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Remove Photo
              </button>

            )}

          </div>


          {/* =========================
              PROFILE INFO
          ========================= */}

          <div className="profile-info">

            <h1>
              Mr. {user.name}
            </h1>

            <p>
              {user.email}
            </p>

            <span>
              🐄 JanwarMart Member
            </span>

          </div>


          {/* =========================
              LOGOUT
          ========================= */}

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>


        {/* =========================
            STATS
        ========================= */}

        <div className="profile-stats">

          <div className="stat-card">

            <h2>
              {animals.length}
            </h2>

            <p>
              My Animals
            </p>

          </div>


          <div className="stat-card">

            <h2>
              {favoriteCount}
            </h2>

            <p>
              Favorites
            </p>

          </div>


          <div className="stat-card">

            <h2>
              {soldAnimals}
            </h2>

            <p>
              Sold Animals
            </p>

          </div>

        </div>


        {/* =========================
            DASHBOARD
        ========================= */}

        <div className="profile-dashboard">

          <h2>
            My Dashboard
          </h2>


          <div className="dashboard-grid">


            <Link
              to="/sell-animal"
              className="dashboard-card"
            >

              <div className="dashboard-icon">
                🐄
              </div>

              <h3>
                Sell an Animal
              </h3>

              <p>
                Post your animal for sale
              </p>

            </Link>


            <Link
              to="/favorites"
              className="dashboard-card"
            >

              <div className="dashboard-icon">
                ❤️
              </div>

              <h3>
                My Favorites
              </h3>

              <p>
                View your favorite animals
              </p>

            </Link>


            <Link
              to="/"
              className="dashboard-card"
            >

              <div className="dashboard-icon">
                🔍
              </div>

              <h3>
                Browse Animals
              </h3>

              <p>
                Find animals available for sale
              </p>

            </Link>


          </div>

        </div>


        {/* =========================
            MY ANIMALS
        ========================= */}

        <div className="account-section">

          <h2>
            🐄 My Animals
          </h2>


          {animalsLoading ? (

            <p>
              Loading your animals...
            </p>

          ) : animals.length === 0 ? (

            <div>

              <p>
                Aap ne abhi koi animal post
                nahi kiya.
              </p>

              <Link to="/sell-animal">
                Post Your First Animal →
              </Link>

            </div>

          ) : (

            <div>

              {animals.map(
                (animal) => (

                  <div
                    key={animal._id}
                    className="account-item"
                  >


                    {/* ANIMAL INFORMATION */}

                    <div>

                      <strong>
                        {animal.name}
                      </strong>

                      <span>
                        {animal.type} •{" "}
                        {animal.location} • Rs.{" "}
                        {Number(
                          animal.price
                        ).toLocaleString()}
                      </span>


                      {/* STATUS */}

                      <div
                        style={{
                          marginTop: "6px",
                          fontWeight: "600",
                          color:
                            animal.status ===
                            "Sold"
                              ? "#d93025"
                              : "#188038",
                        }}
                      >

                        {animal.status ===
                        "Sold"
                          ? "🔴 Sold"
                          : "🟢 Available"}

                      </div>

                    </div>


                    {/* ACTION BUTTONS */}

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >


                      {/* VIEW */}

                      <Link
                        to={`/animal/${animal._id}`}
                      >
                        View
                      </Link>


                      {/* EDIT */}

                      <Link
                        to={`/edit-animal/${animal._id}`}
                      >
                        ✏️ Edit
                      </Link>


                      {/* MARK SOLD */}

                      <button
                        type="button"
                        onClick={() =>
                          handleMarkSold(
                            animal._id
                          )
                        }
                        disabled={
                          animal.status ===
                          "Sold"
                        }
                        style={{
                          border: "none",
                          background:
                            animal.status ===
                            "Sold"
                              ? "#eeeeee"
                              : "#e8f5e9",
                          color:
                            animal.status ===
                            "Sold"
                              ? "#777"
                              : "#188038",
                          padding:
                            "8px 12px",
                          borderRadius:
                            "6px",
                          cursor:
                            animal.status ===
                            "Sold"
                              ? "not-allowed"
                              : "pointer",
                          fontWeight:
                            "600",
                        }}
                      >

                        {animal.status ===
                        "Sold"
                          ? "🔴 Sold"
                          : "🟢 Mark as Sold"}

                      </button>


                      {/* DELETE */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            animal._id
                          )
                        }
                        style={{
                          border: "none",
                          background:
                            "#ffe5e5",
                          color:
                            "#d93025",
                          padding:
                            "8px 12px",
                          borderRadius:
                            "6px",
                          cursor:
                            "pointer",
                        }}
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>


        {/* =========================
            ACCOUNT INFORMATION
        ========================= */}

        <div className="account-section">

          <h2>
            Account Information
          </h2>


          <div className="account-item">

            <strong>
              Full Name
            </strong>

            <span>
              Mr. {user.name}
            </span>

          </div>


          <div className="account-item">

            <strong>
              Email Address
            </strong>

            <span>
              {user.email}
            </span>

          </div>


          <div className="account-item">

            <strong>
              Member Since
            </strong>

            <span>

              {user.createdAt
                ? new Date(
                    user.createdAt
                  ).toLocaleDateString()
                : "Recently"}

            </span>

          </div>

        </div>


      </div>

    </div>

  );
}

export default Profile;
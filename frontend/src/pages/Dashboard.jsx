import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Dashboard({ setToken }) {
  const [user, setUser] = useState(null);
  const [properties, setProperties] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const userRes = await API.get("/auth/me");
      setUser(userRes.data);
    } catch (error) {
      console.error("User fetch error:", error.response?.data || error.message);
      logout();
      return;
    }

    try {
      const propertyRes = await API.get("/properties");
      setProperties(propertyRes.data);
    } catch (error) {
      console.error(
        "Property fetch error:",
        error.response?.data || error.message,
      );
      setMessage("Could not load properties");
    }

    try {
      const favouriteRes = await API.get("/favourites");
      setFavourites(favouriteRes.data);
    } catch (error) {
      console.error(
        "Favourite fetch error:",
        error.response?.data || error.message,
      );
      setMessage("Could not load favourites");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isFavourite = (propertyId) => {
    return favourites.some((fav) => fav.property?._id === propertyId);
  };

  const handleFavouriteToggle = async (propertyId) => {
    try {
      if (isFavourite(propertyId)) {
        await API.delete(`/favourites/${propertyId}`);
        setMessage("Removed from favourites");
      } else {
        await API.post(`/favourites/${propertyId}`);
        setMessage("Added to favourites");
      }

      const favouriteRes = await API.get("/favourites");
      setFavourites(favouriteRes.data);
    } catch (error) {
      console.error(
        "Favourite action error:",
        error.response?.data || error.message,
      );
      setMessage(error.response?.data?.message || "Action failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="dashboard">
      <div className="topbar">
        <div>
          <h2>Buyer Dashboard</h2>
          <p>Welcome, {user?.name}</p>
        </div>

        <button className="btn-red" onClick={logout}>Logout</button>
      </div>

      {message && <p className="success">{message}</p>}

      <h3>All Properties</h3>
      <div className="grid">
        {properties.length > 0 ? (
          properties.map((property) => (
            <div className="card property-card" key={property._id}>
              <h4>{property.title}</h4>
              <p>
                <strong>Location:</strong> {property.location}
              </p>
              <p>
                <strong>Price:</strong> Rs. {property.price}
              </p>
              <p>{property.description}</p>

              <button onClick={() => handleFavouriteToggle(property._id)}>
                {isFavourite(property._id)
                  ? "Remove Favourite"
                  : "Add Favourite"}
              </button>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>

      <h3>My Favourites</h3>
      <div className="grid">
        {favourites.length > 0 ? (
          favourites.map((fav) => (
            <div className="card property-card" key={fav._id}>
              <h4>{fav.property?.title}</h4>
              <p>
                <strong>Location:</strong> {fav.property?.location}
              </p>
              <p>
                <strong>Price:</strong> Rs. {fav.property?.price}
              </p>
              <button onClick={() => handleFavouriteToggle(fav.property?._id)}>
                Remove Favourite
              </button>
            </div>
          ))
        ) : (
          <p>No favourites yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

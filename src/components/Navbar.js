import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";

function Navbar({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div style={{
      ...styles.nav,
      backgroundColor: darkMode ? "#1f2937" : "#ffffff",
      color: darkMode ? "#ffffff" : "#000000"
    }}>
      <h2 style={{ margin: 0 }}>NeoBank</h2>

      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <button
          style={styles.toggleBtn}
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
  },
  toggleBtn: {
    padding: "8px 14px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    cursor: "pointer"
  },
  logoutBtn: {
    padding: "8px 14px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Navbar;
import "primeicons/primeicons.css";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useLocation, useNavigate } from "react-router-dom";
import { signout } from "../redux/login_reducer";
import "./../components/navbar.css";

function Navbar() {
  const state = useSelector((state: RootState) => state.loginReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const navigateToUsers = () => {
    navigate("/Users");
  };
  const navigateToWelcome = () => {
    navigate("/");
  };
  const navigateTovehicle = () => {
    navigate("/vehicle");
  };

  // Navigation items
  const navItems = [
    {
      label: "Tableau de bord",
      icon: "pi pi-chart-line",
      path: "/tableau-de-bord",
    },
    {
      label: "Documents",
      icon: "pi pi-file",
      path: "/documents",
    },
    {
      label: "Vehicules",
      icon: "pi pi-car",
      path: "/vehicle",
    },
    {
      label: "Depenses",
      icon: "pi pi-wrench",
      path: "/maintenance",
    },
    {
      label: "Utilisateurs",
      icon: "pi pi-user",
      path: "/Users",
    },
    {
      label: "Paramètres",
      icon: "pi pi-cog",
      path: "/parametres",
    },
  ];

  if (state.loggedIn) {
    // Get current path to determine active tab
    const currentPath = location.pathname.toLowerCase();

    return (
      <div className="navbar-container">
        <div className="navbar-content">
          <div className="left-section">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`nav-button ${
                  currentPath.includes(item.path.toLowerCase()) ||
                  (currentPath === "/dashboard" && item.label === "Accueil")
                    ? "active-nav-button"
                    : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                <i className={item.icon} style={{ marginRight: "0.3rem" }}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
          <div className="right-section">
            <button
              className="nav-button signout-button"
              onClick={() => {
                dispatch(signout());
                navigateToWelcome();
              }}
            >
              <i
                className="pi pi-sign-out"
                style={{ marginRight: "0.3rem" }}
              ></i>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div></div>;
  }
}

export default Navbar;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { setLoggedIn, restoreAuth } from "../redux/login_reducer";
import { checkLoggedIn } from "../apicalls/apicallsUser";
import { ProgressSpinner } from "primereact/progressspinner";
import { getAuthToken, getUserData, isTokenExpired } from "../utils/authUtils";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { loggedIn } = useSelector((state: RootState) => state.loginReducer);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for existing auth
        const token = getAuthToken();
        const userData = getUserData();

        if (token && userData && !isTokenExpired(token)) {
          // Restore auth from localStorage
          dispatch(
            restoreAuth({
              fullname: userData.fullname,
              role_id: userData.role_id,
              token: token,
            })
          );
          setIsLoading(false);
          return;
        }

        // If no valid localStorage data, check with server
        await checkLoggedIn();
        dispatch(setLoggedIn(true));
      } catch (error) {
        console.log("User not authenticated");
        dispatch(setLoggedIn(false));
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
          <p style={{ marginTop: "1rem", color: "#666" }}>
            Vérification de l'authentification...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;

import { useNavigate } from "react-router-dom";
import car from "./../../assets/car.png";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { login_user } from "../../apicalls/apicallsUser";
import {
  login,
  setLoggedIn,
  setLoginError,
  signout,
} from "../../redux/login_reducer";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import "./login.css";

function Login() {
  const navigate = useNavigate(); // Get the navigate function

  const [fullName, setfullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const state = useSelector((state: RootState) => state.loginReducer);
  const dispatch = useDispatch();

  const login_f = async () => {
    setLoading(true);
    try {
      const response = await login_user(fullName, password);
      // Extract token from response
      const token =
        response.data.token?.token || response.data.accessToken || "";

      dispatch(
        login({
          fullname: response.data.fullName,
          role_id: response.data.role_id,
          token: token,
        })
      );
      dispatch(setLoginError(""));
      navigate("/tableau-de-bord");
      setLoading(false);
    } catch (error: any) {
      dispatch(setLoginError(error.message));
      dispatch(setLoggedIn(false));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (state.loggedIn) {
      navigate("/tableau-de-bord");
    }
  }, []);

  return (
    <div className="login-container">
      <div className="login-image-container">
        <img src={car} alt="Car" className="login-image" />
      </div>

      <div className="login-form-container">
        <div className="login-form">
          <div className="login-title">
            <i className="pi pi-users login-icon"></i>
            <h2>Connexion</h2>
          </div>

          <div className="login-input-group p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              value={fullName}
              onChange={(e) => setfullName(e.target.value)}
              placeholder="Nom d'utilisateur"
              name="username"
            />
          </div>

          <div className="login-input-group p-inputgroup">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <InputText
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </div>

          <Button
            icon="pi pi-sign-in"
            label="Se connecter"
            loading={loading}
            onClick={login_f}
            disabled={fullName.length === 0 || password.length === 0}
            className="login-button"
          />

          {state.loginError.length > 0 && (
            <Message
              severity="error"
              text={state.loginError}
              className="login-error"
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default Login;

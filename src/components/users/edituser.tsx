import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import { Role } from "../../models/Role";
import { updateUser } from "../../apicalls/apicallsUser";
import { User } from "../../models/User";
import { Checkbox } from "primereact/checkbox";
import edit from "./../../assets/edit.png";

// Define the EditUser  component
function EditUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const user: User = location.state.user;

  const roles: Role[] = [
    { name: "Admin", id: 1 },
    { name: "User ", id: 2 },
  ];

  // State variables
  const [username, setUsername] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password);
  const [confirmPassword, setConfirmPassword] = useState(user.password);
  const [role, setRole] = useState<Role>(roles[1]);
  const [changePassword, setChangePassword] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    role: "",
    confirmPassword: "",
  });

  // Email validation function
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Handle form submission
  const handleSubmit = async () => {
    let hasError = false;
    setErrors({
      username: "",
      email: "",
      role: "",
      confirmPassword: "",
    });

    // Validation
    if (!username) {
      setErrors((prev) => ({ ...prev, username: "Username is required." }));
      hasError = true;
    }

    if (!email || !validateEmail(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "A valid email address is required.",
      }));
      hasError = true;
    }

    if (changePassword && password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      hasError = true;
    }

    if (!role) {
      setErrors((prev) => ({ ...prev, role: "Role is required." }));
      hasError = true;
    }

    if (!hasError) {
      try {
        const response = await updateUser(
          user.id,
          username,
          email,
          changePassword ? confirmPassword : user.password, // Use old password if not changing
          role.id
        );
        navigate("/Users");
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
  };

  // CSS styles defined as a JavaScript object
  const styles = {
    container: {
      display: "flex",
      height: "100vh",
      alignItems: "center",
    },
    imageContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      maxWidth: "100%",
      height: "auto",
    },
    formContainer: {
      flex: 1,
      padding: "20px",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "center",
      gap: "1.5em",
    },
    inputContainer: {
      width: "30vw",
    },
    error: {
      color: "red",
      marginTop: "5px",
    },
    heading: {
      marginBottom: "30px",
      fontSize: "36px",
      fontWeight: "bold",
      color: "#2c3e50",
      textTransform: "uppercase",
      letterSpacing: "1.5px",
      fontFamily: "'Arial', sans-serif",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img src={edit} alt="edit" style={styles.image} />
      </div>
      <div style={styles.formContainer}>
        <i className="pi pi-user-edit" style={{ fontSize: "3.5rem" }}></i>
        <div style={styles.inputContainer}>
          <FloatLabel>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%" }}
            />
            <label htmlFor="username">Username</label>
          </FloatLabel>
          {errors.username && <div style={styles.error}>{errors.username}</div>}
        </div>
        <div style={styles.inputContainer}>
          <Dropdown
            id="role"
            value={role}
            optionLabel="name"
            options={roles}
            onChange={(e) => setRole(e.value)}
            placeholder="Select a role"
            style={{ width: "100%" }}
          />
          {errors.role && <div style={styles.error}>{errors.role}</div>}
        </div>
        <div style={styles.inputContainer}>
          <FloatLabel>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "100%" }}
            />
            <label htmlFor="email">Email</label>
          </FloatLabel>
          {errors.email && <div style={styles.error}>{errors.email}</div>}
        </div>
        {changePassword && (
          <>
            <div style={styles.inputContainer}>
              <FloatLabel>
                <InputText
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
                <label htmlFor="password">Password</label>
              </FloatLabel>
            </div>
            <div style={styles.inputContainer}>
              <FloatLabel>
                <InputText
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ width: "100%" }}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </FloatLabel>
              {errors.confirmPassword && (
                <div style={styles.error}>{errors.confirmPassword}</div>
              )}
            </div>
          </>
        )}
        <Button onClick={handleSubmit}>Edit User</Button>
        <div>
          <label htmlFor="chkbox1">change the password </label>
          <Checkbox
            inputId="changePassword"
            name="Change password"
            value="change password"
            onChange={() => setChangePassword(!changePassword)}
            checked={changePassword}
          />
        </div>
      </div>
    </div>
  );
}

export default EditUser;

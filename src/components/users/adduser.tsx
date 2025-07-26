import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router";
import { Role } from "../../models/Role";
import { addUser } from "../../apicalls/apicallsUser";
import { Button } from "primereact/button";
import car from "./../../assets/car.png";

function AddUser() {
  const navigate = useNavigate();
  const roles: Role[] = [
    { name: "Admin", id: 1 },
    { name: "User ", id: 2 },
  ];
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<Role>(roles[1]);

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    let hasError = false;
    setErrors({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
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

    if (password !== confirmPassword) {
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
        await addUser(username, email, password, role.id);
        alert("New User has been added");
        navigate("/Users");
      } catch (error) {
        console.error("Error adding user:", error);
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
      maxWidth: "100%", // Ensure the image fills its container
      height: "auto", // Maintain aspect ratio
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
      width: "30vw", // Full width for input fields
    },
    error: {
      color: "red",
      marginTop: "5px", // Space between input and error message
    },
    heading: {
      marginBottom: "30px", // Space below the heading
      fontSize: "36px", // Increased font size
      fontWeight: "bold", // Bold text // Center text
      color: "#2c3e50", // Darker shade for better readability
      textTransform: "uppercase", // Uppercase letters for emphasis
      letterSpacing: "1.5px", // Increased letter spacing
      fontFamily: "'Arial', sans-serif",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.imageContainer}>
        <img src={car} alt="Car" style={styles.image} />
      </div>
      <div style={styles.formContainer}>
        <i className="pi pi-user-plus" style={{ fontSize: "3.5rem" }}></i>

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

        <div style={styles.inputContainer}>
          <FloatLabel>
            <InputText
              id="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%" }}
            />
            <label htmlFor="Password"> Password</label>
          </FloatLabel>
          {errors.confirmPassword && (
            <div style={styles.error}>{errors.password}</div>
          )}
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

        <Button onClick={handleSubmit}>Add User</Button>
      </div>
    </div>
  );
}

export default AddUser;

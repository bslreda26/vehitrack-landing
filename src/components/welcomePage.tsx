import React, { useEffect, useState } from "react";
import w from "./../assets/car2.png";
import { useNavigate } from "react-router-dom";

const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger the animation after the component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row" as const,
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%)",
      color: "#2b2d42",
      padding: "20px",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: "hidden",
      position: "relative" as const,
      // Mobile responsive
      "@media (max-width: 768px)": {
        flexDirection: "column",
        padding: "10px",
        height: "auto",
        minHeight: "100vh",
      },
    },
    leftSection: {
      flex: "1",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
      transform: isVisible ? "translateX(0)" : "translateX(-50px)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.6s ease-out",
      // Mobile responsive
      "@media (max-width: 768px)": {
        padding: "1rem",
        order: 2,
      },
    },
    rightSection: {
      flex: "1",
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "2rem 4rem",
      transform: isVisible ? "translateX(0)" : "translateX(50px)",
      opacity: isVisible ? 1 : 0,
      transition: "all 0.6s ease-out 0.2s",
      // Mobile responsive
      "@media (max-width: 768px)": {
        padding: "1rem 2rem",
        alignItems: "center",
        textAlign: "center",
        order: 1,
      },
    },
    image: {
      width: "100%",
      maxWidth: "550px",
      borderRadius: "12px",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transform: "perspective(1000px) rotateY(-5deg)",
      transition: "transform 0.5s ease",
      // Mobile responsive
      "@media (max-width: 768px)": {
        maxWidth: "300px",
        transform: "perspective(1000px) rotateY(0deg)",
      },
      ":hover": {
        transform: "perspective(1000px) rotateY(0deg)",
      },
    },
    heading: {
      fontSize: "3.5rem",
      fontWeight: 700,
      marginBottom: "1rem",
      color: "#4361ee",
      lineHeight: 1.2,
      // Mobile responsive
      "@media (max-width: 768px)": {
        fontSize: "2.5rem",
      },
      "@media (max-width: 480px)": {
        fontSize: "2rem",
      },
    },
    subheading: {
      fontSize: "1.5rem",
      fontWeight: 600,
      marginBottom: "0.5rem",
      color: "#2b2d42",
      // Mobile responsive
      "@media (max-width: 768px)": {
        fontSize: "1.25rem",
      },
      "@media (max-width: 480px)": {
        fontSize: "1.1rem",
      },
    },
    paragraph: {
      fontSize: "1.125rem",
      lineHeight: 1.6,
      marginBottom: "2rem",
      color: "#6c757d",
      maxWidth: "500px",
      // Mobile responsive
      "@media (max-width: 768px)": {
        fontSize: "1rem",
        maxWidth: "100%",
      },
    },
    button: {
      padding: "0.875rem 2rem",
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "white",
      backgroundColor: "#4361ee",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 6px rgba(67, 97, 238, 0.2)",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      // Mobile responsive
      "@media (max-width: 768px)": {
        padding: "1rem 2rem",
        fontSize: "1rem",
        minHeight: "44px",
        minWidth: "200px",
        justifyContent: "center",
      },
    },
    buttonHover: {
      backgroundColor: "#3a56d4",
      transform: "translateY(-2px)",
      boxShadow: "0 6px 10px rgba(67, 97, 238, 0.3)",
    },
    decorativeShape: {
      position: "absolute" as const,
      bottom: "5%",
      left: "5%",
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, rgba(67, 97, 238, 0.2) 0%, rgba(67, 97, 238, 0.05) 100%)",
      zIndex: 0,
      // Mobile responsive
      "@media (max-width: 768px)": {
        width: "100px",
        height: "100px",
        bottom: "2%",
        left: "2%",
      },
    },
    decorativeShape2: {
      position: "absolute" as const,
      top: "10%",
      right: "10%",
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      background:
        "linear-gradient(135deg, rgba(67, 97, 238, 0.1) 0%, rgba(67, 97, 238, 0.02) 100%)",
      zIndex: 0,
      // Mobile responsive
      "@media (max-width: 768px)": {
        width: "60px",
        height: "60px",
        top: "5%",
        right: "5%",
      },
    },
  };

  // Check if we're on mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div
      style={{
        ...styles.container,
        flexDirection: isMobile ? "column" : "row",
        padding: isMobile ? "10px" : "20px",
        height: isMobile ? "auto" : "100vh",
        minHeight: isMobile ? "100vh" : "auto",
      }}
    >
      {/* Decorative elements */}
      <div
        style={{
          ...styles.decorativeShape,
          width: isMobile ? "100px" : "150px",
          height: isMobile ? "100px" : "150px",
          bottom: isMobile ? "2%" : "5%",
          left: isMobile ? "2%" : "5%",
        }}
      ></div>
      <div
        style={{
          ...styles.decorativeShape2,
          width: isMobile ? "60px" : "100px",
          height: isMobile ? "60px" : "100px",
          top: isMobile ? "5%" : "10%",
          right: isMobile ? "5%" : "10%",
        }}
      ></div>

      {/* Left section with image */}
      <div
        style={{
          ...styles.leftSection,
          padding: isMobile ? "1rem" : "2rem",
          order: isMobile ? 2 : 1,
        }}
      >
        <img
          src={w}
          alt="Gestion de véhicules"
          style={{
            ...styles.image,
            maxWidth: isMobile ? "300px" : "550px",
            transform: isMobile
              ? "perspective(1000px) rotateY(0deg)"
              : "perspective(1000px) rotateY(-5deg)",
          }}
        />
      </div>

      {/* Right section with content */}
      <div
        style={{
          ...styles.rightSection,
          padding: isMobile ? "1rem 2rem" : "2rem 4rem",
          alignItems: isMobile ? "center" : "flex-start",
          textAlign: isMobile ? "center" : "left",
          order: isMobile ? 1 : 2,
        }}
      >
        <h1
          style={{
            ...styles.heading,
            fontSize: isMobile
              ? window.innerWidth <= 480
                ? "2rem"
                : "2.5rem"
              : "3.5rem",
          }}
        >
          VéhiTrack
        </h1>
        <h2
          style={{
            ...styles.subheading,
            fontSize: isMobile
              ? window.innerWidth <= 480
                ? "1.1rem"
                : "1.25rem"
              : "1.5rem",
          }}
        >
          Gestion de flotte simplifiée
        </h2>
        <p
          style={{
            ...styles.paragraph,
            fontSize: isMobile ? "1rem" : "1.125rem",
            maxWidth: isMobile ? "100%" : "500px",
          }}
        >
          Votre solution complète pour la gestion de vos véhicules et documents.
          Suivez, gérez et optimisez votre flotte en toute simplicité.
        </p>
        <button
          style={{
            ...styles.button,
            padding: isMobile ? "1rem 2rem" : "0.875rem 2rem",
            fontSize: isMobile ? "1rem" : "1.125rem",
            minHeight: isMobile ? "44px" : "auto",
            minWidth: isMobile ? "200px" : "auto",
            justifyContent: isMobile ? "center" : "flex-start",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.buttonHover.backgroundColor;
            e.currentTarget.style.transform = styles.buttonHover.transform;
            e.currentTarget.style.boxShadow = styles.buttonHover.boxShadow;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor =
              styles.button.backgroundColor;
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow = styles.button.boxShadow;
          }}
          onClick={() => {
            navigate("/Login");
          }}
        >
          <i className="pi pi-sign-in" style={{ fontSize: "1rem" }}></i>
          Connexion
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;

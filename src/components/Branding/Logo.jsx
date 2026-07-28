import React from "react";
import logo from "../../assets/images/gym-logo.png";

function Logo({ size = "medium" }) {
  const sizes = {
    small: 40,
    medium: 55,
    large: 80,
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
    >
      <img
        src={logo}
        alt="Gym Management System"
        style={{
          width: sizes[size],
          height: "auto",
          objectFit: "contain",
        }}
      />

      <div style={{ lineHeight: 1.2 }}>
        <div
          style={{
            fontSize: sizes[size] * 0.45,
            fontWeight: 700,
            color: "#D4AF37",
          }}
        >
          Gym Management System
        </div>

        <div
          style={{
            fontSize: sizes[size] * 0.22,
            color: "#999",
            letterSpacing: "2px",
          }}
        >
           Your All-in-One Fitness & Membership Platform.
        </div>
      </div>
    </div>
  );
}

export default Logo;
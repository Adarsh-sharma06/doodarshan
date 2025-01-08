import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../../../../service/firebase"; // Adjust the path as needed
import Sidebar from "../../../ReusableComponents/Sidebar/Sidebar"; // Adjust the path as needed
import Navbar from "../../../ReusableComponents/Navbar/Navbar"; // Adjust the path as needed

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Reporter", // Default role
    profileImage: "", // Profile image URL
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, role, profileImage, password, confirmPassword } = formData;

    // Validate input
    if (!name || !email || !phone || !profileImage || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      setSuccess("");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      // Create user in Firebase Authentication
      await createUserWithEmailAndPassword(auth, email, password);

      // Save user data to Firebase Firestore using email as document ID
      await setDoc(doc(db, "users", email), {
        name,
        email,
        phone,
        role,
        profileImage,
        joinedDate: new Date().toISOString(),
      });

      // If successful, show a success message
      setSuccess("User created successfully!");
      setError("");

      // Clear form data
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Reporter",
        profileImage: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error("Error creating user: ", err);

      if (err.code === "auth/email-already-in-use") {
        setError("The email address is already in use.");
      } else if (err.code === "resource-exhausted") {
        setError("Quota exceeded. Please try again later.");
      } else {
        setError("Error creating user. Please try again.");
      }

      setSuccess("");
    }
  };

  // Sidebar menu sections
  const menuSections = [
    {
      heading: null,
      items: [
        { name: "Dashboard", link: "/Admin/Dashboard", icon: "bi bi-speedometer2" },
        { name: "Tracker", link: "/Admin/Tracker", icon: "bi bi-map" },
        { name: "Report", link: "/Admin/Report", icon: "bi bi-bar-chart" },
      ],
    },
    {
      heading: "Administrator",
      items: [
        { name: "Vehicles", link: "/vehicles", icon: "bi bi-truck" },
        { name: "Users", link: "/Admin/Dashboard/CreateUser", icon: "bi bi-people" },
        { name: "Driver", link: "/driver", icon: "bi bi-person-badge" },
      ],
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <Sidebar logoSrc="/images/DD.png" logoText="Doordarshan" menuSections={menuSections} />

      {/* Main content */}
      <div style={{ flex: 1, paddingLeft: "220px" }}>
        <Navbar
          title="Add User"
          placeholder="Search for something..."
          profileImg="/images/DD.png"
          profileName="Admin" // Adjust as needed
        />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            maxWidth: 400,
            mx: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: 2,
            boxShadow: 1,
            marginTop: "30px",
          }}
        >
          <Typography variant="h5" textAlign="center" gutterBottom>
            Add User
          </Typography>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="primary" textAlign="center">
              {success}
            </Typography>
          )}

          {/* Form Fields */}
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            type="email"
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            type="tel"
          />
          <TextField
            label="Role"
            name="role"
            select
            value={formData.role}
            onChange={handleChange}
            required
          >
            <MenuItem value="Reporter">Reporter</MenuItem>
            <MenuItem value="Driver">Driver</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
          <TextField
            label="Profile Image URL"
            name="profileImage"
            value={formData.profileImage}
            onChange={handleChange}
            required
            type="url"
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            type="password"
          />
          <TextField
            label="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            type="password"
          />

          {/* Submit Button */}
          <Button variant="contained" type="submit" color="primary">
            Create User
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default AddUserForm;

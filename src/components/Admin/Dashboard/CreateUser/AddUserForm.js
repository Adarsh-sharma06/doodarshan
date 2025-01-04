import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Typography } from "@mui/material";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../service/firebase"; // Adjust the path as needed

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Reporter", // Default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, role } = formData;

    if (!name || !email || !phone) {
      setError("Please fill all fields.");
      setSuccess("");
      return;
    }

    try {
      await setDoc(doc(db, "users", email), {
        name,
        email,
        phone,
        role,
        joinedDate: new Date().toISOString(),
        profileImage: "", // Optional placeholder for profile image
      });

      setSuccess("User created successfully!");
      setError("");
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "Reporter",
      });
    } catch (err) {
      setError("Error creating user. Please try again.");
      setSuccess("");
    }
  };

  return (
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
      </TextField>
      <Button variant="contained" type="submit" color="primary">
        Create User
      </Button>
    </Box>
  );
};

export default AddUserForm;

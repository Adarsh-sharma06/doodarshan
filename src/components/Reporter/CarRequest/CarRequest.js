import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { db } from "../../service/firebase";
import Sidebar from "../../ReusableComponents/Sidebar/Sidebar";
import Navbar from "../../ReusableComponents/Navbar/Navbar";
import { getAuth } from "firebase/auth";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; // Import Firestore functions

function CarRequest() {
  const [formData, setFormData] = useState({
    aim: "",
    destination: "",
    startDate: null,
    time: null,
    bookingType: "Local",
  });
  const [loading, setLoading] = useState(false);

  const menuSections = [
    {
      heading: null,
      items: [
        { name: "Dashboard", link: "/Reporter/ReporterDashboard", icon: "bi bi-house-door" },
        { name: "Reports", link: "/Reporter/Reports", icon: "bi bi-file-earmark-text" },
        { name: "History", link: "/Reporter/History", icon: "bi bi-clock" },
        { name: 'Car Request', link: '/Reporter/CarRequest', icon: 'bi bi-car-front' }, // New Car Request option
      ],
    },
    {
      heading: "Settings",
      items: [
        { name: "Profile", link: "/Reporter/Profile", icon: "bi bi-person" },
        { name: "Logout", link: "/logout", icon: "bi bi-box-arrow-right" },
      ],
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStartDateChange = (date) => {
    setFormData({
      ...formData,
      startDate: date,
    });
  };

  const handleTimeChange = (time) => {
    setFormData({
      ...formData,
      time: time,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const auth = getAuth();
      const userEmail = auth.currentUser?.email;

      if (!userEmail) {
        alert("User is not authenticated!");
        setLoading(false);
        return;
      }

      // Serialize startDate and time to valid Firestore-compatible formats
      const bookingData = {
        ...formData,
        startDate: formData.startDate ? formData.startDate.toDate() : null,
        time: formData.time ? formData.time.format("HH:mm") : null,
        status: "Pending",
        allotedDriver: "",
        email: userEmail, // Add the email to the booking data
      };

      // Query Firestore to find the latest booking with this user's name
      const userName = userEmail.split('@')[0]; // Using the user's email username part
      const bookingCollection = collection(db, "bookings");
      const q = query(bookingCollection, where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      let highestBookingNumber = 0;

      // Check for existing bookings and find the highest booking number
      querySnapshot.forEach((doc) => {
        const docId = doc.id;  // Assuming document ID is in the format `userName_bookingX`
        const match = docId.match(/^(.+)_booking(\d+)$/);  // Match the pattern `userName_bookingX`
        if (match && match[2]) {
          const bookingNumber = parseInt(match[2], 10);
          highestBookingNumber = Math.max(highestBookingNumber, bookingNumber);
        }
      });

      // Increment the highest booking number found
      const newBookingNumber = highestBookingNumber + 1;
      const newDocId = `${userName}_booking${newBookingNumber}`;

      // Use setDoc to set the document with the new ID
      await setDoc(doc(db, "bookings", newDocId), bookingData);

      alert("Car request submitted successfully!");

      setFormData({
        aim: "",
        destination: "",
        startDate: null,
        time: null,
        bookingType: "Local",
      });
    } catch (error) {
      console.error("Error submitting car request: ", error);
      alert("Failed to submit car request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Car Request" placeholder="Search for requests..." />
      <Sidebar menuSections={menuSections} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: 3,
          backgroundColor: "#f0f2f5",
        }}
      >
        <Paper
          elevation={4}
          sx={{
            padding: 4,
            width: "100%",
            maxWidth: 800,
            borderRadius: "16px",
            background: "linear-gradient(to bottom, #ffffff, #f9f9f9)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333" }}
          >
            Car Request Form
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{ marginBottom: 4, color: "#555" }}
          >
            Complete the form below to book your trip.
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Aim *"
                  variant="outlined"
                  fullWidth
                  name="aim"
                  value={formData.aim}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    backgroundColor: "#fff",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Destination *"
                  variant="outlined"
                  fullWidth
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                    backgroundColor: "#fff",
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Booking Type</InputLabel>
                  <Select
                    value={formData.bookingType}
                    onChange={handleChange}
                    name="bookingType"
                    label="Booking Type"
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: "10px" },
                      "& .MuiMenuItem-root": { padding: "10px" },
                      backgroundColor:
                        formData.bookingType === "Local" ? "#e3f2fd" : "#c8e6c9",
                    }}
                  >
                    <MenuItem value="Local">Local</MenuItem>
                    <MenuItem value="Outstation">Outstation</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={handleStartDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Time"
                    value={formData.time}
                    onChange={handleTimeChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                  sx={{
                    padding: "12px",
                    fontWeight: "bold",
                    borderRadius: "10px",
                    backgroundColor: "#1976d2",
                    "&:hover": { backgroundColor: "#1565c0" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Submit Request"
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </>
  );
}

export default CarRequest;

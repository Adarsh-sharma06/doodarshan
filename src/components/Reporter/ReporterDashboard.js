import React, { useState, useEffect } from "react";
import Sidebar from "../ReusableComponents/Sidebar/Sidebar";
import Navbar from "../ReusableComponents/Navbar/Navbar";
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Badge, Divider } from "@mui/material";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../service/firebase"; // Ensure your Firebase instance is correctly imported

function ReporterDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [reports, setReports] = useState([]); // Store reporter's reports or tasks
  const [bookings, setBookings] = useState([]); // Store booking data for the reporter

  const menuSections = [
    {
      heading: null,
      items: [
        { name: 'Dashboard', link: '/Reporter/ReporterDashboard', icon: 'bi bi-house-door' },
        { name: 'Reports', link: '/Reporter/Reports', icon: 'bi bi-file-earmark-text' },
        { name: 'History', link: '/Reporter/History', icon: 'bi bi-clock' },
        { name: 'Car Request', link: '/Reporter/CarRequest', icon: 'bi bi-car-front' },
      ],
    },
    {
      heading: 'Settings',
      items: [
        { name: 'Profile', link: '/Reporter/Profile', icon: 'bi bi-person' },
        { name: 'Logout', link: '/logout', icon: 'bi bi-box-arrow-right' },
      ],
    },
  ];

  // Fetch reporter data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(db, "users"), where("role", "==", "Reporter"));
        const userSnapshot = await getDocs(userQuery);
        const userDoc = userSnapshot.docs.map(doc => doc.data())[0];
        setUserData(userDoc);
        setLoading(false); // Stop loading after data is fetched
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false); // Ensure loading is stopped on error
      }
    };

    fetchUserData();
  }, []);

  // Fetch reports or tasks for the reporter
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reportsQuery = query(collection(db, "reports"), where("assignedTo", "==", "Reporter"));
        const reportsSnapshot = await getDocs(reportsQuery);
        const reportsData = reportsSnapshot.docs.map(doc => doc.data());
        setReports(reportsData);
      } catch (error) {
        console.error("Error fetching reports: ", error);
      }
    };

    fetchReports();
  }, []);

  // Fetch bookings data for the reporter
  useEffect(() => {
    if (userData) {
      const fetchBookings = async () => {
        try {
          const bookingsQuery = query(collection(db, "bookings"), where("email", "==", userData?.email)); // Assuming bookings are assigned based on the reporter's email
          const bookingsSnapshot = await getDocs(bookingsQuery);
          const bookingsData = bookingsSnapshot.docs.map(doc => doc.data());
          setBookings(bookingsData);
        } catch (error) {
          console.error("Error fetching bookings: ", error);
        }
      };

      fetchBookings();
    }
  }, [userData]);

  if (loading) {
    return (
      <div className="loading-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <Typography variant="h6" color="textSecondary">Loading user data...</Typography>
      </div>
    );
  }

  return (
    <>
      <Navbar
        title="Reporter Dashboard"
        placeholder="Search for reports..."
        profileImg={userData?.profileImage || "/images/DD.png"}
        profileName={userData?.name || "Reporter"}
      />
      <Sidebar menuSections={menuSections} />

      <Box sx={{ padding: 3, marginTop: 3 }}>
        <Typography variant="h5" gutterBottom>
          Welcome to the Reporter Dashboard
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here you can view and manage your reports and tasks.
        </Typography>

        {/* Display Recent Reports */}
        <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
          Recent Reports:
        </Typography>
        <Grid container spacing={3}>
          {reports.length > 0 ? (
            reports.map((report, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: "8px", backgroundColor: "#f9f9f9", position: "relative", boxShadow: 3, overflow: "hidden" }}>
                  <Badge
                    badgeContent={report.status || 'N/A'}
                    color={report.status === 'Completed' ? 'success' : 'warning'}
                    sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {report.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Last Updated: {new Date(report.lastUpdated).toLocaleString()}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Status: {report.status || 'No status'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No reports found.
            </Typography>
          )}
        </Grid>

        {/* Display Recent Bookings */}
        <Typography variant="h6" gutterBottom sx={{ marginTop: 4 }}>
          Recent Bookings:
        </Typography>
        <Grid container spacing={3}>
          {bookings.length > 0 ? (
            bookings.map((booking, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: "8px", backgroundColor: "#e3f2fd", position: "relative", boxShadow: 3, overflow: "hidden" }}>
                  <Badge
                    badgeContent={booking.status || 'N/A'}
                    color={booking.status === 'Confirmed' ? 'success' : 'warning'}
                    sx={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
                  />
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      Aim: {booking.aim}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Destination: {booking.destination}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Start Date: {new Date(booking.startDate).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Time: {booking.time}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="body2" color="textSecondary">
                      Status: {booking.status || 'No status'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No bookings found.
            </Typography>
          )}
        </Grid>
      </Box>
    </>
  );
}

export default ReporterDashboard;

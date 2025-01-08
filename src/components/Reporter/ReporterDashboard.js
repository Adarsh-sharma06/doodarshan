import React, { useState, useEffect } from "react";
import Navbar from "../ReusableComponents/Navbar/Navbar";
import Sidebar from "../ReusableComponents/Sidebar/Sidebar";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../service/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

function ReporterDashboard() {
  const { currentUser } = useAuth();
  const [reports, setReports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const reportsQuery = query(collection(db, "reports"), where("assignedTo", "==", "Reporter"));
        const bookingsQuery = query(collection(db, "bookings"), where("email", "==", currentUser?.email));

        const [reportsSnapshot, bookingsSnapshot] = await Promise.all([
          getDocs(reportsQuery),
          getDocs(bookingsQuery),
        ]);

        const reportsData = reportsSnapshot.docs.map((doc) => doc.data());
        const bookingsData = bookingsSnapshot.docs.map((doc) => doc.data());

        setReports(reportsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) fetchData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center mt-12">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-gray-500 text-lg">Loading data...</p>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar
        menuSections={[
          {
            heading: null,
            items: [
              { name: "Dashboard", link: "/Reporter/ReporterDashboard", icon: "bi bi-house-door" },
              { name: "Reports", link: "/Reporter/Reports", icon: "bi bi-file-earmark-text" },
            ],
          },
          {
            heading: "Settings",
            items: [
              { name: "Profile", link: "/Reporter/Profile", icon: "bi bi-person" },
            ],
          },
        ]}
        showLogout={true}
      />
      <div className="main-content flex-1">
        <Navbar
          title="Reporter Dashboard"
          profileImg={currentUser?.photoURL || "/images/DD.png"}
          profileName={currentUser?.displayName || "Reporter"}
        />

        <div className="p-8">
          <h2 className="text-3xl font-semibold">Welcome to Reporter Dashboard</h2>
          <p className="text-lg text-gray-600">Manage your reports and bookings here.</p>
        </div>

        {/* Reports Section */}
        <div className="p-8">
          <h3 className="text-2xl font-medium mb-4">Recent Reports:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.length > 0 ? (
              reports.map((report, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-2">
                  <h4 className="text-xl font-medium text-blue-600">{report.title}</h4>
                  <p className="text-gray-500 mt-2">Last Updated: {new Date(report.lastUpdated).toLocaleString()}</p>
                  <hr className="my-4" />
                  <p className="text-gray-700">Status: {report.status || "No status"}</p>
                </div>
              ))
            ) : (
              <p>No reports found.</p>
            )}
          </div>
        </div>

        {/* Bookings Section */}
        <div className="p-8">
          <h3 className="text-2xl font-medium mb-4">Recent Bookings:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg shadow hover:shadow-lg transition-transform transform hover:-translate-y-2">
                  <h4 className="text-xl font-medium text-blue-600">Aim: {booking.aim}</h4>
                  <p className="text-gray-500 mt-2">Destination: {booking.destination}</p>
                  <p className="text-gray-700">Start Date: {new Date(booking.startDate).toLocaleString()}</p>
                  <hr className="my-4" />
                  <p>Status: {booking.status || "No status"}</p>
                </div>
              ))
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReporterDashboard;

import React, { useState, useEffect } from "react";
import { db, collection, getDocs, query, where, doc, updateDoc, deleteDoc } from "../../service/firebase"; // Firebase functions
import Sidebar from "../../ReusableComponents/Sidebar/Sidebar";
import Navbar from "../../ReusableComponents/Navbar/Navbar";
import "./Dashboard.css";

function Dashboard() {
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
        { name: "Users", link: "/Admin/Dashboard/CreateUser/AddUserForm", icon: "bi bi-people" },
        { name: "Driver", link: "/driver", icon: "bi bi-person-badge" },
      ],
    },
  ];

  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userNames, setUserNames] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(db, "users"), where("role", "==", "Admin"));
        const userSnapshot = await getDocs(userQuery);
        const userDoc = userSnapshot.docs.map(doc => doc.data())[0];
        setUserData(userDoc);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false);
      }
    };

    const fetchBookings = async () => {
      if (userData?.email) {
        try {
          const bookingsCollection = collection(db, "bookings");
          const bookingSnapshot = await getDocs(bookingsCollection);
          const bookingList = bookingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          setBookings(bookingList);
          setPendingBookingsCount(bookingList.filter(booking => booking.status === "Pending").length);

          // Fetch user names based on email
          const emails = bookingList.map(booking => booking.email);
          const userNamesMap = {};
          for (let email of emails) {
            const userQuery = query(collection(db, "users"), where("email", "==", email));
            const userSnapshot = await getDocs(userQuery);
            if (!userSnapshot.empty) {
              const userDoc = userSnapshot.docs[0].data();
              userNamesMap[email] = userDoc.name;
            }
          }
          setUserNames(userNamesMap);

        } catch (error) {
          console.error("Error fetching bookings: ", error);
        }
      }
    };

    fetchUserData();

    if (userData) {
      fetchBookings();
    }
  }, [userData]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await updateDoc(bookingRef, { status: newStatus });
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      setPendingBookingsCount((prevCount) =>
        newStatus === "Pending" ? prevCount + 1 : prevCount - 1
      );
    } catch (error) {
      console.error("Error updating booking status: ", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    try {
      const bookingRef = doc(db, "bookings", bookingId);
      await deleteDoc(bookingRef);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Error deleting booking: ", error);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  const tabsData = [
    { heading: "Total Cars", content: "15", color: "#4caf50" },
    { heading: "On-Trip Cars", content: "5", color: "#f44336" },
    { heading: "Available Cars", content: "5", color: "#8bc34a" },
    { heading: "Booked Cars", content: "5", color: "#3f51b5" },
    { heading: "Pending Approvals", content: pendingBookingsCount, color: "#ff9800" },
  ];

  return (
    <div className="dashboard-container">
      <Sidebar logoSrc="/images/DD.png" logoText="Doordarshan" menuSections={menuSections} />

      <div className="content-container">
        <Navbar
          title="Dashboard"
          placeholder="Search for something..."
          profileImg={userData?.profileImage || "/images/DD.png"}
          profileName={userData?.name || "Admin"}
        />

        <div className="status-cards-container mt-5 d-flex flex-wrap">
          {tabsData.map((tab, index) => (
            <div key={index} className="status-card" style={{ backgroundColor: tab.color }}>
              <h5>{tab.heading}</h5>
              <p className="status-card-content">{tab.content}</p>
            </div>
          ))}
        </div>

        <div className="booking-details mt-5 px-4">
          <h4>Booking Details</h4>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Aim</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Destination</th>
                  <th>Trip Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td>{index + 1}</td>
                    <td>{userNames[booking.email] || booking.customerName}</td>
                    <td>{booking.aim || "N/A"}</td>
                    <td>{booking.time || "N/A"}</td>
                    <td>
                      {booking.date && !isNaN(new Date(booking.date))
                        ? new Date(booking.date).toLocaleDateString('en-GB')  // Use en-GB locale for DD/MM/YYYY format
                        : "Invalid Date"}
                    </td>
                    <td>{booking.destination || "N/A"}</td>
                    <td>{booking.tripType || "N/A"}</td>
                    <td>{booking.status}</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-secondary dropdown-toggle"
                          type="button"
                          id={`dropdownMenu${booking.id}`}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu" aria-labelledby={`dropdownMenu${booking.id}`}>
                          {booking.status === "Pending" && (
                            <>
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={() => updateBookingStatus(booking.id, "Approved")}
                                >
                                  Approve
                                </button>
                              </li>
                              <li>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => updateBookingStatus(booking.id, "Rejected")}
                                >
                                  Reject
                                </button>
                              </li>
                            </>
                          )}
                          <li>
                            <button
                              className="dropdown-item"
                              onClick={() => updateBookingStatus(booking.id, "Updated")}
                            >
                              Update
                            </button>
                          </li>
                          <li>
                            <button
                              className="dropdown-item text-danger"
                              onClick={() => deleteBooking(booking.id)}
                            >
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

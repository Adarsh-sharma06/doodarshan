import React, { useState, useEffect } from "react";
import { ref, onChildAdded, onChildChanged } from "../../service/firebase"; // Realtime Database functions
import Sidebar from "../../ReusableComponents/Sidebar/Sidebar";
import Navbar from "../../ReusableComponents/Navbar/Navbar";
import MapComponent from "../../ReusableComponents/MapComponent/MapComponent";
import './Tracker.css';
import { collection, getDocs, query, where } from "firebase/firestore"; // Firestore methods
import { db, database } from "../../service/firebase"; // Ensure 'db' and 'database' are correctly imported

function Tracker() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for fetching data
  const [vehicleData, setVehicleData] = useState([
    { lat: 23.2358, lng: 72.6712, name: 'Vehicle 1', status: 'Active', lastUpdated: '2024-12-23 10:00 AM' },
    { lat: 23.2156, lng: 72.6369, name: 'Vehicle 2', status: 'Active', lastUpdated: '2024-12-23 09:30 AM' },
  ]);

  const menuSections = [
    {
      heading: null,
      items: [
        { name: "Dashboard", link: "/Admin/Dashboard", icon: "bi bi-speedometer2" },
        { name: "Tracker", link: "/Admin/Tracker", icon: "bi bi-map" },
        { name: "Report", link: "//Admin/Report", icon: "bi bi-bar-chart" },
      ],
    },
    {
      heading: "Administrator",
      items: [
        { name: "Vehicles", link: "/vehicles", icon: "bi bi-truck" },
        { name: "Users", link: "/users", icon: "bi bi-people" },
        { name: "Driver", link: "/driver", icon: "bi bi-person-badge" },
      ],
    },
  ];

  // Fetch user data from Firestore
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(db, "users"), where("role", "==", "Admin"));
        const userSnapshot = await getDocs(userQuery);
        const userDoc = userSnapshot.docs.map(doc => doc.data())[0];
        setUserData(userDoc);
        setLoading(false); // Stop loading after data is fetched
        console.log(userDoc); // Log user data
      } catch (error) {
        console.error("Error fetching user data: ", error);
        setLoading(false); // Make sure to stop loading even if an error occurs
      }
    };

    fetchUserData();
  }, []);

  // Fetch vehicle data from Firebase Realtime Database and listen for real-time updates
  useEffect(() => {
    const vehicleRef = ref(database, "/locations"); // Using Realtime Database instance

    // Listen for new data added to the "locations" node
    const onLocationAdded = onChildAdded(vehicleRef, (snapshot) => {
      const vehicleData = snapshot.val();
      const newVehicle = {
        lat: vehicleData.latitude,
        lng: vehicleData.longitude,
        name: `Vehicle ${snapshot.key}`, // You can customize this depending on your structure
        status: 'Active', // You can modify status as needed
        lastUpdated: new Date(vehicleData.timestamp).toLocaleString(),
      };
      setVehicleData(prevData => [...prevData, newVehicle]);
    });

    // Listen for data updates in the "locations" node (when data changes for any vehicle)
    const onLocationChanged = onChildChanged(vehicleRef, (snapshot) => {
      const updatedVehicleData = snapshot.val();
      const updatedVehicle = {
        lat: updatedVehicleData.latitude,
        lng: updatedVehicleData.longitude,
        name: `Vehicle ${snapshot.key}`,
        status: 'Active',
        lastUpdated: new Date(updatedVehicleData.timestamp).toLocaleString(),
      };
      // Update the vehicle data array with the new data
      setVehicleData(prevData => {
        return prevData.map(vehicle => 
          vehicle.name === updatedVehicle.name ? updatedVehicle : vehicle
        );
      });
    });

    // Cleanup listener on unmount
    return () => {
      onLocationAdded();
      onLocationChanged();
    };
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="tracker-container">
      {/* Sidebar */}
      <Sidebar logoSrc="/images/DD.png" logoText="Doordarshan" menuSections={menuSections} />

      <div className="main-content">
        {/* Navbar */}
        <Navbar
          title="Tracker"
          placeholder="Search for something..."
          profileImg={userData?.profileImage || "/images/DD.png"}
          profileName={userData?.name || "Admin"}
        />

        {/* Map and Vehicle Data */}
        <div className="vehicle-map-container mt-5">
          <div className="vehicle-map">
            <MapComponent vehicleData={vehicleData} />
            <div className="map-placeholder">
              <h5>Map showing vehicle locations</h5>
              <ul>
                {vehicleData.map((vehicle, index) => (
                  <li key={index}>
                    <strong>{vehicle.name}</strong> - Status: {vehicle.status} - Last updated: {vehicle.lastUpdated}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracker;

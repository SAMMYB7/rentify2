import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { 
  FaUser, 
  FaCar, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaChartLine,
  FaUsersCog,
  FaCarSide,
  FaFileInvoiceDollar,
  FaFileAlt
} from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    bookings: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Fetch summary stats
    const fetchStats = async () => {
      try {
        const [usersRes, carsRes, bookingsRes, paymentsRes] = await Promise.all([
          api.get("/users"),
          api.get("/cars"),
          api.get("/bookings"),
          api.get("/payments/all"),
        ]);
        setStats({
          users: usersRes.data.length,
          cars: carsRes.data.length,
          bookings: bookingsRes.data.length,
          revenue: paymentsRes.data.reduce((sum, p) => sum + (p.amount || 0), 0),
        });
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
    // Fetch admin profile
    api.get("/users/me").then(res => setProfile(res.data));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto py-12 px-4 sm:px-6"
    >
      <div className="bg-white shadow-md rounded-none border-t-2 border-gray-900 p-6 md:p-8 mb-8">
        <div className="flex flex-wrap items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartLine className="mr-3 text-gray-700" /> Admin Dashboard
          </h1>
        </div>

        {/* Admin Profile Section */}
        <div className="p-6 bg-gray-50 border-l-4 border-gray-900 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Admin Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Name</p>
              <p className="font-medium text-gray-900">{profile?.name || user?.name || "N/A"}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Email</p>
              <p className="font-medium text-gray-900">{profile?.email || user?.email || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FaUsersCog className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.users}</h3>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/users" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                View All Users
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-lg">
                <FaCarSide className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Cars</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.cars}</h3>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/cars" 
                className="text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center"
              >
                View All Cars
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <FaFileAlt className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-900">{stats.bookings}</h3>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/bookings" 
                className="text-sm text-green-600 hover:text-green-800 font-medium flex items-center"
              >
                View All Bookings
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-none p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="bg-rose-100 p-3 rounded-lg">
                <FaFileInvoiceDollar className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-900">₹{stats.revenue.toLocaleString()}</h3>
              </div>
            </div>
            <div className="mt-4">
              <Link 
                to="/admin/payments" 
                className="text-sm text-rose-600 hover:text-rose-800 font-medium flex items-center"
              >
                View All Payments
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/users" 
              className="bg-gray-900 text-white p-4 flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-200"
            >
              <FaUser className="h-8 w-8 mb-2" />
              <span className="font-medium">Manage Users</span>
            </Link>
            <Link 
              to="/admin/cars" 
              className="bg-gray-900 text-white p-4 flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-200"
            >
              <FaCar className="h-8 w-8 mb-2" />
              <span className="font-medium">Manage Cars</span>
            </Link>
            <Link 
              to="/admin/bookings" 
              className="bg-gray-900 text-white p-4 flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-200"
            >
              <FaCalendarAlt className="h-8 w-8 mb-2" />
              <span className="font-medium">Manage Bookings</span>
            </Link>
            <Link 
              to="/admin/payments" 
              className="bg-gray-900 text-white p-4 flex flex-col items-center text-center hover:bg-gray-800 transition-colors duration-200"
            >
              <FaMoneyBillWave className="h-8 w-8 mb-2" />
              <span className="font-medium">View Payments</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
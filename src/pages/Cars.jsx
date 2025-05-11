import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FaSearch, FaCarSide } from "react-icons/fa";

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [filters, setFilters] = useState({
    model: "",
    brand: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchCars = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.model) params.model = filters.model;
      if (filters.brand) params.brand = filters.brand;
      if (filters.type) params.type = filters.type;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      const res = Object.keys(params).length
        ? await api.get("/cars/search", { params })
        : await api.get("/cars");
      setCars(res.data);
    } catch (err) {
      setCars([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCars();
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    fetchCars();
  };

  const handleViewDetails = (carId) => {
    if (!user) {
      toast.error("Sign In or Register to start your booking journey!");
      navigate("/login");
    } else {
      navigate(`/cars/${carId}`);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Explore Our Premium Fleet</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse through our collection of high-quality vehicles and find the perfect car for your journey.
        </p>
      </motion.div>

      <motion.form 
        onSubmit={handleFilter}
        className="bg-white p-6 rounded-none shadow-md border-t-2 border-gray-900 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
            <input
              id="brand"
              name="brand"
              placeholder="Any brand"
              value={filters.brand}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Model</label>
            <input
              id="model"
              name="model"
              placeholder="Any model"
              value={filters.model}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <input
              id="type"
              name="type"
              placeholder="Car type"
              value={filters.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
            <input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="₹"
              value={filters.minPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
            <input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="₹"
              value={filters.maxPrice}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>
        </div>
        <div className="text-center">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors duration-200 transform hover:scale-105"
          >
            <FaSearch className="mr-2" /> Find Cars
          </button>
        </div>
      </motion.form>

      {loading ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available vehicles...</p>
        </div>
      ) : cars.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-none shadow-md">
          <FaCarSide className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-2xl font-medium text-gray-800 mb-2">No Cars Found</h3>
          <p className="text-gray-500">Try adjusting your search filters or browse all available vehicles.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {cars.map(car => (
            <motion.div
              key={car.id}
              variants={itemVariants}
              className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 group"
            >
              {car.imageUrl ? (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={car.imageUrl}
                    alt={car.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {!car.available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="bg-red-600 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider">
                        Not Available
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <FaCarSide className="h-12 w-12 text-gray-400" />
                </div>
              )}

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {car.brand} {car.model}
                </h3>
                <div className="text-gray-700 mb-2">Type: <span className="font-medium">{car.type}</span></div>
                <div className="text-2xl font-bold text-gray-900 mb-4">₹{car.pricePerDay}<span className="text-sm font-normal text-gray-600">/day</span></div>
                
                <div className="mb-4">
                  {car.available ? (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-sm font-semibold">
                      Available
                    </span>
                  ) : (
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded-sm font-semibold">
                      Unavailable
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleViewDetails(car.id)}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 transition-colors duration-200 border-b-2 border-gray-700 transform hover:-translate-y-1 hover:shadow-md"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Cars;

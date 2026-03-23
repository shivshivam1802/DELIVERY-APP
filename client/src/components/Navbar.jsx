import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-bold bg-gradient-to-r from-promart-red to-promart-orange bg-clip-text text-transparent group-hover:from-promart-orange group-hover:to-promart-red transition-all">
              Promart
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-3">
            {(!user || user?.role === "user") && (
              <>
                <Link to="/" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">
                  Home
                </Link>
                {user?.role === "user" && (
                  <>
                    <Link to="/orders" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 hidden sm:block font-medium">
                      Orders
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 hidden sm:block font-medium">
                      Profile
                    </Link>
                    <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-promart-red transition rounded-lg hover:bg-red-50">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-promart-red text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                  </>
                )}
              </>
            )}
            {user?.role === "restaurant" && (
              <>
                <Link to="/restaurant/dashboard" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Dashboard</Link>
                <Link to="/restaurant/menu" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Menu</Link>
                <Link to="/restaurant/orders" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Orders</Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Dashboard</Link>
                <Link to="/admin/users" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Users</Link>
                <Link to="/admin/restaurants" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Restaurants</Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-promart-red transition px-3 py-2 rounded-lg hover:bg-red-50 font-medium">Orders</Link>
              </>
            )}

            {user ? (
              <button
                onClick={handleLogout}
                className="ml-2 bg-promart-red text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <div className="flex gap-2 ml-2">
                <Link to="/login" className="text-gray-600 hover:text-promart-red px-4 py-2 rounded-xl font-medium hover:bg-red-50 transition">
                  Login
                </Link>
                <Link to="/signup" className="bg-promart-red text-white px-4 py-2 rounded-xl font-medium hover:bg-red-600 transition">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

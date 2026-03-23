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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-promart-red">Promart</span>
          </Link>

          <div className="flex items-center gap-4 sm:gap-6">
            {(!user || user?.role === "user") && (
              <>
                <Link to="/" className="text-gray-600 hover:text-promart-red transition">Home</Link>
                {user?.role === "user" && (
                  <>
                    <Link to="/orders" className="text-gray-600 hover:text-promart-red transition hidden sm:block">Orders</Link>
                    <Link to="/profile" className="text-gray-600 hover:text-promart-red transition hidden sm:block">Profile</Link>
                    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-promart-red transition">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-promart-red text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cartCount}</span>
                      )}
                    </Link>
                  </>
                )}
              </>
            )}
            {user?.role === "restaurant" && (
              <>
                <Link to="/restaurant/dashboard" className="text-gray-600 hover:text-promart-red transition">Dashboard</Link>
                <Link to="/restaurant/menu" className="text-gray-600 hover:text-promart-red transition">Menu</Link>
                <Link to="/restaurant/orders" className="text-gray-600 hover:text-promart-red transition">Orders</Link>
              </>
            )}
            {user?.role === "admin" && (
              <>
                <Link to="/admin" className="text-gray-600 hover:text-promart-red transition">Dashboard</Link>
                <Link to="/admin/users" className="text-gray-600 hover:text-promart-red transition">Users</Link>
                <Link to="/admin/restaurants" className="text-gray-600 hover:text-promart-red transition">Restaurants</Link>
                <Link to="/admin/orders" className="text-gray-600 hover:text-promart-red transition">Orders</Link>
              </>
            )}

            {user ? (
              <button onClick={handleLogout} className="bg-promart-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="text-gray-600 hover:text-promart-red transition px-3 py-2">Login</Link>
                <Link to="/signup" className="bg-promart-red text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">
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

import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  // ✅ FIX: Added parentheses ()
  const { user, logout } = useAuth(); 

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) => 
    isActive 
      ? "text-blue-600 font-bold text-sm transition-colors" 
      : "text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-blue-600 tracking-tight hover:opacity-80"
            >
              CourseApp
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <NavLink to="/courses" className={linkClasses}>
              Browse
            </NavLink>

            {/* Show 'My Learning' only to Students (or everyone for now) */}
            <NavLink to="/my-courses" className={linkClasses}>
              My Learning
            </NavLink>

            {/* Show 'Admin' link mainly if they are an admin, 
                but for testing we leave it visible or check user.isAdmin */}
            <NavLink to="/admin/dashboard" className={linkClasses}>
              Teach (Admin)
            </NavLink>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-700">
                  {/* Fallback if username is missing */}
                  Hi, {user.username || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Student Login
                </Link>

                <span className="h-8 w-px bg-gray-300"></span>

                {/* 3. Admin Login Link - Added per your request */}
                <Link
                  to="/admin/login"
                  className="text-sm font-medium text-gray-900 bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
                >
                  Admin Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
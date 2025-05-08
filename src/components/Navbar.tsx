
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-100 shadow-sm fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-blood" />
              <span className="ml-2 text-xl font-bold text-blood">LifeFlow</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/donors" className="text-gray-700 hover:text-blood px-3 py-2 text-sm font-medium">Find Donors</Link>
              <Link to="/banks" className="text-gray-700 hover:text-blood px-3 py-2 text-sm font-medium">Blood Banks</Link>
              <Link to="/appointments" className="text-gray-700 hover:text-blood px-3 py-2 text-sm font-medium">Appointments</Link>
              <Link to="/request" className="text-gray-700 hover:text-blood px-3 py-2 text-sm font-medium">Request Blood</Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white" asChild>
                  <Link to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  className="bg-blood hover:bg-blood-hover text-white" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-blood text-blood hover:bg-blood hover:text-white" asChild>
                  <Link to="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button className="bg-blood hover:bg-blood-hover text-white" asChild>
                  <Link to="/register">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-md">
          <Link 
            to="/donors" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blood hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Find Donors
          </Link>
          <Link 
            to="/banks" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blood hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Blood Banks
          </Link>
          <Link 
            to="/appointments" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blood hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Appointments
          </Link>
          <Link 
            to="/request" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blood hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            Request Blood
          </Link>
          <div className="pt-4 flex flex-col space-y-3">
            {user ? (
              <>
                <Button variant="outline" className="border-blood text-blood" size="sm" asChild>
                  <Link to="/profile" onClick={() => setIsOpen(false)}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  className="bg-blood hover:bg-blood-hover text-white" 
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="border-blood text-blood" size="sm" asChild>
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button className="bg-blood hover:bg-blood-hover text-white" size="sm" asChild>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

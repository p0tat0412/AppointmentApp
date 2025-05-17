import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";

const Unauthorized = () => {
    const userInfoStr = localStorage.getItem("userInfo");
    const user = userInfoStr ? JSON.parse(userInfoStr) : null;
    console.log(user)
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8 text-center">
        <div className="flex justify-center mb-4">
          <FaLock className="text-red-500 text-5xl" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Please contact the administrator if you believe this is a mistake.
        </p>
        {
            user.role === 'doctor' ? (
                <Link
                    to="/doctor/dashboard"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                    >
                    Return to Home
                </Link>
            ):(
                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
                    >
                    Return to Home
                </Link>
            )
        }
        
      </div>
    </div>
  );
};

export default Unauthorized;

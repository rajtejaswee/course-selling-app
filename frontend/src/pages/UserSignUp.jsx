import { useState } from "react"
import Input from "../components/common/input"
import {register} from "../services/auth.service"
import { useNavigate } from "react-router-dom";

function UserSignUp() {
  const navigate = useNavigate();

  // 1. STATE: The storage for inputs + UI states
  const[formData, setFormData] = useState({
    username:"",
    email:"",
    password:""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
 
  const handleChange = (e) => {
      setFormData({...formData, [e.target.name]:e.target.value})
      setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try{
      await register(formData);

      alert("Account created! Please log in")
      navigate('/login')
    }
    catch(err) {
      const response = err.response?.data;

      if(response?.errors && response.errors.length > 0) {
        setError(response.errors[0].message)
      }
      else if(response?.message) {
        setError(response.message);
      }
      else {
        setError("Something went wrong. Please try again. ")
      }
    }
    finally {
      setLoading(false)
    };
  }


  return (
    // 1. Add onSubmit to the form tag
    <form 
        onSubmit={handleSubmit} 
        className="flex flex-col gap-4 max-w-md mx-auto mt-10 p-6 border rounded-xl shadow-sm bg-white"
    >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Create Account as a User</h2>
        
        {/* 2. Error Message Display (Only shows if error exists) */}
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
            </div>
        )}
        
        {/* 3. Inputs - Wiring them up */}
        <Input 
            label="Username" 
            placeholder="Enter your username" 
            // IMPORTANT: 'name' must match your state key exactly
            name="username"
            // Controlled Component: Value comes from state
            value={formData.username}
            // Update state when typing
            onChange={handleChange}
        />
        
        <Input 
            label="Email" 
            type="email" 
            placeholder="john@example.com" 
            name="email"
            value={formData.email}
            onChange={handleChange}
        />
        
        <Input 
            label="Password" 
            type="password" 
            placeholder="••••••••" 
            name="password"
            value={formData.password}
            onChange={handleChange}
        />
        
        {/* 4. Button - Handle Loading State */}
        <button 
            type="submit" // Triggers the form onSubmit
            disabled={loading} // Prevent double clicking
            className={`
                bg-blue-600 text-white py-2 rounded-lg mt-2 transition
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
            `}
        >
            {loading ? "Creating Account..." : "Sign Up"}
        </button>
    </form>
  )
}

export default UserSignUp
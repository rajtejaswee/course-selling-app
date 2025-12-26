import Input from "../components/common/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminLogin } from "../services/auth.service";

function AdminSignIn() {
  const navigate = useNavigate();
  const {login} = useAuth();

  const[formData, setFormData] = useState({
    email:"",
    password:"",
  })

  const [loading, setLoading] = useState(false)
  const[error, setError] = useState("")

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(formData);
      alert("Login successfull")
      navigate('/admin/dashboard')
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
    }
  }

  return (
    <form 
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md mx-auto mt-50 p-6 border rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Login In as Admin</h2>
        
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
                {error}
            </div>
        )}
        <Input
        label="Email"
        type ="Email"
        placeholder="johndoe@gmail.com"
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
        
        <button 
            type="submit" 
            disabled={loading}
            className={`
                bg-blue-600 text-white py-2 rounded-lg mt-2 transition
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}
            `}
        >
            {loading ? "Signing In..." : "Sign In"}
        </button>
    </form>
  )
}

export default AdminSignIn
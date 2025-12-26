import { useState } from 'react';
import Input from '../components/common/input'; 
import { createCourse } from '../services/course.service';
import {useNavigate} from 'react-router-dom'

function CreateCourse() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    title:"",
    description:"",
    price:"",
    imageUrl:""
    
  })
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name] : e.target.value})
    setError("");
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: Number(formData.price) 
      };
      await createCourse(payload);
      alert("Course Created Successfully!");
      navigate('/admin/dashboard');

    } catch (err) {
      console.error("Creation Error", err)
      setError(err.response?.data?.message || "Failed to create the course")
    }
    finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-md p-8">
        
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-500 mt-2">Share your knowledge with the world.</p>
        </div>

        {error && (<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                {error} 
               </div>
          )  
        }
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* Top Row: Title & Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Course Title" 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange}
                    placeholder="e.g., Advanced React Patterns" 
                    required
                />
                <Input 
                    label="Price (USD)" 
                    type="number" 
                    name="price"
                    value={formData.price} 
                    onChange={handleChange}
                    placeholder="49.99" 
                    required
                />
            </div>

            {/* Image URL */}
            <Input 
                label="Thumbnail URL" 
                name="imageUrl"
                value={formData.imageUrl} 
                onChange={handleChange}
                placeholder="https://..." 
            />

            {/* Description (Custom Textarea) */}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all min-h-[150px]"
                    placeholder="Describe what students will learn..."
                    required
                ></textarea>
            </div>

            {/* Submit Button */}
            <button 
                disabled={loading}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Publishing..." : "Publish Course"}
            </button>

        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
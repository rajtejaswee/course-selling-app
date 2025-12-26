import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../components/common/input';
import { getAllCourses, updateCourseService } from '../services/course.service';

function UpdateCourse() {
  const { courseId } = useParams(); // Get the ID from the URL (e.g., /admin/update-course/123)
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    imageUrl: ""
  });

  useEffect(() => {
    const fetchCourseData = async () => {
        try {
            const response = await getAllCourses();
            
            // Logic to handle your backend response structure
            let allCourses = [];
            if (Array.isArray(response.data)) allCourses = response.data;
            else if (response.data?.courses) allCourses = response.data.courses;

            // Find the specific course
            const courseToEdit = allCourses.find(c => c._id === courseId);
            
            if (courseToEdit) {
                // PRE-FILL THE FORM
                setFormData({
                    title: courseToEdit.title,
                    description: courseToEdit.description,
                    price: courseToEdit.price,
                    imageUrl: courseToEdit.imageUrl
                });
            } else {
                alert("Course not found!");
                navigate('/admin/dashboard');
            }
        } catch (error) {
            console.error("Error fetching course", error);
        } finally {
            setLoading(false);
        }
    };

    fetchCourseData();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
        // Convert price to number again
        const payload = { ...formData, price: Number(formData.price) };
        
        await updateCourseService(courseId, payload);
        alert("Course Updated Successfully!");
        navigate('/admin/dashboard');
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update course");
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading course data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Update Course</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                    label="Course Title" 
                    name="title"
                    value={formData.title} 
                    onChange={handleChange}
                    required
                />
                <Input 
                    label="Price (USD)" 
                    type="number" 
                    name="price"
                    value={formData.price} 
                    onChange={handleChange}
                    required
                />
            </div>

            <Input 
                label="Thumbnail URL" 
                name="imageUrl"
                value={formData.imageUrl} 
                onChange={handleChange}
            />

            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none min-h-[150px]"
                    required
                ></textarea>
            </div>

            <button 
                disabled={submitting}
                className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition"
            >
                {submitting ? "Updating..." : "Update Course"}
            </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
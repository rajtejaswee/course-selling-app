import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/common/CourseCard'; 
import { getAllCourses, deleteCourseService } from '../services/course.service';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    const handleDelete = async (courseId) => {
        
        const confirmDelete = window.confirm("Are you sure you want to delete this course?");
        if(!confirmDelete) {
            return
        }
        try {
            await deleteCourseService(courseId)
           setCourses((prevCourses) => {
            // Check if prevCourses exists and is actually an array before filtering
            if (!prevCourses || !Array.isArray(prevCourses)) {
                return []; 
            }
            return prevCourses.filter(course => course._id !== courseId);
        });
        
        alert("Course deleted successfully");
    } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete course");
    }
    }


    useEffect(() => {
        const fetchMyCourse = async () => {
            try {
                const response = await getAllCourses();
                
                // --- CHANGE 1: Debugging Log (Optional but recommended) ---
                console.log("Admin Dashboard Data:", response);

                // --- CHANGE 2: Robust Data Extraction & Typo Fix ---
                // If backend sends direct array: [ {..}, {..} ]
                if (Array.isArray(response)) {
                    setCourses(response);
                }
                // If backend sends object: { data: [ ... ] }
                else if (Array.isArray(response.data)) {
                     setCourses(response.data);
                } 
                // If backend sends object: { data: { courses: [ ... ] } }
                // FIX: You had "coourses" (typo) here previously
                else if (response.data && Array.isArray(response.data.courses)) {
                    setCourses(response.data.courses); 
                }
                else {
                    setCourses([]); // Fallback to empty array to prevent crashes
                }

            } catch (error) {
               console.error("Failed to fetch admin courses", error);
               setCourses([]); // Ensure it's always an array even on error
            }
            finally {
              setLoading(false);
            }
        };
        fetchMyCourse();
    }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
            
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your content and earnings.</p>
                </div>
                <Link 
                    to="/admin/create-course" 
                    className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition flex items-center gap-2 shadow-sm"
                >
                    + Create New Course
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading your dashboard...</div>
            ) : (
                // --- CHANGE 3: Safety Check Wrapper ---
                // We verify 'courses' is actually an array before trying to map it.
                // This prevents "Uncaught TypeError: courses.map is not a function"
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.isArray(courses) && courses.length > 0 ? (
                        courses.map((course) => (
                            <div key={course._id} className="relative group">
                                <CourseCard 
                                    title={course.title}
                                    description={course.description}
                                    price={course.price}
                                    imageUrl={course.imageUrl}
                                    onClick={() => {}}
                                />
                                
                                <div className="absolute top-4 right-4 flex gap-2">
                                     <button 
                                     onClick={() => navigate(`/admin/update-course/${course._id}`)}
                                     className="bg-white/90 p-2 rounded-full text-blue-600 hover:text-blue-800 shadow-sm transition hover:scale-110">
                                        ✏️ 
                                     </button>
                                     <button 
                                     onClick={() => handleDelete(course._id)}
                                     className="bg-white/90 p-2 rounded-full text-red-600 hover:text-red-800 shadow-sm transition hover:scale-110">
                                        🗑️
                                     </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        // --- CHANGE 4: Empty State UI ---
                        // Show this if the array is valid but empty
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">No courses found.</p>
                            <p className="text-sm text-gray-400">Click the button above to create your first one!</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
  );
}

export default AdminDashboard;
import { useEffect, useState } from 'react';
import CourseCard from '../components/common/CourseCard'
import { getAllCourses, buyCourse } from '../services/course.service';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';



function Courses() {

  const navigate = useNavigate();
  const {user} = useAuth();

  const[courses, setCourses] = useState([]);
  const[loading, setLoading] = useState(true);
  const[error, setError] = useState(null);

  // Tracking loading state for specific buttons
  const[purchaseID, setPurchaseID] = useState(null)
  
  useEffect(() => {
    const fetchCourses = async() => {
        try {
            const response = await getAllCourses();

            // data extraction (handling different backend structures)
            if (Array.isArray(response.data)) {
             setCourses(response.data);
            }
            else if (response.data && Array.isArray(response.data.courses)) {
             setCourses(response.data.courses);
            }
            else {
            // Fallback: Empty array so .map doesn't crash
            setCourses([]); 
        }
        } catch (error) {
           console.log("Error in fetching the courses", error) 
           setError("Failed to load courses, Please try again after later")
        }
        finally {
            setLoading(false)
        }
    }
    fetchCourses();
  }, [])

  const handleBuy = async (courseId) => {
    if(!user) {
        alert("Please log in to purchase course")
        navigate("/login")
        return;
    }

    setPurchaseID(courseId)
    try {
        await buyCourse(courseId);
        alert("Course Purchased Successfully! Check 'My Learning'.");
        navigate("/my-courses")
    }
    catch(err) {
        const message = err.response?.data?.message || "Purchase failed";
        alert(message);
    }
    finally{
        setPurchaseID(null);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Explore Courses</h1>
                <p className="text-gray-600 mt-2">Pick a course and start your journey today.</p>
            </div>

            {/* Conditonal Rendering based on Status */}
            {/* Loading */}
            {loading && (
                <div className="text-center py-20">
                    <div className="text-blue-600 text-xl font-bold animate-pulse">
                        Loading courses..
                    </div>
                </div>
            )}


            {/* Error */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    {error}
                </div>
            ) }

            {/* Scenerio: Success and display the grid */}

            {/* The Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    
                    {/* Check if array is empty */}
                    {courses.length === 0 ? (
                        <p className="text-gray-500 col-span-full text-center">No courses found.</p>
                    ) : (
                        courses.map((course) => (
                            <div key={course._id} className="relative">
                            <CourseCard 
                                key={course._id} // MongoDB uses _id
                                title={course.title}
                                description={course.description}
                                price={course.price}
                                imageUrl={course.imageUrl}
                                buttonText='Buy Now'
                                onClick={() => handleBuy(course._id)}
                            />
                            
                        {purchaseID === course._id && (
                        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-xl">
                            <span className="font-bold text-blue-600 animate-pulse">Processing...</span>
                        </div>
                        )}
                        </div>
                    ))
                    )}
                </div>
            )}
        </div>
    </div>
  );
}

export default Courses;
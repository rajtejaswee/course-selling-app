import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getMyPurchases } from '../services/course.service';
import CourseCard from '../components/common/CourseCard';


function MyPurchases() {

  const[purchases, setPurchases] = useState([])
  const[loading, setLoading] = useState(true);
  const [error, setError] = useState(null)

  useEffect(() => {
        const fetchMyCourse = async () => {
            try {
            const response = await getMyPurchases();
            if (response.data && Array.isArray(response.data.purchases)) {
                    setPurchases(response.data.purchases);
                } else {
                    setPurchases([]);
                }
        } catch (error) {
            setError("Failed to fetch the course")
        }
        finally {
            setLoading(false)
        }
        }
        fetchMyCourse();
  },[])

  if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-500">
                {error}
            </div>
        );
    }
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
                <p className="text-gray-600 mt-1">Keep up the momentum!</p>
            </div>

            {/* Empty State Check (If they haven't bought anything) */}
            {purchases.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-xl text-gray-600">You haven't purchased any courses yet.</h2>
                    <Link to="/courses" className="text-blue-600 font-bold hover:underline mt-2 inline-block">
                        Browse Catalog
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchases.map((purchase) => {
                        const course = purchase.courseId;
                        if(!course) return null

                        return (
                                <CourseCard 
                                    key={purchase._id} 
                                    title={course.title}
                                    description={course.description}
                                    imageUrl={course.imageUrl}
                                    price={course.price}
                                    buttonText='Start Learning'
                                    onClick={() => alert(`Starting course: ${course.title}`)}
                                />
                        );
                    })};
                </div>
               )}
        </div>
     </div>
  );
}

export default MyPurchases;
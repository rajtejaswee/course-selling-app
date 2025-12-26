import api from './api'

// 1. GET ALL COURSES (Public Catalog)
export const getAllCourses = async () => {
    const response = await api.get("/courses/preview")
    return response.data;
}

// 2. CREATE COURSE (Admin Only)
//Matches adminRouter.route("/course")
export const createCourse = async(courseData) => {
    const response = await api.post("/admins/course", courseData)
    return response.data;
}

// 3. GET MY CREATED COURSE (Admin Only)
// Matches adminRouter.route("/course").get(...)
export const getAdminCourse = async () => {
    const response = await api.get("/admins/course");
    return response.data;
}

// 4. GET MY PURCHASES (Student Only)
//Matches courseRouter.route('/my-courses')
export const getMyPurchases = async () => {
    const response = await api.get("/courses/my-courses")
    return response.data;
}

// 5. BUY COURSE (Student Only)
// Matches courseRouter.route('/purchase')
export const buyCourse = async (courseId) => {
    const response = await api.post("/courses/purchase", { courseId });
    return response.data;
}

export const deleteCourseService = async (courseId) => {
    const response = await api.delete(`/admins/course/${courseId}`);
    return response;
}

export const updateCourseService = async (courseId, updateData) => {
    const response = await api.put(`/admins/course/${courseId}`, updateData);
    response.data;
}
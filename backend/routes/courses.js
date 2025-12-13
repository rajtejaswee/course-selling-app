import Router from "express"

const courseRouter = Router()

// an endpoint to hit when user hits buying a course
courseRouter.post('/purchase', function (req,res) {
    res.send({
        message:"User's courses"
    })
})

// To show all the courses
courseRouter.get('/preview', function(req,res) {
    res.send({
        message:"All the courses"
    })
})

export default courseRouter
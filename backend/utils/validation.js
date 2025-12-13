import {z} from "zod"

const signupSchema = z.object({
    username: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(4),
})

const signinSchema = z.object({
    email: z.string().email(),
    password:z.string().min(4),

})

const courseSchema = z.object({
    title:z.string().min(1),
    desription:z.string().min(5),
    price:z.number(),
    imageUrl:z.string()
})

export {signinSchema, signupSchema, courseSchema}
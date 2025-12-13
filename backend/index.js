import dotenv from 'dotenv';
import connectDB from './db/index.js';
import { app } from './app.js';

dotenv.config()


connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Serving is running on port ${process.env.PORT}`)
    })
})
<<<<<<< HEAD
app.post('/user/signin', (req,res) => {

=======
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
>>>>>>> 93c785a (Auth done)
})


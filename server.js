import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoute from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import cors from "cors";

// configure env
dotenv.config();

//connect database
connectDB();

// rest object
const app = express()

//middelwares
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

//routes
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/category", categoryRoute)
app.use("/api/v1/product", productRoutes)

// rest api
app.get('/', (req, res) =>{
    res.send(
        "<h1>Chao mung den voi ecommerce success</h1>"
    );
})

// port
const PORT = process.env.PORT || 8080

// run server
app.listen(PORT, () =>{
    console.log(
        `Server dang chay tren cong ${PORT}`.bgCyan.white
        );
})
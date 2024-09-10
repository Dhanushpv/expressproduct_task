const express = require('express');
const app=express();
const dotenv =require('dotenv');
dotenv.config();
const mongoose =require('mongoose');

app.use(express.json());
app.use(express.urlencoded({extended:true}));


async function mongoConnect() {
    try {
        console.log("mongodb uri : ", process.env.MONGODB_URI)
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connection established...");
        
    } catch (error) {
        console.log("Database connectin error : ", error);
    }
}
mongoConnect()


const users = new mongoose.Schema({
    title: {
        type : String,
        required : true,
    },
    desicription: {
        type : String,
        required : true,
    },
    catogory: {
        type : String,
        required : true,
    },
    price: {
        type : Number,
        required : true,
    }
});
let add=mongoose.model('addproduct',users)

app.use(express.static("../client"))

app.post('/addproduct', 
    async(req, res) => {
    let body = req.body;
    console.log("body :",body);
        let name = body.name;
        console.log(name);

        let newuser= await add.create(body);

        if(newuser){
            res.status(200).send("user created successfully")
        }
        else {
            res.status(400).send("user creation failed")
        }
            

        

});

// app.get('/test', (req, res) => {
    
    
//     res.status(200).send("GetTest successful");
// });

app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})
const express = require('express');
const app=express();
const dotenv =require('dotenv');
dotenv.config();
const mongoose =require('mongoose');
const{MongoClient,ObjectId} = require('mongodb')

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
    description: {
        type : String,
        required : true,
    },
    category: {
        type : String,
        required : true,
    },
    price: {
        type : Number,
        required : true,
    },
    image:{
        type:String,
        required:true,
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
            res.status(200).send("product Added")
        }
        else {
            res.status(400).send("user creation failed")
        }    

});

app.get('/product', async(req, res) => {
    try {
        let productlist = await add.find();
        console.log("product list:", productlist);

        if (productlist) {
            res.status(200).json(productlist); 
        } else {
            res.status(400).json({ message: "Product not fetched" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});


app.get('/user/:id', async (req, res) => {
    const productId = req.params.id;
    console.log("productId", productId);

    try {
        const product = await add.findOne({ _id: productId });

        if (product) {
            res.status(200).json({
                title: product.title,
                description: product.description,
                price: product.price,
                category: product.category,
                image:product.image
            });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).send('Server error');
    }
});








app.put('/updateproduct/:id', async (req, res) => {
    app.put('/updateproduct/:id', async (req, res) => {
        try {
            const body = req.body;
            console.log("Request received to update product with ID:", req.params.id);
            console.log("Request Body: ", body);
    
            const data = {
                title : body.title,
                description : body.description,
                price : body.price,
                category : body.category,
                image : body.image
            };
    
            console.log("Data to be updated: ", data);
    
            const id = req.params.id;
    
            // Validate if `id` is a valid ObjectId
            if (!ObjectId.isValid(id)) {
                console.error("Invalid ObjectId: ", id);
                return res.status(400).json({ error: "Invalid product ID" });
            }
    
            // Update the product by its _id
            const updateResult = await add.updateOne(
                { _id: ObjectId(id) },
                { $set: data }
            );
    
            console.log("Update Operation Result: ", updateResult);
    
            if (updateResult.matchedCount === 0) {
                return res.status(404).json({ message: "Product not found." });
            }
    
            if (updateResult.modifiedCount > 0) {
                return res.status(200).json({ message: "Product successfully updated." });
            } else {
                return res.status(200).json({ message: "No changes were made to the product." });
            }
    
        } catch (error) {
            console.error("Error updating product: ", error);
            res.status(500).json({ error: "An error occurred while updating the product." });
        }
    });
});

// app.put('/updateproduct/:id',
//     async (req,res)=>{
//        let body =req.body;
//        console.log("body  ",body);

//        let data ={
//         title : body.title,
//         description : body.description,
//         price : body.price,
//         category : body.category,
//         image : body.image
//        }
//        console.log(data);

//        let id = req.params.id;

//        let user_data = await add.updateOne({id},{$set:data});

//        console.log("user_data",user_data);
//        if(user_data){
//         res.status(200).send(" successfully updated..");
//        }else{
//         res.status(400).send(" Something went wrong");
//        }

       

      
//     }
// )




app.delete('/deluser/:id', async (req, res) => {
    try {
        const delproduct = req.params.id;
        const findproduct = await add.deleteOne({ _id: delproduct });
        console.log("findproduct:", findproduct);

        if (findproduct.deletedCount > 0) {
            res.status(200).send("Product deleted successfully.");
        } else {
            res.status(404).send("Product not found.");
        }
    } catch (error) {
        res.status(400).send("Error deleting product: " + error.message);
    }
});





app.listen(process.env.PORT,()=>{
    console.log(`Server running at http://localhost:${process.env.PORT}`)
})


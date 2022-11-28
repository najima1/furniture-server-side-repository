const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken')

const uri = process.env.DB_URL
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const database = client.db('furniture')
const categoryCollection = database.collection('category')
const productsCollection = database.collection('products')
const purchaseProductCollection = database.collection('purchaseProduct')
const addSellerCollection = database.collection('sellerProduct')
const userCollection = database.collection('users')


//get all category collection
const getCategory = async (req, res) => {
    try {
        const query = {}
        const result = await categoryCollection.find(query).toArray()

        if (!result) {
            return res.send({
                status: 404,
                message: 'category product dose not exist'
            })
        }

        return res.send(result)

    } catch (error) {
        return res.send({ message: "Category dose not exist" })
    }
}

//get specific product
const getAllProduct = async (req, res) => {
    try {

        const query = {};
        const result = await productsCollection.find(query).toArray()

        if (!result) {
            return res.send({
                status: 404,
                message: 'Product dose not exist'
            })
        }

        res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "Bad Request"
        })
    }
}

//get single product with category
const getSingProductWithId = async (req, res) => {
    try {
        const product = req.params.category
        const query = { category: product }

        const result = await productsCollection.find(query).toArray()

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "Bad Request"
        })
    }
}

//purchase product
//get single product
const getSingleProduct = async (req, res) => {
    try {
        const id = req.params.id
        const query = { _id: ObjectId(id) }
        const email = req.query.email


        const result = await productsCollection.findOne(query)

        if (!result) {
            return res.send({
                status: 404,
                message: 'Product dose not exist'
            })
        }

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "Bad Request"
        })
    }
}


//purchese proudct get with email
//filter order product with email
const purcheseProduct = async (req, res) => {
    let query = {}
    if (req.query.email) {
        query = { email: req.query.email }
    }

    let result = await purchaseProductCollection.find(query).toArray()

    return res.send(result)
}

//get user with role
let getUserRole = async (req, res) => {
    try {
        const email = req.params.email;
        const query = { email: email }

        const result = await userCollection.findOne(query)

        return res.send(result)


    } catch (error) {
        return res.send({
            status: 404,
            message: "user dose not exist"
        })
    }
}

//filter user with
// user role 
const filterAllUserbyRole = async (req, res) => {
    try {
        const role = req.params.role;
        const query = { role: role }
        const result = await userCollection.find(query).toArray()

        return res.send(result)


    } catch (error) {
        return res.send({
            status: 404,
            message: "user dose not exist"
        })
    }
}

//seller can add product with
// full information
const addProductBySeller = async (req, res) => {
    try {
        const product = req.body;
        const result = await addSellerCollection.insertOne(product)

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 400,
            message: 'Bad request'
        })
    }
}

//add product by seller
//in different collection
const addProductSellerDifferent = async (req, res) => {
    try {
        const product = req.body;
        const result = await productsCollection.insertOne(product)

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 400,
            message: 'Bad request'
        })
    }
}

//get all product in seller
//in different collection
const sellerAllProduct = async (req, res) => {
    try {

        let query = {}
        if (req.query.email) {
            query = { email: req.query.email }
        }

        let result = await addSellerCollection.find(query).toArray()

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "Bad Request"
        })
    }
}
//purchase a single product
let purchaseOneProduct = async (req, res) => {
    try {
        const body = req.body
        const id = req.body.id
        const query = { email: req.body.email, _id: ObjectId(id) }

        const result = await purchaseProductCollection.insertOne(body)

        res.send(result)


    } catch (error) {
        return res.send({
            status: 404,
            message: "product purchase bad request"
        })
    }
}

// delete purchase item
const deletePurchaseItem = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }

        const result = await purchaseProductCollection.deleteOne(query)

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "product delete bad request"
        })
    }
}
// delete purchase item
const deleteSellerProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }

        const result = await addSellerCollection.deleteOne(query)

        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "product delete bad request"
        })
    }
}

const deleteUserOrSellerByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const query = { _id: ObjectId(id) }

        const result = await userCollection.deleteOne(query)
        return res.send(result)

    } catch (error) {
        return res.send({
            status: 404,
            message: "Product delete bad request"
        })
    }
}
//save user in database with login
const saveUserInDataBase = async (req, res) => {
    try {
        const user = req.body;
        const email = req.params.email;
        const filter = { email: email };
        const options = { upsert: true }

        const obj = {
            email: user.email,
            name: user.name,
            role: user.role || 'user'
        }
        const updateDoc = { $set: obj }


        const result = await userCollection.updateOne(filter, updateDoc, options)

        return res.send({
            status: true,
            message: 'user created',
            result,
        })

    } catch (error) {
        res.send({
            status: 404,
            message: "Bad request"
        })
    }
}




module.exports = { getCategory, getAllProduct, getSingleProduct, saveUserInDataBase, getSingProductWithId, purchaseOneProduct, deletePurchaseItem, purcheseProduct, getUserRole, addProductBySeller, addProductSellerDifferent, sellerAllProduct, deleteSellerProduct, filterAllUserbyRole, deleteUserOrSellerByAdmin }
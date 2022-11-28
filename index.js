require('dotenv').config()
const jwt = require('jsonwebtoken')
const express = require("express")
const app = express()
const cors = require('cors')
const { getCategory, getAllProduct, getSingleProduct, saveUserInDataBase, getSingProductWithId, purchaseOneProduct, deletePurchaseItem, purcheseProduct, getUserRole, addProductBySeller, addProductSellerDifferent, sellerAllProduct, deleteSellerProduct, filterAllUserbyRole, deleteUserOrSellerByAdmin } = require('./controlar')
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }))


const run = async () => {

    //get category
    app.get('/category', getCategory)

    //get all category product
    app.get('/allProducts', getAllProduct)

    //get single product with category
    app.get('/product/:category', getSingProductWithId)

    //get single product
    app.get('/allProducts/:id', getSingleProduct)


    //filter order product with email
    //fillter by email
    app.get('/orderProduct', purcheseProduct)

    /// get user with role
    app.get('/user/role/:email', getUserRole)


    //filter user wiht
    //user role
    app.get('/user/:role', filterAllUserbyRole)

    //seller can add product
    //with full information
    app.put('/addproduct/seller', addProductBySeller)

    //add product by seller
    //in different collection
    app.put('/addProductBy/seller', addProductSellerDifferent)

    //get seller all produt
    //that added by seller
    //filter seller product by email
    app.get('/sellerAllProduct', sellerAllProduct)

    //delete seller product
    //seller product delete with id
    app.delete('/deleteSellerProduct/:id', deleteSellerProduct)

    // delete purchase item
    app.delete('/orderProduct/:id', deletePurchaseItem)

    //DELETE USER BY ADMIN
    //ADMIN CAN BE DELETE USER IF HE WANT
    app.delete('/deleteUserByAdmin/:id', deleteUserOrSellerByAdmin)


    app.post('/purchaseOne', purchaseOneProduct)

    //save user in DB
    app.put('/user/:email', saveUserInDataBase)

}
run().catch(e => console.log(e.message))


app.get('/', function (req, res) {
    res.json({ msg: 'furniture server is running' })
})

app.listen(port, function () {
    console.log('web server is listening on port', port)
})
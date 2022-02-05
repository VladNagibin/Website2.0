const { Router, response } = require('express')
const router = Router()
const Cookies = require('cookies')
const bCrypt = require('bcrypt')
const User = require('../models/User')
const enter = require('../modules/enter')
const api = require('../modules/api')
const enterMiddle = require('../middleware/enter')
const Category = require('../models/Category')
const Product = require('../models/Product')
const request = require('request')
router.get('/', enterMiddle, async (req, res) => {
    //const { cookies } = req
    categories = await Category.find({ "parentId": '0' }).lean()
    res.render('index', {
        categories

    })




})
router.get('/EnterInAccount', ((req, res) => {
    res.render('Enter', {
        title: "Enter page",
    })
}))

router.get('/addIncluded', async (req, res) => {

})



router.get('/openCategory', (async (req, res) => {
    const { Id, parentId } = req.query
    categories = await Category.find({ "parentId": Id }).lean()
    res.render('index', {
        categories

    })
}))
router.get('/openProducts', (async (req, res) => {
    const { Id } = req.query
    products = await api.getSection(Id)
    res.render('products',{
        products
    })

}))
// function getProducts(id) {
//     return new Promise((resolve, reject) => {
//         categories = await Category.find({ "parentId": id }).lean()
//         if (categories.length = 0) {
//             products = await Product.find({'categoryId':id})
//             return products
//         } else {
//             categories.forEach(element => {

//             });
//         }
//     })
// }
router.post('/enter', enter.logIn)

router.post('/createGroup', (async (req, res) => {
    const category = new Category({
        name: req.body.name,
        Id: req.body.id,
        parentId: req.body.parentId
    })
    await category.save()
    res.redirect('/')
}))
router.get('/getGroups', async (req, res) => {
    api.saveCategories()
    res.redirect('/')

})
// router.post('/getSection', (req, res) => {
//     const { secId } = req.body

//     //console.log(secId)
//     res.redirect('/')
// })




router.post('/create', (async (req, res) => {
    const product = new Product({
        name: req.body.name,
        available: true,
        price: req.body.price,
        categoryId: req.body.categoryId,
        description: req.body.description,
        barcode: req.body.barcode,
        store: true,
        pickup: true,
        delivery: true,
        manufacturer_warranty: true,
        min_quantity: req.body.min_quantity,

    })
    await product.save()
    res.redirect('/')
}))
router.get('/createGroup', ((req, res) => {
    res.render('createGroup', {
        title: "create group page",
    })
}))
router.get('/create', ((req, res) => {
    res.render('create', {
        title: "create page",
    })
}))
router.get('/registration', ((req, res) => {
    res.render('registration', {
        title: "registration page",
    })
}))
router.post('/registration', (async (req, res) => {

    var hashPassword = (await bCrypt.hash(req.body.password, 10))
    const user = new User({
        password: hashPassword,
        name: req.body.name,
        mail: req.body.mail,
        isAdmin: !!req.body.isAdmin
    })



    await user.save()

    console.log("Пользователь зарегистрирован: " + user.name)

    res.redirect('/')

}))
router.get('/out', ((req, res) => {
    res.clearCookie('UserHash')
    res.clearCookie('UserName')
    res.clearCookie('UserMail')
    res.clearCookie('addedMails')
    res.redirect('/EnterInAccount')
}))

module.exports = router

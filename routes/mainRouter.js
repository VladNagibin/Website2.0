const { Router, response } = require('express')
const router = Router()
const Cookies = require('cookies')
const bCrypt = require('bcrypt')
const User = require('../models/User')
const enter = require('../modules/enter')
const enterMiddle = require('../middleware/enter')
const Category = require('../models/Category')
const Product = require('../models/Product')
const request = require('request')
router.get('/', enterMiddle, async (req, res) => {
    const { cookies } = req
    products = await Product.find().lean()
    if ('UserName' in cookies) {
        res.render('index', {
            // title: "main page",
            // Username: cookies.UserName,
            products

        })
    }
    else {
        res.render('index', {
            title: "main page",
            Username: 'Not found',
            products
        })
    }



})
router.get('/EnterInAccount', ((req, res) => {
    res.render('Enter', {
        title: "Enter page",
    })
}))




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

    href = "http://www.galacentre.ru/api/v2/sections/json/?key=5a1e6024f2310649679acb5885c282e4"
    request(href, (err, res, body) => {
        if (err) {
            console.log(err)
            //reject(err)

        } else {
            result = JSON.parse(body)
            //resolve(result)
            saveCategories(result.DATA)
           
        }
    })
    res.redirect('/')
    
})
async function saveCategories(Data){
    for (let index = 0; index < Data.length; index++) {
        const element = Data[index];
        var gr = new Category({
            name: element.name,
            parentId: element.parent_id,
            Id: element.id
        })
        gr.save()
    }
}
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

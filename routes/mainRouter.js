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

router.get('/addIncluded',async (req,res)=>{

})
function addIncluded(id,parentIds = []){
    return new Promise((async (resolve, reject) => {
        parentIds.push(id)
        categories = await Category.find({ "parentId": id }).lean()
        if (categories.length = 0) {
            products = await Product.find({'categoryId':id})
            for(var i =0;i<products.length;i++){
                products[i].included = parentsIds
                await products[i].save()
            }
            resolve()
        } else {
            for(var i =0;i<categories.length;i++){
                await addIncluded(categories[i].Id)
            };
        }
    }))
}
router.get('/openCategory', (async (req, res) => {
    const { Id, parentId } = req.query
    categories = await Category.find({ "parentId": Id }).lean()
    res.render('index', {
        categories

    })
}))
router.get('/openProducts', (async (req, res) => {
    const { Id } = req.query

}))
function getProducts(id) {
    return new Promise((resolve, reject) => {
        categories = await Category.find({ "parentId": id }).lean()
        if (categories.length = 0) {
            products = await Product.find({'categoryId':id})
            return products
        } else {
            categories.forEach(element => {
                
            });
        }
    })
}
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
router.post('/getSection', (req, res) => {
    const { secId } = req.body
    href = "http://www.galacentre.ru/api/v2/catalog/json/?section=" + secId + "&key=5a1e6024f2310649679acb5885c282e4"
    request(href, async (err, res, body) => {
        if (err) {
            console.log(err)
        } else {
            result = JSON.parse(body)
            //console.log(result.DATA.length)
            for (let i = 0; i < result.DATA.length; i++) {
                await saveProduct(result.DATA[i])
            }

        }
    })
    //console.log(secId)
    res.redirect('/')
})

function saveProduct(data) {
    return new Promise((resolve, reject) => {
        let available
        if (data.active = 'Y') {
            available = true
        } else {
            available = false
        }
        try {
            product = new Product({
                api_id: data.id,
                available: available,
                name: data.name,
                categoryId: data.section,
                image: data.image,
                images: data.images,
                price: data.price_base,
                min_quantity: data.min,
                description: data.about,
                barcode: data.barcode,
                parameters: data.specifications,
            })
            product.save().then(doc => {
                resolve()
            })
        } catch (e) {
            reject(e)
        }
    })
}

async function saveCategories(Data) {
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

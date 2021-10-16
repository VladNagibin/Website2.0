const { Router, response } = require('express')
const router = Router()
const Cookies = require('cookies')
const bCrypt = require('bcrypt')
const User = require('../models/User')
const enter = require('../modules/enter')
const enterMiddle = require('../middleware/enter')
const Category = require('../models/Category')

router.get('/', enterMiddle, async (req, res) => {
    const { cookies } = req
    if ('UserName' in cookies) {
        res.render('index', {
            title: "main page",
            Username: cookies.UserName,
          
        })
    }
    else {
        res.render('index', {
            title: "main page",
            Username: 'Not found',
          
        })
    }



})
router.get('/EnterInAccount', ((req, res) => {
    res.render('Enter', {
        title: "Enter page",
    })
}))




router.post('/enter', enter.logIn)

router.post('/createGroup', (async (req,res)=>{
    const category = new Category({
        name: req.body.name,
        Id:req.body.id,
        parentId: req.body.parentId
    })
    await category.save()
    res.redirect('/')
}))
router.get('/createGroup', ((req, res) => {
    res.render('createGroup', {
        title: "create group page",
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
        isAdmin : !!req.body.isAdmin
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

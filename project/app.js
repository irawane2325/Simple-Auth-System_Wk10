const express = require('express')
const cookieParser = require("cookie-parser")
const { v4: uuidv4 } = require('uuid');
const fake_db = require('./db.js')
const matchCredentials = require('./utils.js')

const app = express()
app.set('view engine', 'ejs')
app.use(cookieParser())
app.use(express.urlencoded({extended: false}))

// show home with forms
app.get('/', function(req, res){
res.render('pages/home')
})

// create a user account
app.post('/create', function(req, res){
    let body = req.body
    let user = {
    username: body.username,
    password: body.password
    }
    fake_db.users  = user
    console.log(fake_db)
    res.redirect('/')
    })

       
            // login
            app.post('/login', function(req, res){
            if (matchCredentials(req.body)) {
                let user = req.body.username
                  let sess = uuidv4()
                  
                  let ids = {
                    id: sess,  
                    user: user,
                    timeOfLogin: Date.now()
                  }
            fake_db.sessions = ids
            console.log(fake_db)
        
                // create cookie that holds the UUID (the Session ID)
              let x =   res.cookie('SID', ids, {
                    expires: new Date(Date.now() + 900000),
                    httpOnly: false
                    })
                    console.log(x)
                    console.log(ids)
                    res.render('pages/members')
                    } else {
                    res.redirect('/error')
                    }
                })

              
                    
    // this is the protected route
    app.get('/supercoolmembersonlypage', function(req, res){
    let id = req.cookies.SID
    let session = fake_db.sessions[id]

    // to error.ejs
if (session) {
    res.render('pages/members')
    } else {
    res.render('pages/error')
    }
    })

    // if something went wrong, you get sent here
    app.get('/error', function(req, res){
    res.render('pages/error')
    })
    // 404 handling
    app.all('*', function(req, res){
    res.render('pages/error')
    })




    app.listen(1612)
    console.log('Server is running on 1612')


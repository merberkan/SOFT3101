const express = require('express');
const router = express.Router();

router.get('/', (req,res) =>{
    if(req.session.loggedinUser){
        console.log(req.session.emailAddress);
    }
    res.render('index',{email : req.session.emailAddress , loginn : req.session.loggedinUser });
    
    
}); 
router.get('/register', (req,res) =>{
    res.render('register',{message : req.session.message});
}); 
router.get('/login', (req,res) =>{
res.render('login' , {message : req.session.message});
});
router.get('/dashboard', function(req, res, next) {
    console.log(req.session.emailAddress)
        res.render('dashboard',{email : req.session.emailAddress , loginn : req.session.loggedinUser})
});
router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});
router.get('/anasayfa', (req,res) =>{
    res.render('anasayfa',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/contactus', (req,res) =>{
    if(req.session.loggedinUser){
        console.log(req.session.emailAddress);
    }
    res.render('contactus',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/Useragreement', (req,res) =>{
    res.render('Useragreement',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/events', (req,res) =>{
    res.render('events',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/aboutus', (req,res) =>{
    res.render('aboutus',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/privacypolicy', (req,res) =>{
    res.render('privacypolicy',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/category', (req,res) =>{
    res.render('category',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 
router.get('/cityguide', (req,res) =>{
    res.render('cityguide',{email : req.session.emailAddress , loginn : req.session.loggedinUser} );
}); 


module.exports = router;
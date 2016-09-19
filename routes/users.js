const express = require("express");
const router = express.Router()
const authHelpers = require("../helpers/authHelpers")
const passwordHelpers = require("../helpers/passwordHelpers")
const knex = require("../db/knex");

router.use(authHelpers.currentUser);
router.use(authHelpers.checkAuthentication)

router.get('/', (req,res) =>{
    knex('users').then((users) => {
      knex('users').where({id:req.user.id}).first().then((currentUser) => {
        var filteredUsers = users.filter((user)=>{
          if (user.id === currentUser.id) return false;
          //etc. 
          return true;
        })



        res.render('users/index', {user:currentUser, users:filteredUsers});
      })
    })
});


router.get('/:id', (req,res) =>{
    knex('users').where({id:req.params.id}).first().then((user) => {
      knex('users').where({id:req.user.id}).first().then((currentUser) => {
        res.send({user})
      })
    })
})

router.get('/:id/edit', authHelpers.ensureCorrectUser, (req,res) =>{
    knex('users').where({id:req.params.id}).first().then((user) => {
      res.render('users/edit', {user, message: req.flash('loginMessage')});
    })
});

router.patch('/:id', authHelpers.ensureCorrectUser, (req,res) =>{
    passwordHelpers.editUser(req).then((user) => {
      res.redirect(`/users`);
    }).catch((err)=> {
      if (err.constraint === 'users_username_unique') {
        err.message = "username is already taken"
      }
      req.flash('loginMessage', err.message)
      res.redirect(`/users/${req.user.id}/edit`);
    })
});

router.delete('/:id', authHelpers.ensureCorrectUser, (req,res) =>{
    knex('users').where({id:req.params.id}).del().then(() => {
      req.logout();
      res.redirect('/login')
    })
});

module.exports = router;
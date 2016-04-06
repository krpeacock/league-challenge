const express = require("express");
const router = express.Router()
const authHelpers = require("../helpers/authHelpers")
const passwordHelpers = require("../helpers/passwordHelpers")
const knex = require("../db/knex");

router.use(authHelpers.currentUser);
router.use(authHelpers.checkAuthentication)

router.get('/', function(req,res){
    knex('users').then((users) => {
      res.render('users/index', {users});
    })
});

router.get('/:id/edit', authHelpers.ensureCorrectUser, function(req,res){
    knex('users').where({id:req.params.id}).first().then((user) => {
      res.render('users/edit', {user});
    })
});

router.patch('/:id', authHelpers.ensureCorrectUser, function(req,res){
    passwordHelpers.editUser(req).then((user) => {
      res.redirect(`/users`);
    }).catch((err)=> {
      require("locus")
      eval(locus)
      res.render(`/users/${user.id}/edit`);
    })
});

router.delete('/:id', authHelpers.ensureCorrectUser, function(req,res){
    knex('users').where({id:req.params.id}).del().then(() => {
      req.logout();
      res.redirect('/login')
    })
});

module.exports = router;
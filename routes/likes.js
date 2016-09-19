const express = require("express");
const router = express.Router({mergeParams: true});
const knex = require("../db/knex");
const authHelpers = require("../helpers/authHelpers")

router.use(authHelpers.currentUser);
router.use(authHelpers.checkAuthentication)

router.get('/', (req,res) =>{
  knex('likes')
    .where({user_id: req.params.user_id})
    .then((likes) => {
      knex('users')
        .where({id: req.params.user_id})
        .first()
        .then((user) => {
          res.render('likes/index', {likes, user})
        })

    })
});

router.get('/new', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  res.render('likes/new')
});

router.get('/:id', (req,res) =>{
  knex('likes')
    .where({user_id: req.params.post_id})
    .join("users", "user_id", "users.id")
    .then((user) => {
      res.render('likes/index')
    })
});

router.get('/:id/edit', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('likes')
    .where({id: req.params.id})
    .first()
    .then((post) => {
      res.render('likes/edit', {post})
    })
});

router.post('/', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('likes')
    .insert(Object.assign(req.body.post, {user_id: req.params.user_id}),"*")
    .then((post) => {
      res.redirect(`/users/${post[0].user_id}/likes`)
    })
});

router.patch('/:id', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('likes')
    .where({id: req.params.id})
    .update(req.body.post, "*")
    .then((post) => {
      res.redirect(`/users/${post[0].user_id}/likes`)
    })
});

router.delete('/:id', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('likes')
    .where({id: req.params.id})
    .del()
    .returning("user_id")
    .then((id) => {
      res.redirect(`/users/${id}/likes`)
    })
});

module.exports = router;
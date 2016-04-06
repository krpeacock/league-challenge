const express = require("express");
const router = express.Router({mergeParams: true});
const knex = require("../db/knex");
const authHelpers = require("../helpers/authHelpers")

router.use(authHelpers.currentUser);
router.use(authHelpers.checkAuthentication)

router.get('/', (req,res) =>{
  knex('posts')
    .where({user_id: req.params.user_id})
    .then((posts) => {
      knex('users')
        .where({id: req.params.user_id})
        .first()
        .then((user) => {
          res.render('posts/index', {posts, user})
        })

    })
});

router.get('/new', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  res.render('posts/new')
});

router.get('/:id', (req,res) =>{
  knex('posts')
    .where({user_id: req.params.post_id})
    .join("users", "user_id", "users.id")
    .then((user) => {
      res.render('posts/index')
    })
});

router.get('/:id/edit', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('posts')
    .where({id: req.params.id})
    .first()
    .then((post) => {
      res.render('posts/edit', {post})
    })
});

router.post('/', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('posts')
    .insert(Object.assign(req.body.post, {user_id: req.params.user_id}),"*")
    .then((post) => {
      require("locus")
      eval(locus)
      res.redirect(`/users/${post[0].user_id}/posts`)
    })
});

router.patch('/:id', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('posts')
    .where({id: req.params.id})
    .update(req.body.post, "*")
    .then((post) => {
      res.redirect(`/users/${post[0].user_id}/posts`)
    })
});

router.delete('/:id', authHelpers.ensureCorrectUserForPost, (req,res) =>{
  knex('posts')
    .where({id: req.params.id})
    .del()
    .returning("user_id")
    .then((id) => {
      res.redirect(`/users/${id}/posts`)
    })
});

module.exports = router;
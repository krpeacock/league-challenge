'use strict'

const bcrypt = require("bcrypt");
const knex = require("../db/knex")

exports.createUser =(req)=> {
    if(req.body.user.password.length < 6) {
      return Promise.reject({
        err:'password_length',
        message:'Password must be longer than 6 characters'
      })
    }
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(req.body.user.password, salt);
    return knex('users').insert({
      username: req.body.user.username,
      password:hash,
    }, "*")
},

exports.editUser =(req)=> {
    if(req.body.user.password.length < 6) {
      return Promise.reject({
        err:'password_length',
        message:'Password must be longer than 6 characters'
      })
    }
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(req.body.user.password, salt);
    return knex('users').where({id: req.params.id}).update({
      username: req.body.user.username,
      password:hash,
    }, "*")
},

exports.comparePass = (userpass, dbpass) => bcrypt.compareSync(userpass, dbpass);


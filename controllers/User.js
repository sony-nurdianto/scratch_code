const User = require("../models/User")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
privateKey = "eyedentity"
require('dotenv').config()


const validateUserInput =  require('../validator/Register')
const validateLoginInput =  require('../validator/Login')

module.exports = {
    register : ((req,res,next) => {
        const {error,isValid} = validateUserInput(req.body)
        if(isValid){
            return res 
            .statu(400)
            .json(error)
        }
        User.findOne({email : req.body.email})
        .then(user => {
            if(user){
                return res
                .status(400)
                .json({email : "email is alredy exist"})
            }else {
                const newUser = new User({name: req.body.name, email : req.body.email,password :req.body.password})
                bcrypt.genSalt(10,(err,salt)=> {
                    bcrypt.hash(newUser.password,salt,(err,hash) => {
                        if(err)
                            throw(err)

                            newUser.password = hash
                            newUser
                                .save()
                                .then(user => res.json(user))
                                .catch(err => console.log(err))
                    })
                })
            }
        })
    }),

    login : ((req,res,next) => {
        const {error,isValid} = validateLoginInput(req.body);
        if(!isValid){
            return res
                .status(400)
                .json(error)
        }
        const email= req.body.email
        const password = req.body.password

        User.findOne({email})
        .then(user => {
            if(!user){
                return res
                    .status(400)
                    .json({emailNotFound : "Email not found or wrong"})
            }
            bcrypt
                .compare( password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        const payload = {
                            id : user.id,
                            name : user.name
                        }

                        jwt.sign(payload,process.env.PRIVATE_KEY, {
                            expiresIn : 31556926
                        }, (err,token) => {
                            res.json({
                                success : true,
                                token : "Bearer" + token,
                                id : user.id
                            })
                        })

                    }else{
                        return res 
                            .status(400)
                            .json({passwordIncorrect: "password incorect"})
                    }
                })
        })
    }),


    authenticated: function (req, res, next) {
        User.findOne({
          email: req.body.email,
          
        })
          .then((response, err) => {
            if (err) next(err);
            else {
              if (
                response != null &&
                bcrypt.compareSync(req.body.password, response.password)
              ) {
                jwt.sign(
                  {
                    id: response._id,
                  },
                  privateKey,
                  { expiresIn: 60 * 60 },
                  (err, token) => {
                    res.json(token);
                  }
                );
              } else {
                res.json({ status: err });
              }
            }
          })
          .catch((err) => {
            throw err;
          });
      },
}
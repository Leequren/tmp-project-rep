const User = require('../models/User')

const registerOpts = {
    handler: async (req, reply) => {
        if (!req.session.authenticated) {
            console.log(req.body)
            const {name, surname, middleName, phone, dateBorn} = req.body
            const userWithThisPhone = await User.findOne({phone_user: phone})
            console.log(userWithThisPhone)
            // console.log(new Date(dateBorn))
            if (!userWithThisPhone) {
                await User.insertMany({
                    name_user: name,
                    surname_user: surname,
                    middle_name_user: middleName,
                    phone_user: phone,
                    date_born_user: dateBorn,
                    date_register_user: Date.now()
                })
                reply.code(200).send('Пользователь зарегистрирован')
            }
            reply.send('данный номер уже используется')
        }
        reply.send('Пользователь уже вошёл в аккаунт')
    }
}
const loginPostOpts = {
    handler: async (req, reply) => {
        if (!req.session.authenticated) {
            const {phone, code} = req.body
            console.log(phone, code)
            const curUser = await User.findOne({phone_user: phone})
            console.log(curUser)
            if (Number(code) === 1337 && curUser !== null) {
                req.session.authenticated = true
                req.session.user = {
                    id: curUser._id,
                }
                console.log('aqqr', curUser, 'ew', curUser.doc)
                reply.code(200).send({typeValidation: 'access'})
            } else {
                reply.code(200).send({typeValidation: 'wrong'})
            }

        }
    }
}

const loginGetOpts = {
    handler: (req, reply) => {
        console.log(req.session.authenticated)
        if (req.session.authenticated) {
            reply.redirect('/personal')
        } else {
            reply.view('/templates/login.ejs')
        }

    }
}

const logoutGet = {
    handler: (req, reply) => {
        req.session.destroy()
        reply.redirect('/login')
    }
}

const personalGetOpts = {
    handler: async (req, reply) => {
        console.log(req.session.user)
        const userInfo = await User.findOne({_id: req.session.user.id})
        console.log(userInfo)
        // reply.view('/templates/personal.ejs', {userInfo: userInfo})
    }
}
module.exports = function (fastify, opts, next) {
    fastify.post('/api/register', registerOpts)
    fastify.post('/login', loginPostOpts)
    fastify.get('/login', loginGetOpts)
    fastify.get('/personal', personalGetOpts)
    fastify.get('/api/logout', logoutGet)
    next()
}
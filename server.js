const path = require('node:path')
const mongoose = require('mongoose')
const fastify = require('fastify')({logger: true})

fastify.register(require('@fastify/view'), {
    engine: {
        ejs: require('ejs')
    }
})

fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, 'static'),
    prefix: '/'
})

fastify.register(require('@fastify/cookie'))
fastify.register(require('@fastify/session'), {
    cookieName: 'sessionId',
    secret: 'secret key with min length of 32 characters',
    cookie: {
        secure: false,
        originalMaxAge: 1000 * 60 * 60 * 24 * 30
    }
})
fastify.decorate("authenticate", async (req, reply) => {
    if (req.session.authenticated) {
        if (!req.url.include('/personal')) {
            reply.redirect('/personal')
        }
    } else {
        reply.redirect('/login')
    }
})
fastify.register(require('@fastify/autoload'), {
    dir: path.join(__dirname, 'routes'),
})


fastify.addHook('onRequest', (req, reply, done) => {
    if (!req.session.authenticated && req.url.includes('/personal')) {
        reply.redirect('/login')
    } else if (req.session.authenticated && (req.url.includes('/login') || req.url.includes('/register'))) {
        reply.redirect('/personal')
    }
    done()
})
const start = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/tobacco_shop_db', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.info('db connected')
        await fastify.listen({port: 3000})
    } catch (err) {
        console.error(err)
    }
}

start()
    .catch(err => console.error(err))
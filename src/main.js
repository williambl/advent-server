import express from 'express'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import UserManager from './usermanager.js'

const app = express()
const port = process.env.PORT || 3000

const users = fs.existsSync("./data.json") ? new UserManager(JSON.parse(fs.readFileSync("./data.json"))) : new UserManager()

const challengeAnswers = process.env.ANSWERS.split(';')

const isAuthed = (req) => req.cookies != undefined && req.cookies['auth'] != undefined

app.use(express.json());
app.use(cookieParser())
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://advent.artemisvioletta.co.uk")
    next()
})
app.use(compression())

app.get('/api/challengesCompleted', (req, res) => {
    if (!isAuthed(req)) {
        res.status(401)
        res.end()
        return
    }
    res.status(200)
    res.end(JSON.stringify(users.getCompleted(req.cookies['auth'])))
})

app.post('/api/check/:id', (req, res) => {
    if (!isAuthed(req)) {
        res.status(401)
        res.end()
        return
    }

    if (req.params.id > challengeAnswers.length) {
        res.status(400)
        res.end()
    }

    res.status(200)
    if (req.body.answer === challengeAnswers[req.params.id]) {
        users.addCompleted(req.cookies['auth'], req.params.id)
        res.end(JSON.stringify({value: true}))
        return
    }
    res.end(JSON.stringify({value: false}))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


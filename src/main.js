import express from 'express'
import compression from 'compression'
import { downloadData } from './aws.js'
import UserManager from './usermanager.js'

const app = express()
const port = process.env.PORT || 3000

var users = undefined

downloadData((err, data) => users = err ? new UserManager() : new UserManager(JSON.parse(data.Body.toString('utf8'))))

const challengeAnswers = process.env.ANSWERS.split(';')

const isAuthed = (req) => req.header("X-Auth") != undefined

app.use(express.json());
app.use((_, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://advent.artemisvioletta.co.uk")
    res.header("Access-Control-Allow-Headers", "X-Auth, Content-Type")
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
    res.end(JSON.stringify(users.getCompleted(req.header("X-Auth"))))
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
    if (req.body.answer.toString() === challengeAnswers[req.params.id]) {
        users.addCompleted(req.header("X-Auth"), parseInt(req.params.id))
        res.end(JSON.stringify({value: true}))
        return
    }
    res.end(JSON.stringify({value: false}))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


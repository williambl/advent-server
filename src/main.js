import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

const users = []

const userScoreMap = new Map()

const challengeAnswers = process.env.ANSWERS.split(';')

const checkUser = (user) => {
    if (users.includes(user))
        return true
    users.push(user)
    userScoreMap.set(user, new Set())
    return false
}

app.use(express.json());
app.use(cookieParser())

app.get('/api/challengesCompleted', (req, res) => {
    if (req.cookies == undefined || req.cookies['auth'] == undefined) {
        res.status(401)
        res.end()
        return
    }
    checkUser(req.cookies['auth'])
    res.status(200)
    res.end(JSON.stringify(Array.from(userScoreMap.get(req.cookies['auth']))))
})

app.post('/api/check/:id', (req, res) => {
    if (req.params.id > challengeAnswers.length) {
        res.status(400)
        res.end()
    }
    res.status(200)
    if (req.body.answer === challengeAnswers[req.params.id]) {
        checkUser(req.cookies['auth'])
        userScoreMap.get(req.cookies['auth']).add(req.params.id)
        res.end(JSON.stringify({value: true}))
        return
    }
    res.end(JSON.stringify({value: false}))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


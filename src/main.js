import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
const port = 3000

const users = []

const userScoreMap = new Map()

const checkUser = (user) => {
    if (users.includes(user))
        return true
    users.push(user)
    userScoreMap.set(user, [])
    return false
}

app.use(cookieParser())

app.get('/api/challengesCompleted', (req, res) => {
    if (req.cookies == undefined || req.cookies['auth'] == undefined) {
        res.status = 401
        res.end()
        return
    }
    checkUser(req.cookies['auth'])
    res.status = 200
    res.end(JSON.stringify(userScoreMap.get(req.cookies['auth'])))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})


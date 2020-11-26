import fs from 'fs'

export default class UserManager {
    constructor(json) {
        if (json === undefined) {
            json = {
                users: [],
                userToScore: []
            }
        }
        this.users = json.users
        this.userToScore = new Map()
        
        json.userToScore.forEach(entry => {
            this.userToScore.set(entry.key, new Set(entry.value))
        })
    }

    checkUser(user) {
        if (this.users.includes(user))
            return true
        this.users.push(user)
        this.userToScore.set(user, new Set())
        this.write()
        return false
    }

    getCompleted(user) {
        this.checkUser(user)
        return Array.from(this.userToScore.get(user))
    }

    addCompleted(user, id) {
        this.checkUser(user)
        this.userToScore.get(user).add(id)
        this.write()
    }

    write() {
        const mapEntryToObject = (entry) => {
            return {
                key: entry[0],
                value: Array.from(entry[1])
            }
        }

        fs.writeFile(
            "./data.json",
            JSON.stringify({
                users: this.users,
                userToScore: Array.from(this.userToScore.entries(), mapEntryToObject)
            }),
            (err) =>
            console.log(err ? err : "written user data to data.json.")
        )
    }
}

export default class UserManager {
    constructor() {
        this.users = []
        this.userToScore = new Map()
    }

    checkUser(user) {
        if (this.users.includes(user))
            return true
        this.users.push(user)
        this.userToScore.set(user, new Set())
        return false
    }

    getCompleted(user) {
        this.checkUser(user)
        return Array.from(this.userToScore.get(user))
    }

    addCompleted(user, id) {
        this.checkUser(user)
        this.userToScore.get(user).add(id)
    }
}

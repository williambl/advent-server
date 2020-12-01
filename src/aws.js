import AWS from 'aws-sdk'

const bucket = new AWS.S3({
    accessKeyId: process.env.S3_KEY_ID,
    secretAccessKey: process.env.S3_ACCESS_KEY
})

export function uploadData(data) {
    const params = {Bucket: 'advent-2020', Key: 'userdata.json', Body: data};
    bucket.upload(params, (err, data) => {
        console.log(err, data)
    })
}

export function downloadData(callback) {
    const params = {Bucket: 'advent-2020', Key: 'userdata.json'};
    bucket.getObject(params, (err, data) => {
        console.log(err, data)
            callback(err, data)
    })
}


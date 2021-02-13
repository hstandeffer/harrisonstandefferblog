---
title: Uploading Files in Javascript
date: "2020-11-19T00:00:00Z"
excerpt: "Quickly upload files to an S3 bucket with React, Node and Express using the Multer file upload middleware"
description: Upload files in Javascript using Multer
tags: ['aws', 'react', 'express']
---

### Introduction

I recently deployed a side project with Heroku, but needed a way to store file uploads, since Heroku servers boot with a clean filesystem each deploy. I chose to use an AWS S3 bucket to host the static assets, so we'll focus on how to upload to your own bucket using a middleware called Multer.

I won't go into too much detail on how to create and configure an AWS S3 bucket, as there are many great guides out there, as well as the [Amazon official docs guide](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-bucket.html). You will also need to create an AWS IAM user and give it S3 permissions. The easiest method (okay for prototyping) is to go to the AWS IAM dashboard, add a new user, and click "attach existing policies directly", then search for "AmazonS3FullAccess" and attach it directly to the user.

### Create a Node App

Open a new folder for the project and create a new node application using `npm init`. Go through the prompts on the console and you will have a package.json file generated with the settings you chose in the previous step. Next, let's change the scripts in the file to include a "start" script to run the index.js file we will soon create.
```json
{
  // ...
  "scripts": {
    "start": "node index.js", //highlight-line 
  },
  // ...
}
```
<br />

We'll be using Express.js as it is the most common web framework for Node.js, and will also go ahead and download the other framework dependencies as well:
```shell
npm install express aws-sdk body-parser multer multer-s3 dotenv
```
<br />

- **AWS SDK**: the official AWS SDK for Node.js backends
- **Multer**: Node.js middleware for handling file uploads
- **Multer S3**: Integration for Multer to directly upload to S3 bucket
- **Body Parser**: parses incoming requests bodies into a property available on the request object
- **Dotenv**: allows you to store protected environment variables

### Create Server to Handle File Uploads

First, we'll start by requiring the dependencies at the top of the index.js file:
```javascript
const express = require('express')
const bodyParser = require('body-parser')
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3')
require('dotenv').config()
```
<br />

Next, create a '.env' file and store your AWS secret key and access key under a variable to use in the server. We'll then update the aws config to include these as well as the region. We'll also instantiate the Express and S3 variables and setup the body parser middleware.
```javascript
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: 'us-east-1'
})

const app = express()
const s3 = new aws.S3()

app.use(bodyParser.json())
```
<br />

Now, we'll define the multer storage object, as per the [multer-s3 docs](https://www.npmjs.com/package/multer-s3):
```javascript
const upload = multer({
  storage: multerS3({
      s3: s3,
      acl: 'public-read',
      bucket: 'YOUR-BUCKET-NAME',
      key: function (req, file, cb) {
          let newFileName = Date.now() + '-' + file.originalname
          let fullPath = newFileName
          cb(null, fullPath)
      }
  })
})
```
<br />

Most of this code can be found on the multer-s3 docs, which cover basic configuration for uploading as well as defining all of the other variables passed into the request. I made a few changes to create a unique file name for each object uploaded to the bucket as well as defined public read access for the file. These settings can be changed depending on how you want to allow access to uploaded objects. 

The last things we need to do on the server is to define the routes for the file upload, and then we'll take a look at a basic React form and event handler to pass the data correctly to the backend.

```javascript
app.post('/upload', upload.single('avatar'), (req, res, next) => {
  // upload other data to database etc.  
  res.send("File has been uploaded successfully")
})

app.listen(3001, () => {
    console.log('App listening on port 3001!')
})
```

### Frontend React Form

We'll go with the basic example of a user uploading some basic info as well as an avatar image to show how to include other text fields in the request as well.

```jsx
import React, { useState } from 'react'
import axios from 'axios'

const ImageUpload = () => {
  const [avatar, setAvatar] = useState()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  
  const handleSubmit = async event => {
    event.preventDefault() // prevent form from default submission causing reload
    const data = new FormData() // creates a new form data object to pass both text and file data into

    // append the data from the state to the object
    data.append('avatar', image)
    data.append('firstName', firstName)
    data.append('lastName', lastName)

    await axios.post('/upload', data) // upload the image and pass the form data to the backend

    // clear the data fields
    setAvatar('') 
    setFirstName('')
    setLastName('')

    return (
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="firstName" value={firstName} onChange={({ target }) => setFirstName(target.value)} />
        <input name="lastName" value={lastName} onChange={({ target }) => setLastName(target.value)} />
        <input type="file" name="avatar" onChange={({ target }) => setAvatar(target.files[0]))} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}
```
<br />

Be sure to include `encType="multipart/form-data"` into the form to ensure the data is passed correctly to the backend. Creating the FormData object seemed to be the most intuitive solution I could find to accomplish passing in other data to the request alongside the image upload.

You should now be able to select and upload a file and if everything goes as planned, the uploaded file should appear in your S3 bucket. The most common error will likely involve your S3 bucket policy. This will change depending on your use case, but as I am mostly using it to serve and upload images, I removed the "Block all public access" configuration from my S3 bucket.

### Conclusion

The multer middleware makes it easy to upload data to your own Express backend, and the multer-s3 extension of it drastically simplifies the process of uploading files directly to your own bucket.

Hopefully this will get you started if you need to host static assets separately on your next web project.

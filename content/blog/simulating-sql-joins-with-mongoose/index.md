---
title: Referencing Documents in Other Collections with Mongoose
date: "2020-06-26T00:00:00Z"
description: "How to simulate a SQL-like 'JOIN' in NoSQL databases with Mongoose's 'populate' method"
tags: ['mongoose', 'react', 'express']
---

If you're used to traditional SQL database engines like MySQL, you will surely have come across the **JOIN** keyword, which allows you to combine data from multiple tables. However, with NoSQL databases like MongoDB, joins are not an option, since they are, by definition, not relational.

MongoDB does, however, have a similar "join-like" functionality through the usage of the `$lookup` operator, but in this post, we'll look at a more intuitive way to "join" data from different collections using Mongoose, a Node.js module for MongoDB. 

We'll demonstrate this through an example of a user on a blogging platform who can create many blog posts. 

### Defining the Mongoose Models

Let's assume you have two Mongoose models, a Blog model:
```javascript
const mongoose = require('mongoose')
const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
})

module.exports = mongoose.model('Blog', blogSchema)
```
<br />

... and a User model:
```javascript
const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
})

module.exports = mongoose.model('User', userSchema)
```
<br />

After defining the Mongoose collection models, we'll move onto defining the API route handlers, using Express.

### Defining the Express Routers

We first create an Express router, which allows us to define API routes to handle requests at each endpoint. We'll go ahead and define example GET and POST route handlers. For the blogs:
```javascript
const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
  })

  const savedBlog = await blog.save()

  response.json(savedBlog.toJSON())
})

module.exports = blogRouter
```
<br />

... And for the users:
```javascript
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  // find all users but hide password 
  const users = await User.find({}).select('-passwordHash')

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const body = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  // creating new user object
  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash: passwordHash
  })

  const savedUser = await user.save()

  return response.json(savedUser)
)}

module.exports = userRouter
```
<br />

It's worth nothing we used the [bcrypt library](https://www.npmjs.com/package/bcrypt) to hash the password, as storing a password in plain text is never a good idea. We won't get into more of byrypt, since it could easily be a separate post of its own. Both routers are also exported so they can be brought into the main Express app file so the API can handle different URL addresses.

After doing this, you can access your users API endpoint by navigating to the URL (e.g. example.com/api/users) where they will be returned in JSON format. You would see results similar to this:
```json
[
  {
    "username": "jdoe",
    "name": "John Doe",
    "id": "5edc29c141857a3a0c3577ae"
  },
  {
    "username": "jdoe2",
    "name": "Jane Doe",
    "id": "5edc29c141857a3a0c3577af"
  }
]
```

### Populating the Blog Object

The route is working as expected, but we'd ideally like to see information about each of the user's blogs as well, so we can get all of a user's information in one request. To do this, we will add a reference to the blog model to our userSchema:
```javascript
const userSchema = mongoose.Schema({
  // ...
  passwordHash: String,
  blogs: [ // highlight-line
    { // highlight-line
      type: mongoose.Schema.Types.ObjectId, // highlight-line
      ref: 'Blog' // highlight-line
    } // highlight-line
  ] // highlight-line
  // ..
})
```
<br />

... We also add a reference to the user model to our blogSchema:
```javascript
const blogSchema = mongoose.Schema({
    // ...  
    url: String,
    user: { // highlight-line
      type: mongoose.Schema.Types.ObjectId, // highlight-line
      ref: 'User' // highlight-line
    }
  // ...
})

```
<br />


Now we are able to add a new blog post onto our user object whenever a new post is created. This will be handled by adding the following code to the blogRouter's post request we defined earlier:
```javascript
const User = require('../models/user') // highlight-line

blogRouter.post('/', async (request, response) => {
  const body = request.body

  // assume user ID is passed in body from frontend for simplicity
  const user = await User.findById(body.userId) // highlight-line

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    user: user._id // highlight-line
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog) // highlight-line
  await user.save() // highlight-line

  response.json(savedBlog.toJSON())
})
```
<br />

Here, we first import the User model then extract the user's ID from the body of the request. Using Mongoose's findById method, we find the user who created the blog and add that user's ID to the new blog object to create a reference back to the user. Just like before, we then save the blog object, but this time we use the JavaScript [concat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat) method to also add the newly-created blog object to the user object before finally saving the updated user.

Now, **finally** we can make the last addition to the userRouter to populate the blogs of each user:
```javascript
usersRouter.get('/', async (request, response) => {
  // find all users but hide password
  const users = await User.find({}).select('-passwordHash')
    .populate('blogs') // highlight-line
  response.json(users)
})
```
<br />

Since we earlier defined the refs in our Mongoose models, we can now use Mongoose's [**populate**](https://mongoosejs.com/docs/populate.html) method, to load the details of each blog post per user. By passing the string "*blogs*", we tell Mongoose that we want it to look for the object with the name *blogs* and then populate it with data from the Blog model.

Now, the JSON data returned at the /api/users endpoint also returns all of the blog data for each user and is populated and displayed all in one request:
```json
[
  {
    "username": "jdoe",
    "name": "John Doe",
    "id": "5edc29c141857a3a0c3577ae",
    "blogs": [
      {
        "title":"John's first blog post",
        "author":"John",
        "url":"example.com/jdoe/posts/1",
        "user":"5edc29c141857a3a0c3577ae",
        "id":"5edc29c241857a3a0c3577dd"
      },
      {
        "title":"John's second blog post",
        "author":"John",
        "url":"example.com/jdoe/posts/2",
        "user":"5edc29c141857a3a0c3577ae",
        "id":"5edc29c241857a3a0c3577de"
      },
    ]
  },
  {
    "username": "jdoe2",
    "name": "Jane Doe",
    "id": "5edc29c141857a3a0c3577af",
    "blogs": [
      {
        "title":"Jane's second blog post",
        "author":"Jane",
        "url":"example.com/jdoe2/posts/1",
        "user":"5edc29c141857a3a0c3577af",
        "id":"5edc29c241857a3a0c3577ee"
      },
    ]
  }
]
```
<br />

It's important to understand how the Mongoose populate method actually works. From the documentation: "Population is the process of automatically replacing the specified paths in the document with document(s) from other collection(s)." 

In our scenario, when we previously concatenated the blog object to the user, only the blog ID is actually saved to the user collection. The populate method then handles returning the actual blog data based on the ID we have saved. For example, here's what the /api/users endpoint would return **\*without\*** adding the populate method to the userRouter:
```json
[
  {
    "username": "jdoe",
    "name": "John Doe",
    "id": "5edc29c141857a3a0c3577ae",
    "blogs": [
      "5edc29c241857a3a0c3577dd",
      "5edc29c241857a3a0c3577de"
    ]
  },
  {
    "username": "jdoe2",
    "name": "Jane Doe",
    "id": "5edc29c141857a3a0c3577af",
    "blogs": [
      "5edc29c241857a3a0c3577ee"
    ]
  }
]
```

### Conclusion
This post should have given you a good introduction on how to effectively "join" two MongoDB collections into returning one result set using Express.js and Node.js with Mongoose.

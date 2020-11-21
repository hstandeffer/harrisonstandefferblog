---
title: How to Use Async Await with React's useEffect Hook
date: "2020-11-21T20:43:27"
description: "Make API calls or perform other asynchronous actions inside the React useEffect hook"
tags: ['react']
---

### Introduction

Lately in React I've shifted to using [async await](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Async_await) for writing asynchronous code. In my opinion, the syntax is much easier to read than the [promise.then](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) chaining format and is more intuitive to write. In this example, we'll take a look at how to use this syntax in React's [useEffect hook](https://reactjs.org/docs/hooks-effect.html).

### The Code

Often in React, you'll make API calls when the component mounts in the useEffect hook. Here's how it'd look using the promise.then notation:

```jsx
useEffect(() => {
  axios.get('/api/users')
    .then(response => {
      setUsers(response.data)
    })
}, [])
```

<br />

So, you make the GET request, and once it resolves **then** you can continue and set the users. Now, if you were to adjust this hook to use async await like any other function, you may first try this:

```jsx
useEffect(async () => {
  const usersObject = await axios.get('/api/users')
  setUsers(usersObject)
}, [])
```

<br />

I think this code reads a whole lot better than the first example shown: you pause execution of the code until the promise is resolved, and then assign it to the usersObject, before finally setting the users state. **However**, there's one problem: React will throw an error in your console saying: 

*"It looks like you wrote useEffect(async () => ...) or returned a Promise. Instead, write the async function inside your effect and call it immediately"*

It suggests simply creating an asynchronous function and then calling it right after its declaration. So the previous example would instead look like this:

```jsx
useEffect(() => {
const fetchUsers = async () => {
  const usersObject = await axios.get('/api/users')
  setUsers(usersObject)
}
fetchData() //highlight-line
}, [])
```
<br />

While it may seem strange to define a function and also call it in the hook, it's still intuitive enough, and allows me to be consistent in using async await throughout my entire application.

<br />
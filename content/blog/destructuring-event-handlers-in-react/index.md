---
title: Simplifying Input Event Handlers in React
date: "2020-07-17T00:00:00Z"
description: "Learn how to dynamically handle multiple input events with much cleaner, easy-to-read syntax using functional React components"
tags: ['react']
---

While there's certainly still support for class components with React, most people are starting to exclusively use functional components and with [React hooks](https://reactjs.org/docs/hooks-intro.html), justification for using class components is diminishing. Despite this, certain React principles may still feel more natural and practical if you're used to class components.

In this post, we'll look at a few different ways to simplify your event handlers in both class and functional components.

### Class Component Implementation

Let's look at a specific example where we would have a form for users to log in and to their account:

```javascript
import React from 'react'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      password: ''
    }
  }

  render() {
    return (
      <form>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.handleEmailChange}
        />
        <input
          type="password"
          name="password"
          value={this.state.password}
          onChange={this.handlePasswordChange}
        />
      </form>
    )
  }
}
```
<br/>

We create the class by adding the constructor, where we also instantiate the state object ("this.state"), in our case simply each variable being set to empty strings. For each input, we have defined an onChange method, where we will later define our event handlers whenever the input value changes.

The first logical way of handling this would be to make multiple event handlers for each input:

```javascript
class Login extends React.Component {
  constructor(props) {
    // ...
  }

  handleEmailChange = (event) => {
    this.setState({ email: event.target.value })
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  render() {
    // ...
  }
```
<br/>

This works fine, but is obviously repetitive, and if you were to need more than two inputs, would be tiresome to continue adding new methods. Each event handler is **basically** doing the same thing, right? They simply accept the event object that triggered the onChange method from the input, and then set their corresponding state value to whatever their input value is. 

This can be greatly simplified by using only one event handler that can handle all of the input onChange methods. A very handy way of accomplishing this would look something like the following:

```javascript
handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value })
}
```
<br/>

... and each input would simply call the same method:

```javascript
render() {
  return (
    <form>
      <input type="text"
        name="email"
        value={this.state.email}
        onChange={this.handleChange}
      />
      <input
        type="password"
        name="password"
        value={this.state.password}
        onChange={this.handleChange}
      />
    </form>
  )
}
```
<br/>

If you examine the inputs, you'll see that their "name" value matches the key's name in the initial state component we earlier defined in the constructor. In doing this, we are able to dynamically handle input changes to multiple different input elements, through the use of the square brackets around "event.target.name". If you were to type "johndoe@gmail.com" into the input with the "name" value of "email", the onChange handler that we define would get the following values passed to it:

```javascript
handleChange = (event) => {
  this.setState({ ["email"]: "johndoe@gmail.com" })
}
```
<br/>

In doing this, the event handler can simply read the "name" value of the current input and will set the state dynamically based off of this value for each input.

So this new method only requires one event handler and that's great, but what if you're using a functional component?

### Functional Component Implementation

Its equivalent method for handling state is the [useState hook](https://reactjs.org/docs/hooks-state.html). We'll start out by converting our class component to a functional component with the useState hook instead to handle state and again handling this in the most logical way first:

```javascript
import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  return (
    <form>
      <input
        type="text"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        value={password}
        onChange={handlePasswordChange}
      />
    </form>
  )
}
```
<br/>

You'll notice it's already been simplified greatly from our first implementation of the class components, and even the event handlers look a whole lot better, but we can still make some improvements. As before, we still have two separate event handlers for each different input, and while with two inputs it's not the worst thing ever, there is a way we can create more succint syntax with functional components by destructuring the event method within the onChange handler:
```javascript
// ...
<form>
  <input
    type="text"
    value={email}
    onChange={({ target }) => setEmail(target.value)}
  />
  <input
    type="password"
    value={password}
    onChange={({ target }) => setPassword(target.value)}
  />
</form>
// ...
```
<br/>

Now, each onChange method takes in the event method, but uses [destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) to unpack the "target" property from the event object, and then setting the email or password to the target's value.

### Conclusion
Hopefully this served as a good starting point on how to better handle input events with functional components and helped you better understand how event handlers work in React.
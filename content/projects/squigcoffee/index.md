---
title: Squig Coffee
date: "2021-04-20T20:43:27"
description: "Discover new coffees with ease"
programming: "2020 - React, Node/Express, MongoDB, Cypress" 
template: "project"
---

### Introduction
For years, I've enjoyed going to coffee shops and trying different coffees from around the world. When quarantine started, going to coffee shops for a while was out of the question and my desire to build something to make finding new coffees simple and easy became more and more pressing.

I couldn't find a place to easily view and compare all of the distinctive characteristics of coffee in one place. Many sites like Amazon of course sell coffee, but many smaller, lesser-known roasters go unnoticed, so I set out to make this a reality, and created [**Squig Coffee**](https://squigcoffee.com).

### What I Set Out to Build
I wanted to build a site where users could explore and discover new coffees without hopping from one site to another, letting users filter coffees on the following filters:
- roast type
- origin country
- organic
- flavor notes
- price

This would give users who know exactly the type of coffee they like to quickly find similar, but new ones, while comparing prices and linking directly to the roaster's site to purchase. I worked on the project on and off, and learned many valuable things that I later was able to apply to my actual job.

### How I Built It
#### Authentication (JWT)
I originally set out to allow users to add and edit their own coffees, but it turned out to be easier for me to do than having to manually verify the accuracy of every coffee added by users. I used [JSON Web Tokens](https://jwt.io/) to locally persist a reference to the user logged in on the browser, and in each new session check if the user associated with that token was still valid/not expired. This allowed the logged user to be persisted without being logged out each time the user revisits the site.

#### Front end (React)
I was still learning core React principles when the idea to start this project came to mind and wanted to get experience building a full SPA with it. At the time, class components were still more widely used than functional components, but as the project went on I enjoyed making the shift over to functional components and React hooks. For styling, I began using [styled components](https://styled-components.com), but shifted to [Material UI](https://material-ui.com/) and used its CSS-in-JS solution for custom styles.

#### Back end (Node/Express)
I actually started out the project using [Firebase](https://firebase.google.com/), as it can drastically improve development time and removes a lot of headaches like authentication and security. I definitely saw the power and efficiency of it, but as time went on, I realized it was more important to me to learn how to build and secure a web app on my own, so chose Node and Express. Express is great in the fact that it allows high flexibility when determining how to build your application, whereas other frameworks are more opinionated on how you build it. Sometimes flexibility is great, and Express is a great choice, other times you just want to start building your application and don't want to have to worry about things like authentication, so something like Laravel or Rails might be a better option. 

I created endpoints and corresponding controllers for users, coffees, and roasters to handle authentication and basic CRUD operations for an admin account to add, update, and delete coffees/roasters.

#### Database (MongoDB)
I used [MongoDB](https://www.mongodb.com/) and the Mongoose package to store and retrieve data for the users, coffees and roasters. Again, I originally chose Firebase for this, so migrating data wasn't a problem as it was stored in JSON format. Moving to Mongo gave me experience in NoSQL database architecture and the interesting concepts within them that can differ from traditional SQL database architectures.

#### Cypress
[Cypress](https://www.cypress.io/) was used for end-to-end tests between the frontend and backend. This allowed me to fully mock a user's session within the app and ensure all of the correct fields were present and that the data upload and fetching was working properly and showing accurate data.

#### AWS S3/Cloudfront
AWS S3 is used to store and host the static content for the site, primarily images of the coffees/roasters. This data is routed through Cloudfront to optimize the speed at which it's delivered to the end user and to prevent subsequent requests for the same data directly from the S3 bucket.

#### Hosting/Automatic Deployment (Digital Ocean/Git)
I originally chose to host the site on Heroku, but again wanted to be in control of and learn more about the entire full stack web development process, so I created a $5 Digital Ocean droplet and setup a basic Ubuntu server, setup a firewall, removed password access, etc. 

On my server, I created a bare Git repository that would have a post-receive hook that passes the pushed files into the project's actual folder, and then runs all of the necessary steps (installing packages, run the build script, and restart the systemctl service). This allowed me to simply push the code to the remote origin on my server, and the site would be rebuilt and restarted automatically.

### Conclusion
Overall, I'm glad I created this project and learned many valuable web development skills throughout the process. My biggest takeaways from building this was to find something you're passionate about and just start building it. I spent way too many hours early in the project deciding what libraries and frameworks to use rather than simply moving forward. I am happy with the changes I made from Firebase/Heroku to my own Express implementation and hosting it on my own Digital Ocean server instead.
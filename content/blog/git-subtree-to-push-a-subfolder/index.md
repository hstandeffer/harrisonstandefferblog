---
title: Using git subtree to Push a Subfolder to Heroku
date: "2021-02-20T20:43:27"
description: "A simple way to push a specific folder when Git is initialized in the parent folder"
tags: ['git']
template: "post"
---

### Introduction

I have a project where the folder structure has the client and server folders all under one main folder, like the following:

```shell
- project
	- .git
	- .gitignore
	- client
		- src
			- components
		- other stuff
	- server
		- index.js
		- controllers
			- users.js
		- models
		- other stuff
```
<br/>

There are surely many different ways to go about deploying a full stack project with this file structure, but what I’ve leaned towards is using [git subtree](https://www.atlassian.com/git/tutorials/git-subtree). This git command allows you to push a subfolder like you would a normal git repository to a separate repository or git remote.

This is handy in our example, because git is tracking changes throughout the entire project root, but we just want to deploy the 'server' folder's code with the bundled frontend files added. Here's the command I use (and run from the root repository):

```shell
git subtree push --prefix server heroku master
```
</br>

And the explanation of each part of the command:
```shell
git subtree push --prefix {folder to push} {remote repo} {remote branch}
```
<br/>

[*commands adapted from this article on git subtree*](https://newfivefour.com/git-subtree-basics.html)

### Conclusion

There are other use cases (and problems) with git subtree, but this is a simple way to push changes to a Heroku repository while keeping the codebase under one root folder.


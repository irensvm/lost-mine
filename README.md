# lost-mine
# Developer: 
Irene Villanueva
# Link to App: 
https://xxxxxx.herokuapp.com/

* use in mode mobile device at browser


## Description
An app that allows you to have control over the books that are lent and borrowed, through the creation of a book exchange network. 

## User Stories
- **404** - As a user I want to see a nice 404 page when I go to a page that doesn't exist so that I know it was my fault 
- **500** - As a user I want to see a nice error page when something is down and i canoot use the app for a while
- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about + login + signup
- **sign up** - As a user I want to sign up on the webpage 
- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account
- **logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account
- **books list** - As a user I want to see all the books I borrowed (library)
- **books create** - As a user I want I want create a book and add the details (i have it or i borrow to somene).
- **borrowed books details** - As a user I want to see the book detail: who has it? since when?
- **book come back** - As a user I want to be able to request one of my books back
- **ask for a book** - As a user I want to be able to borrow a book from my colleagues' library
- **my network** - As a user I want to see which who they are so I can explore what books i could borrow from their library.
- **add a user to a network** - As a user I want to be able to add a friend to my network
- **leave a network** - As a user I want to be able to leave a network
  

## Backlog

List of other features outside of the MVPs scope

Notifications
- send an email throw the app(mailchimp?)




## ROUTES:

|Method|URL|Description|
|---|---|---|
GET | /auth/login | redirects to / if user logged in. Renders auth/login
POST | /auth/login | redirects to / if user logged in
POST | /auth/logout | redirects to / 
POST | /auth/signup | redirects to /profile
GET | myprofile | redirects to /profile
GET | /allusers | redirects to /listofusers  NON PROTECTED ROUTE
GET | /userprofile | redirects to /user/profile
POST | /userprofile/add |  PROTECTED ROUTE
GET | /mynetwork | 
GET | /library | get all books and their status
POST | /library/addbook | redirects to /addbook if user logged in
PUT | /library/editbook | redirects to /editbook if user logged in


# Models

User model
- username: String
- password: String
- image: String
- fav genres: enum
- books: Array
```
```
Book model
- title: String
- description: String
- author: String
- genre: enum
- Rating: Number
- borrowed: Boolean
- For lean: Boolean
```
```
Network model
- network-users: Object ID
- 

```
```
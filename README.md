# o-memo

> - Maintained by: `Heegu Park`

## Functionality Overview
1. A client receives the data from a server and dynamically display the data in HTML format
    - to view the memos
    - to create a memo, update a memo, delete a post
    - to drag a memo to other place
    - to change the background color and text color separately
    - to view all activities of o-pin's memos in real time
2. A server receives the data from the client
    - to create a memo, to update a memo, to delete a memo
    - to view memos in real time
3. Heavily used React to create all HTML elements(virtual DOM) to dynamically display all data using DOM upon the data from MongoDB database via API server created by using Node.js
4. Used Express to run the API server
5. Used mongo and mongoose module to connect MongoDB database
6. Used AWS EC2 for web and API server and MongoDB cloud for MongoDB database
7. Used socket.io to broadcast all memos in real time
8. Used React Router to route new memo board(first connect to generate the url) and existing memo boards
9. Support most of mobile devices(iPad - Landsacpe/Portrait, iPhone X - Landsacpe/Portrait, iPhone 6s/7s/8s - Landsacpe/Portrait, iPhone 6/7/8 - Landsacpe/Portrait, and so on)

## Planned Features
1. User can view memos.
2. User can view the detail of a memo.
3. User can create a memo.
5. User can update a memo.
6. User can delete a memo .
7. User can share the unique url with others.

## Lessons Learned
1. Various ways of dynamically displaying data using React virtual DOM functions
2. Experienced to deal with various functions of React virtual DOM
3. Experienced to effectively use React, Bootstrap, and Material UI for displaying data
4. React and JavaScript Object Oriented Programming for better functionalities and to increase the re-usage of codes
5. Experienced to create API server using node.js to process the data with communicating with database and pass the data to client
6. Experienced to create MongoDB database to store and retrieve data upon the request of a client via API server
7. Experienced to use Material UI to make the application more professionally
8. Experienced to use socket.io to broadcast all memos from other users in real time
9. Experienced to use React Router to route different memo boards
10. Experienced to deploy the web and API server into AWS EC2 and create MongoDB database instance into MongoDB cloud

## Live Site
* You can see and test the live version here: <a href="https://memo.heegu.net" target="blank">memo.heegu.net</a>

## Sample Memo
* You can see and test the live version here: <a href="https://memo.heegu.net/sample" target="blank">Sample Memo</a>

## Screen shot
[Desktop]

![Omega Memo](https://github.com/heegupark/omega-memo/blob/master/memo-ss-001.gif)

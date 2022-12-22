---ROOT---
npm init -y
(add .gitignore) 
npm i express
npm i -D nodemon ("start": "nodemon main.js")
npm i ejs
npm i mongodb
npm i bcryptjs
npm i csurf
npm i express-session connect-mongodb-session
npm i multer
npm i uuid

db.users.updateOne({_id: ObjectId("639c9112b62745472e642957")}, {$set: {isAdmin: true} })
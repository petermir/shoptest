const express = require('express');
const path = require('path');
const csrf = require('csurf');
const expressSession = require("express-session");

const createSessionConfig = require('./config/session')
const db = require('./data/database');
// --------- Middlewares ----------
const addCsrfToken = require('./middlewares/csrf-token');
const errorhandler = require('./middlewares/error-handler');
const checkAuthStatus = require('./middlewares/check-auth')
const protectRoutes = require('./middlewares/protect-routes')
const cart = require('./middlewares/cart')
const updateCart = require('./middlewares/update-cart-prices')
const notFound = require('./middlewares/not-found')

const authRoutes = require('./routes/auth-routes');
const productRoutes = require('./routes/products-routes')
const baseRoutes = require('./routes/base-routes')
const adminRoutes = require('./routes/admin-routes')
const cartRoutes = require('./routes/cart-routes')
const ordersRoutes = require('./routes/orders-routes')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data'));

// Handling data
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const sessionConfig = createSessionConfig()

app.use(expressSession(sessionConfig))
app.use(csrf());
app.use(addCsrfToken);
app.use(checkAuthStatus)

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(cart)
app.use(updateCart)
app.use('/cart', cartRoutes)
app.use('/orders',protectRoutes, ordersRoutes)
app.use('/admin',protectRoutes, adminRoutes)

app.use(notFound)

app.use(errorhandler);

let PORT = 5000;
if (process.env.PORT) {
  PORT = process.env.PORT
}

db.connectToDatabase()
  .then(function () {
    app.listen(PORT);
    console.log('connected');
  })
  .catch(function (error) {
    console.log('failed to conn');
    console.log(error);
  });

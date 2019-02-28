const express = require('express');
const app = express();
const bodyParser = module.require('body-parser');
const router = express.Router();

// Controllers
const webRoutes = require('./controllers/routes/web');

//Configuration
var port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use('/', webRoutes);
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.listen(port, () => {
    console.log(`[${Date.now()}] SERVER RUNNING: ${port}`);
});
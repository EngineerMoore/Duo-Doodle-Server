require("dotenv").config();
const express = require(`express`);


const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json())

app.use(require('morgan')('dev'))

app.get(`/api`, (req, res, next) => {
  res.send(`Welcome to the Duo-Doodle API`);
})

app.use(require(`./auth.js`).router);
 
app.use((req, res, next) => {
  next({status: 404, message: `Endpoint not found`});
})

app.use((e, req, res, next) => {
  console.error(e);
  res
    .status(e.status ?? 500)
    .json(e.message ?? `Something went wrong`);
})

app.listen(PORT, () => {
  console.log(`You are now listening on port ${PORT}`);
})
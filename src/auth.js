const prisma = require ("../prisma/index.js");

const express = require(`express`);
const router = express.Router();

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// jwt.sign creates a token w/ id = payload and JWT_SECRET = key
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {expiresIn: "1d"});
};

router.use( async(req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.slice(7);//"Bearer <token>"
if (!token) return next();

  try{
    const { id } =  jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUniqueOrThrow({ where: { id }, });
    req.user = user;
    next();
  }catch(e) {
    next(e);
  };
});

router.post("/api/signUp", async (req, res, next) => {
  const { username, email, firstName, lastName, password } = req.body;
  
  try{
    const user = await prisma.user.signUp(username, email, firstName, lastName, password);
    const token = createToken(user.id);
    res.status(201).json({ token })
  }catch(e) {
    next(e);
  };
  
});


router.post("/api/login", async (req, res, next) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.login(email, password);
    const token = createToken(user.id);
    res.json({ token });
  } catch(e) {
    next(e);
  };
  
});

const authenticate = (req, res, next) => {
  if (req.user) {
    next ();
  } else {
    next({ status: 401, message: `You must be logged in.`});
  }
}
module.exports = { router, authenticate };
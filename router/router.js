const Router = require("express");
const authController = require("../controllers/authController.js");
const { check } = require("express-validator");
const authMiddleware = require("../middlewares/authMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

const router = new Router();

router.post(
  "/registration",
  [
    check("username", "Username have to be between 3 and 10 characters")
      .notEmpty()
      .isLength({ min: 3, max: 10 }),
    check("password", "Password have to be between 3 and 10 characters")
      .notEmpty()
      .isLength({ min: 3, max: 10 }),
  ],
  authController.registration
);
router.post(
  "/login",
  [
    check("username", "Username have to be between 3 and 10 characters")
      .notEmpty()
      .isLength({ min: 3, max: 10 }),
    check("password", "Password have to be between 3 and 10 characters")
      .notEmpty()
      .isLength({ min: 3, max: 10 }),
  ],
  authController.login
);

router.get("/users", roleMiddleware(["ADMIN"]), authController.getUsers);

module.exports = router;

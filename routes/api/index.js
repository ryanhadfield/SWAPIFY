const router = require("express").Router();
const userRoutes = require("./users");
const itemRoutes = require("./items");
const matchesRoutes = require("./matches")

// User routes
router.use("/users", userRoutes);
router.use("/items", itemRoutes);
router.use("/matches", matchesRoutes)

module.exports = router;

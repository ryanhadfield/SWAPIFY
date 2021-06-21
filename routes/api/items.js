const router = require("express").Router();
const itemsController = require("../../controllers/itemsController");

// Matches with "/api/books"
router.route("/")
  .get(itemsController.findAll)
  .post(itemsController.create);

// Matches with "/api/books/:id"
router
  .route("/:id")
  .get(itemsController.findById)
  .put(itemsController.update)
  .delete(itemsController.remove);

router
  .route("/user/:id")
  .get(itemsController.findByGoogleId)

router.get('search/:name', (req, res) => {
  console.log(res)
})

module.exports = router;

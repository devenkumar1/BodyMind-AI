import { Express } from "express";
import { Router } from "express";
const router= Router();
import { protect } from "../middlewares/auth.middleware";
import { bookTrainer, getAllTrainers } from "../controllers/trainer.controller";

router.get('/allTrainers',getAllTrainers);
router.post('/book',bookTrainer)







export default router;
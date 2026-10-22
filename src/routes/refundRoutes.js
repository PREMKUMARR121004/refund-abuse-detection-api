import { Router } from "express";
import { authMiddleware} from "../middeleware/authMiddleware.js";
import { refundHistory, refundStatus, userRefund } from "../controllers/refundController.js";
import { adminMiddleware } from "../middeleware/adminMiddleware.js";

const router=Router()


router.post('/refund',authMiddleware,userRefund)
router.get('/refundhistory',authMiddleware,refundHistory)
router.patch('/admin/updatestatus/:id',authMiddleware,adminMiddleware,refundStatus)

export default router
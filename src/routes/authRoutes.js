import {Router} from 'express'
import { registerUser, UserLogin } from '../controllers/UserController.js'


const router=Router()
router.post('/register',registerUser)
router.post('/login',UserLogin)

export default router


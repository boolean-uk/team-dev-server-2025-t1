import { Router } from 'express'
import { create, getById, updateById } from '../controllers/profile.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

// Need to validate
router.post('/', validateAuthentication, create)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, updateById)

export default router

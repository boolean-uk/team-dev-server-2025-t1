import { Router } from 'express'
import { create, getById, updateById } from '../controllers/profile.js'
import {
  validateAuthentication,
  getUserIdFromToken
} from '../middleware/auth.js'

const router = Router()

// Need to validate
router.post('/', validateAuthentication, create)
router.get('/:id', validateAuthentication, getById)
router.patch(
  '/:id/edit',
  validateAuthentication,
  getUserIdFromToken,
  updateById
)

export default router

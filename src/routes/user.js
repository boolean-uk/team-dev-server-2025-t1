import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateById,
  getAllByCohortId
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:cohortId', validateAuthentication, getAllByCohortId)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateTeacherRole, updateById)

export default router

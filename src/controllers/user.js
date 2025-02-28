import User from '../domain/user.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const userToCreate = await User.fromJson(req.body)
  try {
    const existingUser = await User.findByEmail(userToCreate.email)
    // eslint-disable-next-line
    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z{1,}])(?=.*[0-9{1,}])(?=.*[!-\/:-@[-`{-~{1,}]).{8,}/
    const emailRegex = /[^@]{1,}[@]{1}[^@]{1,}/

    if (existingUser) {
      return sendDataResponse(res, 400, { email: 'Email already in use' })
    }

    if (!passwordRegex.test(req.body.password)) {
      return sendDataResponse(res, 400, { password: 'Invalid password' })
    }

    if (!emailRegex.test(req.body.email)) {
      return sendDataResponse(res, 400, { email: 'Invalid email' })
    }

    const createdUser = await userToCreate.save()

    return sendDataResponse(res, 201, createdUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new user')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundUser = await User.findById(id)

    if (!foundUser) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundUser)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const getAll = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { first_name: firstName } = req.query

  let foundUsers

  if (firstName) {
    foundUsers = await User.findManyByFirstName(firstName)
  } else {
    foundUsers = await User.findAll()
  }

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const getAllByCohortId = async (req, res) => {
  const cohortId = parseInt(req.params.id)
  const foundUsers = await User.findByCohortId(cohortId)

  const formattedUsers = foundUsers.map((user) => {
    return {
      ...user.toJSON().user
    }
  })

  return sendDataResponse(res, 200, { users: formattedUsers })
}

export const updateById = async (req, res) => {
  // eslint-disable-next-line camelcase
  const { cohortId: cohort_id } = req.body
  const { role } = req.body
  const userId = parseInt(req.params.id)
  const userToUpdate = await User.findById(userId)

  try {
    if (!userToUpdate) {
      return sendDataResponse(res, 400, {
        cohort_id: 'No cohort found',
        role: 'No role found'
      })
    }
    // eslint-disable-next-line camelcase
    userToUpdate.cohortId = cohort_id
    userToUpdate.role = role
    const updatedUser = await userToUpdate.update(userToUpdate)

    return sendDataResponse(res, 201, updatedUser)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to update user')
  }
}

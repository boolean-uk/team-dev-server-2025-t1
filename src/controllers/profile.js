import Profile from '../domain/profile.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const profileToCreate = await Profile.fromJson(req.body)

  try {
    const existingProfileWithUser = await Profile.findByUserId(
      profileToCreate.userId
    )

    if (existingProfileWithUser) {
      return sendDataResponse(res, 400, { email: 'You already have a profile' })
    }

    const createdProfile = await profileToCreate.save()

    return sendDataResponse(res, 201, createdProfile)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new profile')
  }
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const foundProfile = await Profile.findById(id)

    if (!foundProfile) {
      return sendDataResponse(res, 404, { id: 'User not found' })
    }

    return sendDataResponse(res, 200, foundProfile)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get user')
  }
}

export const updateById = async (req, res) => {
  const { user_id: userId } = req.body

  if (!userId) {
    return sendDataResponse(res, 400, { user_id: 'User ID is required' })
  }

  return sendDataResponse(res, 201, { user: { user_id: userId } })
}

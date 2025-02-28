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
      return sendDataResponse(res, 404, { id: 'Profile not found' })
    }

    return sendDataResponse(res, 200, foundProfile)
  } catch (e) {
    return sendMessageResponse(res, 500, 'Unable to get profile')
  }
}

export const updateById = async (req, res) => {
  const currentUserId = req.userId
  const currentUserRole = req.userRole
  const profileToUpdateId = parseInt(req.params.id)
  const { firstName, lastName, bio, githubUrl } = req.body

  const profileToUpdate = await Profile.findById(profileToUpdateId)
  const currentProfileUser = await Profile.findByUserId(currentUserId)
  try {
    if (!profileToUpdate) {
      return sendDataResponse(res, 400, { profile_id: 'No profile was found' })
    } else if (!currentUserId) {
      return sendDataResponse(res, 400, { user_id: 'No user was found' })
    }
    if (
      profileToUpdate.id !== currentProfileUser.id &&
      currentUserRole !== 'TEACHER'
    ) {
      return sendDataResponse(res, 403, {
        profile_id:
          'You are not authorized to update this profile ' +
          currentUserRole +
          ' ' +
          currentProfileUser.id +
          ' ' +
          profileToUpdate.id
      })
    }

    profileToUpdate.firstName = firstName
    profileToUpdate.lastName = lastName
    profileToUpdate.bio = bio
    profileToUpdate.githubUrl = githubUrl
    const updatedProfile = await profileToUpdate.update(profileToUpdate)

    return sendDataResponse(res, 201, updatedProfile)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to update profile' + error)
  }
}

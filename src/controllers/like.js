import Post from '../domain/post'
import User from '../domain/user'
import { sendDataResponse } from '../utils/responses'

export const create = async (req, res) => {
  const { postId, userId } = req.body
  // doesn't work properly for now

  try {
    const user = await User.findById(userId)
    const post = await Post.findById(postId)
    if (!(post && user))
      return sendDataResponse(res, 400, { content: 'Must provide post ID' })
  } catch (error) {
    return sendDataResponse(res, 400, { content: 'Unable to like post' })
  }
}

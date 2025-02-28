import { sendDataResponse } from '../utils/responses'

export const create = async (req, res) => {
  const { postId, userId } = req.body

  try {
    const post = await Post.findById
    if (!(postId && userId))
      return sendDataResponse(res, 400, { content: 'Must provide post ID' })
    
  } catch (error) {}
  }
  
}
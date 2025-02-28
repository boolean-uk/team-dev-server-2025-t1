import Post from '../domain/post.js'
import User from '../domain/user.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const timestamp = new Date()
  const postToCreate = await Post.fromJson({
    ...req.body,
    createdAt: timestamp,
    updatedAt: timestamp
  })

  if (!User.findById(postToCreate.userId))
    return sendDataResponse(res, 400, { content: 'No user with ID' })

  if (!postToCreate.content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  const createdPost = await postToCreate.save()

  return sendDataResponse(res, 201, { post: createdPost })
}

export const getAllByUserId = async (req, res) => {
  const foundPosts = (await Post.findByUserId(req.body)).map((post) => {
    return { ...post.toJson().post }
  })
  return sendDataResponse(res, 200, {
    posts: foundPosts
  })
}

export const getAll = async (req, res) => {
  const foundPosts = (await Post.findAll()).map((post) => {
    return { ...post.toJson().post }
  })
  return sendDataResponse(res, 200, {
    posts: foundPosts
  })
}

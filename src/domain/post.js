import dbClient from '../utils/dbClient.js'
import User from './user.js'

export default class Post {
  static fromDb(post) {
    return new Post(
      post.id,
      post.userId,
      post.content,
      post.createdAt,
      post.updatedAt
    )
  }

  static async fromJson(json) {
    const { userId, content, createdAt, updatedAt } = json
    return new Post(null, userId, content, createdAt, updatedAt)
  }

  constructor(id, userId, content, createdAt, updatedAt) {
    this.id = id
    this.userId = userId
    this.content = content
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  async toJson() {
    const user = await User.findById(this.userId)
    return {
      post: {
        id: this.id,
        userId: this.userId,
        author: { firstName: user.firstName, lastName: user.lastName },
        content: this.content,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
  }

  async save() {
    const data = {
      content: this.content,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    const createdPost = await dbClient.post.create({
      data,
      include: {
        user: true
      }
    })
    return Post.fromDb(createdPost)
  }

  static async findAll() {
    return Post._findMany()
  }

  static async findByUserId(userId) {
    return Post._findMany('userId', userId)
  }

  static async _findMany(key, value) {
    const query = {}

    if (key && value) {
      query.where = {
        [key]: value
      }
    }

    const foundPosts = await dbClient.post.findMany(query)
    return foundPosts.map((p) => Post.fromDb(p))
  }
}

import dbClient from '../utils/dbClient'

export default class Like {
  static fromDb(like) {
    return new Like(
      like.id,
      like.postId,
      like.userId,
      like.createdAt,
      like.updatedAt
    )
  }

  static async fromJson(json) {
    const { postId, userId, createdAt, updatedAt } = json
    return new Like(null, postId, userId, createdAt, updatedAt)
  }

  constructor(id, postId, userId, createdAt, updatedAt) {
    this.id = id
    this.postId = postId
    this.userId = userId
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  toJson() {
    return {
      like: {
        id: this.id,
        postId: this.postId,
        userId: this.userId,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
      }
    }
  }

  async save() {
    const data = {
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    if (this.postId) {
      data.postId = {
        connectOrCreate: {
          id: this.postId
        }
      }
    }

    if (this.userId) {
      data.user = {
        connectOrCreate: {
          id: this.userId
        }
      }
    }

    const createdLike = await dbClient.like.create({
      data,
      include: {
        post: true,
        user: true
      }
    })
    return Like.fromDb(createdLike)
  }

  static async findAll() {
    return Like._findMany()
  }

  static async findByPostId(postId) {
    return Like._findMany('postId', postId)
  }

  static async findByUserId(userId) {
    return Like._findMany('userId', userId)
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        post: true,
        user: true
      }
    }

    if (key && value) {
      query.where = {
        post: {
          [key]: value
        },
        user: {
          [key]: value
        }
      }
    }

    const foundLikes = await dbClient.like.findMany(query)
    return foundLikes.map((like) => Like.fromDb(like))
  }
}

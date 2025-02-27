import dbClient from '../utils/dbClient.js'

export default class Profile {
  static fromDb(profile) {
    return new Profile(
      profile.id,
      profile.userId,
      profile.firstName,
      profile.lastName,
      profile.bio,
      profile.githubUrl
    )
  }

  static async fromJson(json) {
    const { userId, firstName, lastName, bio, githubUrl } = json

    return new Profile(null, userId, firstName, lastName, bio, githubUrl)
  }

  constructor(id, userId, firstName, lastName, bio, githubUrl) {
    this.id = id
    this.userId = userId
    this.firstName = firstName
    this.lastName = lastName
    this.bio = bio
    this.githubUrl = githubUrl
  }

  toJson() {
    return {
      profile: {
        id: this.id,
        user_id: this.userId,
        firstName: this.firstName,
        lastName: this.lastName,
        bio: this.bio,
        githubUrl: this.githubUrl
      }
    }
  }

  async save() {
    const data = {
      firstName: this.firstName,
      lastName: this.lastName,
      bio: this.bio,
      githubUrl: this.githubUrl
    }

    if (this.userId) {
      data.user = {
        connectOrCreate: {
          id: this.userId
        }
      }
    }

    const createdProfile = await dbClient.profile.create({
      data,
      include: {
        user: true
      }
    })
    return Profile.fromDb(createdProfile)
  }

  static async findById(id) {
    return Profile._findByUnique('id', id)
  }

  static async findAll() {
    return Profile._findMany()
  }

  static async findByUserId(userId) {
    return Profile._findByUnique('userId', userId)
  }

  static async _findByUnique(key, value) {
    const foundProfile = await dbClient.profile.findUnique({
      where: {
        [key]: value
      },
      include: {
        user: true
      }
    })

    if (foundProfile) {
      return Profile.fromDb(foundProfile)
    }

    return null
  }

  static async _findMany(key, value) {
    const query = {
      include: {
        user: true
      }
    }

    if (key && value) {
      query.where = {
        user: {
          [key]: value
        }
      }
    }

    const foundProfiles = await dbClient.profile.findMany(query)
    return foundProfiles.map((p) => Profile.fromDb(p))
  }
}

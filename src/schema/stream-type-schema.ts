export const StreamSchema = `
type Stream implements Node {
  language: String
  gameId: String
  id: String
  title: String
  viewers: Int
  thumbnailUrl: String
  userDisplayName: String
  userId: String

  user: User
}
`

export const users = 'users'
export const user = (userID: string) => [users, userID].join('/')
export const userPosts = (userID: string) => [user(userID), 'posts'].join('/')
export const userPost = (userID: string, postID: string) =>
  [userPosts(userID), postID].join('/')
export const likedPosts = (userID: string) =>
  [user(userID), 'likedPosts'].join('/')
export const likedPost = (userID: string, postID: string) =>
  [likedPosts(userID), postID].join('/')
export const likedUsers = (userID: string, postID: string) =>
  [userPost(userID, postID), 'likedUsers'].join('/')
export const likedUser = (
  userID: string,
  postID: string,
  likedUserID: string
) => [likedUsers(userID, postID), likedUserID].join('/')

import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'
import * as Path from './path'
import { User, Post } from './model'

export const postLiked = functions
  .runWith({ memory: '1GB' })
  .firestore.document(Path.likedUser('{userID}', '{postID}', '{likedUserID}'))
  .onCreate((snapshot, context) =>
    admin
      .firestore()
      .doc(Path.userPost(context.params.userID, context.params.postID))
      .update({
        likeCount: admin.firestore.FieldValue.increment(1),
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      } as Partial<Post>)
  )

export const postUnliked = functions
  .runWith({ memory: '1GB' })
  .firestore.document(Path.likedUser('{userID}', '{postID}', '{likedUserID}'))
  .onDelete((snapshot, context) =>
    admin
      .firestore()
      .doc(Path.userPost(context.params.userID, context.params.postID))
      .update({
        likeCount: admin.firestore.FieldValue.increment(-1),
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      } as Partial<Post>)
  )

export const likePost = functions
  .runWith({ memory: '1GB' })
  .firestore.document(Path.likedPost('{userID}', '{likedPostID}'))
  .onCreate((snapshot, context) =>
    admin
      .firestore()
      .doc(Path.user(context.params.userID))
      .update({
        likePostCount: admin.firestore.FieldValue.increment(1),
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      } as Partial<User>)
  )

export const unlikePost = functions
  .runWith({ memory: '1GB' })
  .firestore.document(Path.likedPost('{userID}', '{likedPostID}'))
  .onDelete((snapshot, context) =>
    admin
      .firestore()
      .doc(Path.user(context.params.userID))
      .update({
        likePostCount: admin.firestore.FieldValue.increment(-1),
        updateTime: admin.firestore.FieldValue.serverTimestamp()
      } as Partial<User>)
  )

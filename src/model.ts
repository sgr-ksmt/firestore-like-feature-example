import * as ftest from '@firebase/testing'

type IncrementableNumber = number | ftest.firestore.FieldValue
type ServerTimestamp = ftest.firestore.Timestamp | ftest.firestore.FieldValue

export interface User {
  name: string
  likePostCount: IncrementableNumber
  createTime: ServerTimestamp
  updateTime: ServerTimestamp
}

export interface Post {
  title: string
  body: string
  likeCount: IncrementableNumber
  createTime: ServerTimestamp
  updateTime: ServerTimestamp
}

export interface LikedUser {
  id: string
  createTime: ServerTimestamp
}

export interface LikedPost {
  id: string
  postRef: ftest.firestore.DocumentReference
  createTime: ServerTimestamp
}

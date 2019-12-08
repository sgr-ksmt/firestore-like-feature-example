import 'jest'
import FirestoreTestProvider from './ruleHelper'
import * as ftest from '@firebase/testing'
import UserDB from './userDB'
import { User, Post, LikedUser, LikedPost } from '../src/model'

const testName = 'scenario'
const provider = new FirestoreTestProvider(testName)

describe(testName, () => {
  beforeEach(async () => {
    provider.increment()
    await provider.loadRules()
  })

  test('should be succeeded', async () => {
    const userA = new UserDB('userA', provider)

    await ftest.assertSucceeds(
      userA.db
        .collection('users')
        .doc(userA.uid)
        .set({
          name: 'John',
          likePostCount: 0,
          createTime: ftest.firestore.FieldValue.serverTimestamp(),
          updateTime: ftest.firestore.FieldValue.serverTimestamp()
        } as User)
    )

    const postRef: ftest.firestore.DocumentReference = await ftest.assertSucceeds(
      userA.db
        .collection('users')
        .doc(userA.uid)
        .collection('posts')
        .add({
          title: 'Test article',
          body: 'Lorem ipsum....',
          author: userA.db.collection('users').doc(userA.uid),
          likeCount: 0,
          createTime: ftest.firestore.FieldValue.serverTimestamp(),
          updateTime: ftest.firestore.FieldValue.serverTimestamp()
        } as Post)
    )

    await ftest.assertSucceeds(
      postRef.update({
        title: 'Test article(2)',
        body: 'Lorem ipsum....(modified)',
        updateTime: ftest.firestore.FieldValue.serverTimestamp()
      } as Partial<Post>)
    )

    await ftest.assertFails(
      postRef.update({
        likeCount: ftest.firestore.FieldValue.increment(1),
        updateTime: ftest.firestore.FieldValue.serverTimestamp()
      } as Partial<Post>)
    )

    const userB = new UserDB('userB', provider)

    await ftest.assertSucceeds(
      userB.db
        .collection('users')
        .doc(userB.uid)
        .set({
          name: 'Mike',
          likePostCount: 0,
          createTime: ftest.firestore.FieldValue.serverTimestamp(),
          updateTime: ftest.firestore.FieldValue.serverTimestamp()
        } as User)
    )
    const addLikeBatch = userB.db.batch()

    addLikeBatch.update(userB.db.doc(postRef.path), {
      likeCount: ftest.firestore.FieldValue.increment(1),
      updateTime: ftest.firestore.FieldValue.serverTimestamp()
    } as Partial<Post>)

    addLikeBatch.update(userB.db.collection('users').doc(userB.uid), {
      likePostCount: ftest.firestore.FieldValue.increment(1),
      updateTime: ftest.firestore.FieldValue.serverTimestamp()
    } as Partial<User>)

    addLikeBatch.set(
      userB.db
        .doc(postRef.path)
        .collection('likedUsers')
        .doc(userB.uid),
      {
        id: userB.uid,
        createTime: ftest.firestore.FieldValue.serverTimestamp()
      } as LikedUser
    )

    addLikeBatch.set(
      userB.db
        .collection('users')
        .doc(userB.uid)
        .collection('likedPosts')
        .doc(postRef.id),
      {
        id: postRef.id,
        postRef: postRef,
        createTime: ftest.firestore.FieldValue.serverTimestamp()
      } as LikedPost
    )

    await ftest.assertSucceeds(addLikeBatch.commit())

    const removeLikeBatch = userB.db.batch()

    removeLikeBatch.update(userB.db.doc(postRef.path), {
      likeCount: ftest.firestore.FieldValue.increment(-1),
      updateTime: ftest.firestore.FieldValue.serverTimestamp()
    } as Partial<Post>)

    removeLikeBatch.update(userB.db.collection('users').doc(userB.uid), {
      likePostCount: ftest.firestore.FieldValue.increment(-1),
      updateTime: ftest.firestore.FieldValue.serverTimestamp()
    } as Partial<User>)

    removeLikeBatch.delete(
      userB.db
        .doc(postRef.path)
        .collection('likedUsers')
        .doc(userB.uid)
    )

    removeLikeBatch.delete(
      userB.db
        .collection('users')
        .doc(userB.uid)
        .collection('likedPosts')
        .doc(postRef.id)
    )

    await ftest.assertSucceeds(removeLikeBatch.commit())
  })

  afterEach(async () => await provider.cleanup())
})

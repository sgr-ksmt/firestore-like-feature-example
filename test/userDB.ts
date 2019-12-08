import * as ftest from '@firebase/testing'
import FirestoreTestProvider from './ruleHelper'

export default class UserDB {
  readonly uid: string
  readonly db: ftest.firestore.Firestore

  constructor(uid: string, provider: FirestoreTestProvider) {
    this.uid = uid
    this.db = provider.getFirestoreWithAuth({ uid })
  }
}

import * as ftest from '@firebase/testing'
import * as fs from 'fs'

export default class FirestoreTestProvider {
  private testNumber = 0
  private projectName: string
  private rules: string

  constructor(projectName: string, rulesFilePath = 'firestore.rules') {
    this.projectName = projectName + '-' + Date.now()
    this.rules = fs.readFileSync(rulesFilePath, 'utf8')
  }

  increment() {
    this.testNumber++
  }

  private getProjectID() {
    return [this.projectName, this.testNumber].join('-')
  }

  async loadRules() {
    return ftest.loadFirestoreRules({
      projectId: this.getProjectID(),
      rules: this.rules
    })
  }

  getFirestoreWithAuth(auth?: { [key in 'uid' | 'email']?: string }) {
    return ftest
      .initializeTestApp({
        projectId: this.getProjectID(),
        auth: auth
      })
      .firestore()
  }

  getAdminFirestore() {
    return ftest
      .initializeAdminApp({ projectId: this.getProjectID() })
      .firestore()
  }

  async cleanup() {
    return Promise.all(ftest.apps().map(app => app.delete()))
  }
}

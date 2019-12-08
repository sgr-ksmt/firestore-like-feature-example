import * as admin from 'firebase-admin'
admin.initializeApp()

import * as Like from './like'
export const firestore = { ...Like }

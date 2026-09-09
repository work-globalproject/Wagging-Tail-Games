import { readFileSync } from 'node:fs';
import { before, after, beforeEach, test } from 'node:test';
import { initializeTestEnvironment, assertFails, assertSucceeds, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';
let env: RulesTestEnvironment;
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-wagging-tail',
  firestore: { host: '127.0.0.1', port: 8080, rules: readFileSync('firestore.rules', 'utf8') } }); });
beforeEach(async () => { await env.clearFirestore(); });
after(async () => { await env?.cleanup(); });
const db = (uid: string, claims = {}) => env.authenticatedContext(uid, { email: `${uid}@example.test`, ...claims }).firestore();
test('owner can save/read/delete their profile; other users cannot read or list profiles', async () => {
  await assertSucceeds(setDoc(doc(db('a'), 'users/a'), { displayName: 'A' }));
  await assertSucceeds(getDoc(doc(db('a'), 'users/a')));
  await assertFails(getDoc(doc(db('b'), 'users/a')));
  await assertFails(getDocs(collection(db('b'), 'users')));
  await assertSucceeds(deleteDoc(doc(db('a'), 'users/a')));
});
test('self-assigned role, edited role, forged email and unverified owner email do not grant admin', async () => {
  await assertFails(setDoc(doc(db('a'), 'users/a'), { role: 'admin' }));
  await assertSucceeds(setDoc(doc(db('a'), 'users/a'), { role: 'pet_parent' }));
  await assertFails(setDoc(doc(db('a'), 'users/a'), { role: 'admin' }, { merge: true }));
  await assertSucceeds(setDoc(doc(db('a'), 'users/a'), { email: 'donatasgricius123@gmail.com' }, { merge: true }));
  await assertFails(setDoc(doc(db('a'), 'custom_games/g'), { title: 'Attack' }));
  await assertFails(setDoc(doc(db('owner', { email: 'donatasgricius123@gmail.com', email_verified: false }), 'custom_games/g'), { title: 'Attack' }));
});
test('trusted claim and verified owner can administer the catalog', async () => {
  await assertSucceeds(setDoc(doc(db('admin', { admin: true }), 'custom_games/g'), { title: 'Play' }));
  await assertSucceeds(deleteDoc(doc(db('owner', { email: 'donatasgricius123@gmail.com', email_verified: true }), 'custom_games/g')));
});
test('legacy Firestore admin roles do not grant authority', async () => {
  await env.withSecurityRulesDisabled(async context => { await setDoc(doc(context.firestore(), 'users/a'), { role: 'admin' }); });
  await assertFails(setDoc(doc(db('a'), 'custom_games/g'), { title: 'Attack' }));
});
test('session history is private, owned, and deletable', async () => {
  await assertSucceeds(setDoc(doc(db('a'), 'users/a/sessions/s'), { id: 's', durationSeconds: 60 }));
  await assertFails(getDoc(doc(db('b'), 'users/a/sessions/s')));
  await assertFails(setDoc(doc(db('b'), 'users/a/sessions/s'), { durationSeconds: 99 }));
  await assertSucceeds(deleteDoc(doc(db('a'), 'users/a/sessions/s')));
});
test('guest can read catalog but cannot access profiles or write games', async () => {
  const guest = env.unauthenticatedContext().firestore();
  await assertSucceeds(getDocs(collection(guest, 'custom_games')));
  await assertFails(getDoc(doc(guest, 'users/a')));
  await assertFails(setDoc(doc(guest, 'custom_games/g'), { title: 'Attack' }));
});

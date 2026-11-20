/**
 * One-time Atlas verification script.
 * Run with:  node test-db.js
 * Requires a valid MONGODB_URI in .env
 * Creates two test reviews, verifies newest-first order, then removes them.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Review   = require('./models/Review');

const URI = process.env.MONGODB_URI;
if (!URI) {
  console.error('FAIL: MONGODB_URI is not set. Add it to your .env file.');
  process.exit(1);
}

let passed = 0;
let failed = 0;

function pass(msg) { console.log('  PASS:', msg); passed++; }
function fail(msg) { console.error('  FAIL:', msg); failed++; }

async function run() {
  console.log('\nConnecting to MongoDB Atlas...');
  await mongoose.connect(URI);
  console.log('Connected.\n');

  // --- Test 1: save a review ---
  console.log('Test 1 — Save a review');
  const r1 = await Review.create({
    restaurant: '__TestPlace_A',
    dish:       'Test Dish 1',
    price:      9.99,
    rating:     3,
    comment:    'Automated test entry A'
  });
  if (r1._id) pass('Document saved with _id ' + r1._id);
  else        fail('save returned no _id');

  // small delay to guarantee distinct createdAt timestamps
  await new Promise(resolve => setTimeout(resolve, 50));

  const r2 = await Review.create({
    restaurant: '__TestPlace_B',
    dish:       'Test Dish 2',
    price:      5.00,
    rating:     5,
    comment:    'Automated test entry B'
  });
  if (r2._id) pass('Second document saved with _id ' + r2._id);
  else        fail('second save returned no _id');

  // --- Test 2: retrieve reviews and check newest-first ---
  console.log('\nTest 2 — Retrieve and verify newest-first order');
  const reviews = await Review.find({ restaurant: /^__TestPlace_/ }).sort({ createdAt: -1 });
  if (reviews.length >= 2) pass('Found ' + reviews.length + ' test documents');
  else                     fail('Expected >=2, got ' + reviews.length);

  const newestFirst = reviews[0].createdAt >= reviews[1].createdAt;
  if (newestFirst) pass('Newest-first ordering confirmed');
  else             fail('Ordering is NOT newest-first');

  // --- Test 3: persistence — reconnect and re-query ---
  console.log('\nTest 3 — Verify persistence after reconnect');
  await mongoose.disconnect();
  await mongoose.connect(URI);
  const persisted = await Review.findById(r1._id);
  if (persisted && persisted.restaurant === '__TestPlace_A') pass('Document persists after reconnect');
  else fail('Document not found after reconnect');

  // --- Test 4: empty-state path ---
  console.log('\nTest 4 — Empty-state query returns array (not null/undefined)');
  const emptyCheck = await Review.find({ restaurant: '__NonExistent__' });
  if (Array.isArray(emptyCheck) && emptyCheck.length === 0) pass('Empty result is a zero-length array — empty state will render correctly');
  else fail('Unexpected result for empty query: ' + JSON.stringify(emptyCheck));

  // --- Cleanup test documents ---
  console.log('\nCleaning up test documents...');
  const deleted = await Review.deleteMany({ restaurant: /^__TestPlace_/ });
  console.log('  Removed', deleted.deletedCount, 'test document(s). Existing user data untouched.');

  // --- Summary ---
  console.log('\n─────────────────────────────');
  console.log('Results:', passed, 'passed,', failed, 'failed');
  if (failed === 0) console.log('MongoDB persistence VERIFIED.\n');
  else              console.log('Some tests failed — see FAIL lines above.\n');
}

run()
  .catch(err => {
    console.error('\nFATAL:', err.message);
    process.exit(1);
  })
  .finally(() => mongoose.disconnect());

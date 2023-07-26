const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
    credential: cert(serviceAccount),
    storageBucket: 'gs://supreme-diagnostics.appspot.com'
});

const bucket = getStorage().bucket();

module.exports = {bucket};



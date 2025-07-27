// functions/index.js - FOR REALTIME DATABASE
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();

// Get a reference to the REALTIME DATABASE service
const db = admin.database();

exports.registerParticipant = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    try {
      const data = req.body;
      if (!data.fullName || !data.email) {
        return res.status(400).json({ message: "Missing required fields." });
      }
      const registrationRecord = {
        ...data,
        registeredAt: Date.now(), // Use a simple timestamp for Realtime DB
      };

      // Push the new record to the 'registrations' path in the Realtime Database
      await db.ref("registrations").push(registrationRecord);

      return res.status(200).json({ message: "Registration successful!", data: registrationRecord });
    } catch (error) {
      console.error("Error writing to Realtime Database", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
});
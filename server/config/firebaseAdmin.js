import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import fs from "node:fs";

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_PATH is missing from backend .env"
  );
}

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

if (serviceAccount.project_id !== "talknet-tn") {
  throw new Error("Firebase service account must belong to talknet-tn");
}

const app =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });

export const firebaseAdminAuth = getAuth(app);


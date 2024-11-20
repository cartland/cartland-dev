/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as express from "express";

import { https } from "firebase-functions/v2";
const { logger } = require("firebase-functions/v2/logger");

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = https.onRequest(
    (request: https.Request, response: express.Response) => {
        logger.info("Hello logs!", { structuredData: true });
        response.send("Hello from Firebase!");
    }
);

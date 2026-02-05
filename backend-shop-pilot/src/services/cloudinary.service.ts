import { v2 as cloudinary } from 'cloudinary';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const API_KEY = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUD_NAME || !API_KEY || !API_SECRET) {
  console.warn('⚠️ Cloudinary config missing. Image uploads will not work.');
}

cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
});

export const CloudinaryService = {
  getUploadSignature: () => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Sign the timestamp and "upload" params
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, upload_preset: 'ml_default' },
      API_SECRET!,
    );
    // Note: 'ml_default' is a convention.
    // We should allow the user to optionally pass a preset or just sign standard params.
    // For simplicity, we'll sign just the timestamp (standard signed upload requires just timestamp + public_id usually, or Eager transformations).
    // Actually, to keep it GENERIC: allow frontend to pass params to sign?
    // OR simplest: Sign a Standard Upload.

    // Let's use the simplest signature: timestamp only (for unsigned presets) OR
    // for Signed Uploads: we need `timestamp` signed with secret.

    const signedParams = {
      timestamp,
    };

    const simpleSignature = cloudinary.utils.api_sign_request(signedParams, API_SECRET!);

    return {
      signature: simpleSignature,
      timestamp,
      cloudName: CLOUD_NAME,
      apiKey: API_KEY,
    };
  },
};

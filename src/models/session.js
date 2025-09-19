import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    accessTokenExpiredAt: {
      type: Number,
      required: true,
    },
    refreshTokenExpiredAt: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Session = model('Session', sessionSchema);

export default Session;

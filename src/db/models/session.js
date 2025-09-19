import { Schema, model } from 'mongoose';

const sessionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  accessToken: {
    type: String,
    required: true,
  },
});

const Session = model('session', sessionSchema);

export default Session;
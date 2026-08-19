import mongoose from 'mongoose';

const numerologyProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, 
    },
    numero_vida: {
      type: Number,
      required: true,
    },
    numero_expresion: {
      type: Number,
      required: true,
    },
    numero_alma: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const NumerologyProfile = mongoose.model(
  'NumerologyProfile',
  numerologyProfileSchema
);

export default NumerologyProfile;
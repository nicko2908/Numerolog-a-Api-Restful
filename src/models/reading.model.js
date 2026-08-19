import mongoose from 'mongoose';

const readingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    respuesta: {
      type: String,
      required: true,
    },
    tipo_lectura: {
      type: String,
      enum: ['diaria', 'general', 'anual'],
      required: true,
    },
    fecha: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


readingSchema.index({ user: 1, fecha: -1 });

const Reading = mongoose.model('Reading', readingSchema);

export default Reading;
import mongoose from 'mongoose';

const compatibilityMatchSchema = new mongoose.Schema(
  {
    usuario_1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    usuario_2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      validate: {
        validator: function (value) {
          return value.toString() !== this.usuario_1?.toString();
        },
        message: 'Un usuario no puede compararse consigo mismo',
      },
    },
    puntaje: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    interpretacion: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const CompatibilityMatch = mongoose.model(
  'CompatibilityMatch',
  compatibilityMatchSchema
);

export default CompatibilityMatch;
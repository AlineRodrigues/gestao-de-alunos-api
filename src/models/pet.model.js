import { randomUUID } from 'node:crypto';
import mongoose from '../database/db.js';

const { Schema } = mongoose;

const toPlainOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
};

const petSchema = new Schema(
  {
    _id: { type: String, default: () => randomUUID() },
    nome: { type: String, required: true, trim: true },
    especie: { type: String, required: true, trim: true },
    raca: { type: String, default: null, trim: true },
    idade: { type: Number, default: null, min: 0 },
    criadoPor: { type: String, required: true },
  },
  { timestamps: true, toJSON: toPlainOptions, toObject: toPlainOptions }
);

const Pet = mongoose.models.Pet || mongoose.model('Pet', petSchema, 'pets');

export default Pet;

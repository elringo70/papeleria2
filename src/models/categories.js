import mongoose from 'mongoose';
const { Schema, model, models } = mongoose;

const categorySchema = new Schema(
  {
    name: { type: String, required: true, uppercase: true, trim: true },
    subCategories: { type: [], uppercase: true, trim: true },
    active: { type: Boolean, required: true, default: true }
  },
  {
    timestamps: true
  }
);

export const Category = models.Category || model('Category', categorySchema);

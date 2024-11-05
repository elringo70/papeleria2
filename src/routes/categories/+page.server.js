import { error, fail } from '@sveltejs/kit';
import { Category } from '$models/categories';
import { dbConnect, dbDisconnect } from '$utils/db';
import { z } from 'zod';
import { validateData } from '$utils/utils';

const categorySchema = z.object({
  name: z
    .string({ required_error: 'Ingrese un nombre de categoría' })
    .min(3, { message: 'Ingrese un nombre de categoría' })
    .max(64, { message: 'Nombre demasiado largo' })
    .trim(),
  subCategories: z.any(),
  active: z.boolean().optional()
});

export const load = async () => {
  try {
    await dbConnect();
    const categories = await Category.find().sort({ name: 'asc' });
    return { categories: JSON.parse(JSON.stringify(categories)) };
  } catch (err) {
    console.log('Error: ', err);
    error(500, 'Server error');
  } finally {
    await dbDisconnect();
  }
};

export const actions = {
  post: async ({ request }) => {
    try {
      await dbConnect();
      const form = await request.formData()

      const { formData, errors } = await validateData(form, categorySchema);
      const data = Object.fromEntries(form)

      const subCategories = []
      for (const [key, value] of Object.entries(data)) {
        if (key.includes('subCategories')) subCategories.push(value)
      }

      const body = {
        name: data.name,
        subCategories
      }

      if (errors) {
        return fail(401, {
          data: formData,
          errors: errors.fieldErrors
        });
      }

      const findCategory = await Category.findOne({ name: form.name });
      if (findCategory) {
        return fail(400, { message: 'La categoría ya existe' });
      }

      const category = new Category(body);
      await category.save();
      return { success: true, message: 'Categoría creada' };
    } catch (err) {
      console.log('Error: ', err);
      error(500, 'Server error');
    } finally {
      await dbDisconnect();
    }
  },

  delete: async ({ request }) => {
    try {
      await dbConnect();
      const { id } = Object.fromEntries(await request.formData());

      const findCategory = await Category.findById(id);
      if (!findCategory) {
        return fail(400, { message: 'La categoría no existe' });
      }

      await Category.findByIdAndDelete(id);

      return { success: true };
    } catch (err) {
      console.log('Error: ', err);
      error(500, 'Server error');
    } finally {
      await dbDisconnect();
    }
  }
};

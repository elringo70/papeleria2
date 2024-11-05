import { update } from 'firebase/database';
import { writable } from 'svelte/store';

/**
 * @typedef {object} initialVales
 * @property {string} category
 * @property {string[]} subcategories
 */

const initialVales = {
  category: '',
  subcategories: []
}

function categoriesStorage() {
  const { subscribe } = writable(initialVales)



  return {
    subscribe,

  }
}

export const store = categoriesStorage()

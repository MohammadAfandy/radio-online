import { writable } from 'svelte/store';

const createModal = () => {
  const initialData = {
    isOpen: false,
    component: null,
    props: {},
  };
  const { subscribe, set, update } = writable(initialData);

  return {
    subscribe,
    set,
    update,
    open: ({ component, props = {} }) => update((state) => {
      return {
        ...state,
        isOpen: true,
        component,
        props,
      };
    }),
    close: () => update((state) => {
      return {
        ...state,
        isOpen: false,
        component: null,
        props: {},
      };
    }),
  };
};

export const modal = createModal();

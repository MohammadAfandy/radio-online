import { toast } from '@zerodevx/svelte-toast';

const THEME = {
  success: {
    '--toastBackground': '#48BB78',
    '--toastBarBackground': '#2F855A',
  },
  danger: {
    '--toastBackground': '#F56565',
    '--toastBarBackground': '#C53030',
  },
};

export const showToast = (content, type) => {
  if (type && !THEME[type]) throw new Error('Invalid toast type');

  toast.push(content, {
    theme: type ? THEME[type] : undefined,
  });
};

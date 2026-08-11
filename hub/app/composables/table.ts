import { UInput } from '#components';

export function createTableGlobalFilter() {
  const searchInput = ref('');

  const TableGlobalSearch = defineComponent({
    setup() {
      return () =>
        h(UInput as any, {
          modelValue: searchInput.value,
          'onUpdate:modelValue': (value: string) => {
            searchInput.value = value;
          },
          class: 'max-w-sm',
          placeholder: 'Enter any content ...',
        });
    },
  });

  return {
    searchInput,
    TableGlobalSearch,
  };
}
<template>
  <TtDialog
    v-model="show"
    title="Добавить пассажира"
    width="20rem"
    height="30rem"
  >
    <form class="form-dialog">
      <TtInputText
        v-model="passenger.firstName"
        label="Имя"
        required
        error-field="firstName"
        placeholder="Введите имя"
      />
      <TtInputText
        v-model="passenger.lastName"
        label="Фамилия"
        required
        error-field="lastName"
        placeholder="Введите фамилию"
      />
      <TtInputText
        v-model="passenger.passportNumber"
        label="Номер паспорта"
        required
        error-field="passportNumber"
        placeholder="Введите номер паспорта"
      />
    </form>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <TtButton
          label="Закрыть"
          icon="pi pi-times"
          text
          @click="closeDialog"
        />
        <TtButton
          type="button"
          icon="pi pi-check"
          :label="'Сохранить'"
          :loading="loadingSubmit"
          @click="handleSubmit"
        />
      </div>
    </template>
  </TtDialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';

import TtInputText from '@/components/inputs/TtInputText.vue';
import TtDialog from '@/components/dialogs/TtDialog.vue';
import TtButton from '@/components/buttons/TtButton.vue';
import type { PassengerData } from '@/api/services/passengerService';
import flightService from '@/api/services/flightService';
import { passengerSchema } from '@/validation/schemas/passengerSchema';
import { useToast } from '@/composable/useToast';

const props = defineProps<{
  flightId: number | null;
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()

const show = defineModel<boolean>('show', { required: true });

const toast = useToast()

const validationSchema = computed(() => toTypedSchema(passengerSchema))
const { setValues, validate } = useForm({
  validationSchema,
  validateOnMount: false,
})

const passenger = ref<PassengerData>({
  id: null,
  firstName: null,
  lastName: null,
  passportNumber: null,
  flightId: null,
});

const closeDialog = () => {
  show.value = false;
  emit('close');
}

const loadingSubmit = ref(false);
const handleSubmit = async () => {
  setValues({ ...(passenger.value as any) })

  const validationResult = await validate()
  if (!validationResult.valid) {
    return
  }

  loadingSubmit.value = true;
  try {
    await flightService.createPassenger(props.flightId, passenger.value);
    toast.success('Пассажир успешно добавлен')
    closeDialog();
    emit('save');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка сохранения пассажира')
  } finally {
    loadingSubmit.value = false;
  }
}
</script>
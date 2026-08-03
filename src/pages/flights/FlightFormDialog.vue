<template>
  <TtDialog
    v-model="show"
    :title="isEdit ? 'Редактировать рейс' : 'Добавить рейс'"
    width="50rem"
    height="50rem"
  >
    <form class="form-dialog">
      <TtInputText
        label="Номер рейса"
        v-model="flight.flightNumber"
        required
        error-field="flightNumber"
        placeholder="Введите номер рейса"
      />
      <TtSelect
        label="Аэропорты вылета"
        v-model="flight.departureAirport"
        required
        error-field="departureAirport"
        :options="departureAirports"
        option-label="name"
        option-value="id"
      />
      <TtSelect
        v-model="flight.arrivalAirport"
        required
        label="Аэропорты прилета"
        error-field="arrivalAirport"
        option-label="name"
        option-value="id"
        :options="arrivalAirports"
      />
      <TtDatePicker
        v-model="flight.departureTime"
        label="Время вылета"
        required
        error-field="departureTime"
      />
      <TtDatePicker
        v-model="flight.arrivalTime"
        label="Время прилета"
        required
        error-field="arrivalTime"
      />
      <TtSelect
        v-model="flight.aircraft"
        required
        label="Самолёт"
        error-field="aircraft"
        option-label="model"
        option-value="id"
        :options="aircrafts"
      />
    </form>

    <template #footer>
      <div class="flex justify-content-end gap-2">
        <TtButton
          label="Закрыть"
          icon="pi pi-times"
          text
          severity="danger"
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
import { ref, computed, onMounted } from 'vue';

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { flightSchema } from '@/validation/schemas/flightSchema'

import { useToast } from '@/composable/useToast';
import TtSelect from '@/components/inputs/TtSelect.vue';
import TtInputText from '@/components/inputs/TtInputText.vue';
import TtDatePicker from '@/components/inputs/TtDatePicker.vue';
import TtDialog from '@/components/dialogs/TtDialog.vue';
import TtButton from '@/components/buttons/TtButton.vue';
import flightService, { type FlightData } from '@/api/services/flightService';
import airportService, { type AirportData } from '@/api/services/airportService';
import aircraftService, { type AircraftData } from '@/api/services/aircraftService';

const props = defineProps<{
  flightId: number | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save'): void
}>()

const show = defineModel<boolean>('show', { required: true });

const toast = useToast();

const validationSchema = computed(() => toTypedSchema(flightSchema))
const { setValues, validate } = useForm({
  validationSchema,
  validateOnMount: false,
})

const flight = ref<FlightData>({
  id: null,
  flightNumber: null,
  departureAirport: null,
  arrivalAirport: null,
  departureTime: null,
  arrivalTime: null,
  aircraft: null,
});
const loadFlight = async () => {
  try {
    const flightData = await flightService.getFlightById(props.flightId);
    flight.value = flightData;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки рейса')
  }
};

const departureAirports = ref<AirportData[]>([]);
const arrivalAirports = ref<AirportData[]>([]);
const loadAirports = async () => {
  try {
    const airports = await airportService.getAirports();
    departureAirports.value = airports;
    arrivalAirports.value = airports;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки аэропортов')
  }
}

const aircrafts = ref<AircraftData[]>([]);
const loadAircrafts = async () => {
  try {
    const aircraftsData = await aircraftService.getAircrafts();
    aircrafts.value = aircraftsData;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки самолётов')
  }
}

const isEdit = computed(() => props.flightId !== null);
onMounted(() => {
  if (isEdit.value) {
    loadFlight();
  }
  loadAirports();
  loadAircrafts();
});

const closeDialog = () => {
  show.value = false;
  emit('close');
}

const loadingSubmit = ref(false);
const handleSubmit = async () => {
  setValues({ ...(flight.value) })

  const validationResult = await validate()
  if (!validationResult.valid) {
    return
  }

  loadingSubmit.value = true;
  try {
    await flightService.createOrUpdateFlight(props.flightId, flight.value);
    toast.success(`Рейс успешно ${isEdit.value ? 'обновлен' : 'создан'}`)
    closeDialog();
    emit('save');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || `Ошибка ${isEdit.value ? 'обновления' : 'создания'} рейса`)
  } finally {
    loadingSubmit.value = false;
  }
}
</script>
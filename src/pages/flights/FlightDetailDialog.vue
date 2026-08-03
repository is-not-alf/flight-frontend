<template>
  <TtDialog
    v-model="show"
    title="Подробнее о полёте"
    width="50rem"
    height="50rem"
  >
    <form class="form-dialog">
      <Tabs v-model:value="activeTab">
        <TabList>
          <Tab value="0">Основная информация</Tab>
          <Tab value="1">Пассажиры</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <TtInputText
              label="Номер рейса"
              :model-value="flight.flightNumber"
              readonly
            />
            <TtInputText
              label="Аэропорты вылета"
              :model-value="flight.departureAirport?.name"
              readonly
            />
            <TtDatePicker
              label="Дата и время вылета"
              :model-value="flight.departureTime"
              readonly 
            />
            <TtDatePicker
              label="Дата и время прилета"
              :model-value="flight.arrivalTime"
              readonly
            />
            <TtInputText
              label="Самолёт"
              :model-value="flight.aircraft?.model"
              readonly
            />
            <TtInputNumber
              label="Количество пассажиров"
              :model-value="flightPassengers.length"
              readonly
            />
          </TabPanel>

          <TabPanel value="1">
            <TtToolbar>
              <template #start>
                <TtButton 
                  v-tooltip="'Добавить пассажира'"
                  icon="pi pi-plus" 
                  @click="showPassengersFormDialog = true"
                />
              </template>
            </TtToolbar>
            <TtDataTable 
              :value="flightPassengers" 
              :loading="loadingPassengers"
            >
              <Column field="lastName" header="Фамилия" style="width: 20%"></Column>
              <Column field="firstName" header="Имя" style="width: 20%"></Column>
              <Column field="passportNumber" header="Паспорт" style="width: 20%"></Column>
              <Column field="actions" header="Действия" style="width: 20%">
                <template #body="{ data }">
                  <TtButton 
                    v-tooltip="'Удалить пассажира'"
                    icon="pi pi-trash"
                    severity="danger"
                    :loading="loadingDeleteButton"
                    @click="handleDeletePassenger(data.id)"
                  />
                </template>
              </Column>
            </TtDataTable>
          </TabPanel>
        </TabPanels>
      </Tabs>
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
          :label="'Редактировать рейс'"
          @click="openFlightFormDialog"
        />
      </div>
    </template>
  </TtDialog>

  <PassengerFormDialog
    v-if="showPassengersFormDialog"
    v-model:show="showPassengersFormDialog"
    :flight-id="flightId"
    @save="loadFlightPassengers()"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Column from 'primevue/column'

import TtInputText from '@/components/inputs/TtInputText.vue';
import TtInputNumber from '@/components/inputs/TtInputNumber.vue';
import TtDatePicker from '@/components/inputs/TtDatePicker.vue';
import TtButton from '@/components/buttons/TtButton.vue';
import TtDialog from '@/components/dialogs/TtDialog.vue';
import TtDataTable from '@/components/tables/TtDataTable.vue';
import TtToolbar from '@/components/toolbar/TtToolbar.vue';
import flightService, { type FlightData } from '@/api/services/flightService';
import passengerService, { type PassengerData } from '@/api/services/passengerService';
import { useToast } from '@/composable/useToast';

import PassengerFormDialog from './PassengerFormDialog.vue';

const props = defineProps<{
  flightId: number | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'editFlight'): void;
}>();

const show = defineModel<boolean>('show', { required: true });

const toast = useToast();

const activeTab = ref<string>('0');

const showPassengersFormDialog = ref(false);

const flight = ref<FlightData>({
  id: null,
  flightNumber: '',
  departureAirport: {
    name: '',
    code: '',
    city: '',
  },
  arrivalAirport: {
    name: '',
    code: '',
    city: '',
  },
  departureTime: null,
  arrivalTime: null,
  aircraft: {
    model: '',
    capacity: null,
  },
});
const loadFlight = async () => {
  try {
    const flightData = await flightService.getFlightById(props.flightId);
    flight.value = flightData;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки рейса')
  }
};

const flightPassengers = ref<PassengerData[]>([]);
const loadingPassengers = ref(false);
const loadFlightPassengers = async () => {
  loadingPassengers.value = true;
  try {
    const passengersData = await flightService.getPassengersByFlightId(props.flightId);
    flightPassengers.value = passengersData;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки пассажиров')
  } finally {
    loadingPassengers.value = false;
  }
};

onMounted(() => {
  loadFlight();
  loadFlightPassengers();
});

const closeDialog = () => {
  show.value = false;
  emit('close');
};

const openFlightFormDialog = () => {
  closeDialog();
  emit('editFlight');
};

const loadingDeleteButton = ref(false);
const handleDeletePassenger = async (passengerId: number) => {
  loadingDeleteButton.value = true;
  try {
    await passengerService.deletePassenger(passengerId);
    toast.success('Пассажир успешно удален')
    loadFlightPassengers();
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка удаления пассажира')
  } finally {
    loadingDeleteButton.value = false;
  }
};
</script>
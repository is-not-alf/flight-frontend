<template>
  <div>
    <h1>Список рейсов</h1>

    <TtToolbar>
      <template #start>
        <TtButton 
          v-tooltip="'Добавить рейс'"
          icon="pi pi-plus" 
          @click="openFlightFormDialog" 
        />
      </template>
    </TtToolbar>

    <TtDataTable 
      paginator
      lazy
      tableStyle="min-width: 50rem"
      :value="flights"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :loading="loadingFlights"
      :totalRecords="flights?.totalElements || 0"
      @page="onPage($event)"
    >
      <Column field="id" header="ID" style="width: 5%"></Column>
      <Column field="flightNumber" header="Номер рейса" style="width: 15%"></Column>
      <Column field="departureAirport.code" header="Аэропорт вылета (код)" style="width: 15%"></Column>
      <Column field="arrivalAirport.code" header="Аэропорт прилета (код)" style="width: 15%"></Column>
      <Column field="departureTime" header="Время вылета" style="width: 20%">
        <template #body="{ data }">
          {{ formatDate(data.departureTime) }}
        </template>
      </Column>
      <Column field="passengers.length" header="Пассажиров" style="width: 20%"></Column>
      <Column field="actions" header="Действия" style="width: 25%">
        <template #body="{ data }">
          <div class="flex gap-1">
            <TtButton 
              v-tooltip="'Подробнее'"
              icon="pi pi-eye" 
              severity="info"
              @click="openFlightDetailDialog(data.id)" 
            />
            <TtButton 
              v-tooltip="'Удалить рейс'"
              icon="pi pi-trash" 
              severity="danger"
              @click="deleteFlight(data.id)" 
            />
          </div>
        </template>
      </Column>
    </TtDataTable>
  </div>

  <FlightFormDialog
    v-if="showFlightFormDialog"
    v-model:show="showFlightFormDialog"
    :flight-id="flightId"
    @save="loadFlights()"
  />

  <FlightDetailDialog
    v-if="showFlightDetailDialog"
    v-model:show="showFlightDetailDialog"
    :flightId="flightId"
    @editFlight="showFlightFormDialog = true"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

import Column from 'primevue/column'

import { useToast } from '@/composable/useToast';
import TtButton from '@/components/buttons/TtButton.vue';
import TtToolbar from '@/components/toolbar/TtToolbar.vue';
import TtDataTable from '@/components/tables/TtDataTable.vue';
import flightService, { type PageResponse, type FlightData } from '@/api/services/flightService';
import { formatDate } from '@/utils/dateUtils';

import FlightFormDialog from './FlightFormDialog.vue';
import FlightDetailDialog from './FlightDetailDialog.vue';

const toast = useToast();

const flights = ref<PageResponse<FlightData> | null>(null);
const loadingFlights = ref(false);
const loadFlights = async (page: number = 0, size: number = 10) => {
  loadingFlights.value = true;
  
  const params = {
    page,
    size,
  };
  try {
    const flightsData = await flightService.getFlights(params);
    flights.value = flightsData;
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка загрузки рейсов')
  } finally {
    loadingFlights.value = false;
  }
};

const onPage = (event: any) => {
  // console.log(event);
  // console.log(event.page, event.rows);
  loadFlights(event.page, event.rows);
};

onMounted(() => {
  loadFlights();
});

const flightId = ref<number | null>(null);
const showFlightDetailDialog = ref(false);
const openFlightDetailDialog = (id: number) => {
  flightId.value = id;
  showFlightDetailDialog.value = true;
};

const deleteFlight = async (id: number) => {
  try {
    await flightService.deleteFlight(id);
    loadFlights();
    toast.success('Рейс успешно удален');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Ошибка удаления рейса')
  }
};

const showFlightFormDialog = ref(false);
const openFlightFormDialog = () => {
  flightId.value = null;
  showFlightFormDialog.value = true;
};
</script>
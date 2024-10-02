<template>
  <AdminLayout>
    <div>
      <h1 style="text-align: Left">Confirmed Reservations</h1>
      <ejs-grid
        :dataSource="confirmedReservations"
        :allowResizing="true"
        :allowSorting="true"
        :allowFiltering="true"
        :allowPaging="true"
        :filterSettings="filterSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :sortSettings="initialSort"
        :pageSettings="pageSettings"
        @actionComplete="onActionComplete"
        @recordClick="onRecordClick"
      >
        <e-columns>
          <e-column
            field="confirmed_reservation_id"
            headerText="Confirmed Reservation ID"
            textAlign="Left"
            isPrimaryKey="true"
            width="100px"
          ></e-column>
          <e-column
            field="reservation_request_id"
            headerText="Reservation Request ID"
            textAlign="Left"
          ></e-column>
          <e-column
            field="hotel_id"
            headerText="Hotel ID"
            textAlign="Left"
          ></e-column>
          <e-column
            field="check_in_date"
            headerText="Check-in Date"
            textAlign="Left"
            :valueAccessor="formatDate"
          ></e-column>
          <e-column
            field="check_out_date"
            headerText="Check-out Date"
            textAlign="Left"
            :valueAccessor="formatDate"
          ></e-column>
          <e-column
            field="price"
            headerText="Price (TL)"
            textAlign="Left"
            :valueAccessor="formatPrice"
          ></e-column>
          <e-column
            field="room_type"
            headerText="Room Type"
            textAlign="Left"
          ></e-column>
          <e-column
            field="board_type"
            headerText="Board Type"
            textAlign="Left"
          ></e-column>
          <e-column
            field="confirm_date"
            headerText="Confirmation Date"
            textAlign="Left"
            :valueAccessor="formatDate"
          ></e-column>
          <e-column
            field="user_id"
            headerText="User ID"
            textAlign="Left"
          ></e-column>
        </e-columns>
      </ejs-grid>
    </div>
  </AdminLayout>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import {
  getAllConfirmedReservations,
  getReservationDetails,
} from "@/services/ReservationConfirmedService";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Filter,
  Page,
  Sort,
  Toolbar,
  Edit,
  Resize,
} from "@syncfusion/ej2-vue-grids";
import { useToast } from "vue-toastification";
import AdminLayout from "./AdminLayout.vue";

@Options({
  components: {
    "ejs-grid": GridComponent,
    "e-columns": ColumnsDirective,
    "e-column": ColumnDirective,
    AdminLayout,
  },
  provide: {
    grid: [Resize, Sort, Page, Toolbar, Edit, Filter],
  },
})
export default class ReservationConfirmedComponent extends Vue {
  confirmedReservations: any[] = [];
  initialSort = {
    columns: [{ field: "confirm_date", direction: "Descending" }],
  };
  pageSettings = { pageSizes: true, pageSize: 10 };
  filterSettings = { type: "Menu" };
  editSettings = {
    allowEditing: false,
    allowAdding: false,
    allowDeleting: false,
  };
  toolbar = ["Search"];
  toast = useToast();

  async mounted() {
    await this.fetchConfirmedReservations();
  }

  async fetchConfirmedReservations() {
    try {
      const response = await getAllConfirmedReservations();
      this.confirmedReservations = response;
    } catch (error) {
      console.error("Error while fetching confirmed reservations:", error);
      this.toast.error(
        "An error occurred while loading confirmed reservations."
      );
    }
  }

  async onActionComplete(args: any) {
    if (args.requestType === "filtering") {
      console.log("Filtering applied:", args);
    } else if (args.requestType === "sorting") {
      console.log("Sorting applied:", args);
    }
  }

  async onRecordClick(args: any) {
    if (args.rowData && args.rowData.confirmed_reservation_id) {
      try {
        const details = await getReservationDetails(
          args.rowData.confirmed_reservation_id.toString()
        );
        console.log("Reservation details:", details);

        if (details.user_id) {
          const updatedData = { ...args.rowData, user_id: details.user_id };
          const gridObj = (this.$refs.grid as any).ej2Instances;
          gridObj.updateRow(args.row, updatedData);
        }

        this.toast.info("Reservation details have been logged to the console.");
      } catch (error) {
        console.error("Error while fetching reservation details:", error);
        this.toast.error("Failed to retrieve reservation details.");
      }
    }
  }

  formatDate(field: string, data: any) {
    const date = new Date(data[field]);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  }

  formatPrice(field: string, data: any) {
    const price = parseFloat(data[field]);
    return `${price.toFixed(2)} TL`;
  }
}
</script>

<style scoped>
.experience-selection {
  border: 1px solid black;
  padding: 20px;
}
</style>

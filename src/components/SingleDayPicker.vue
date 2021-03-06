<template>
  <v-row align="center" justify="center">
    <v-col cols="auto"
      ><v-btn text @click="setPreviousDate">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-col>
    <v-col cols="auto">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="primary"
            v-model="dateFormatted"
            v-bind="attrs"
            v-on="on"
            >{{ weekday }} {{ dateFormatted }}</v-btn
          >
        </template>
        <v-date-picker
          v-model="date"
          :allowed-dates="dateIsAllowed"
          @input="
            menu = false;
            getCombinedDate();
          "
          locale="de-de"
          :first-day-of-week="1"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="auto">
      <v-btn text @click="setNextDate">
        <v-icon>mdi-arrow-right</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Dateconversions from '@/class/Dateconversions';
import { Component, Watch, Vue } from 'vue-property-decorator';
import holidaysJSON from '@/data/holidays.json';

@Component
export default class SingleDayPicker extends Vue {
  private date: string = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10)

  private dateFormatted: string = Dateconversions.convertEnglishToGermanReadableString(this.date);

  private weekday = this.getWeekdaybyDate(new Date());

  private menu = false;

  private holidays = holidaysJSON.days;

  mounted() : void {
    if (!this.dateIsAllowed(this.date)) {
      this.setNextDate();
    }
  }

  @Watch('date')
  dateChanged(): void {
    this.dateFormatted = Dateconversions.convertEnglishToGermanReadableString(this.date);
    this.weekday = this.getWeekdaybyDate();
    this.$emit('currentDayChanged', this.dateFormatted);
  }

  dateIsAllowed(dateVal: string | Date): boolean {
    if (typeof dateVal === 'string') {
      if (this.holidays.includes(dateVal)) {
        return false;
      }
      const day = this.getCombinedDate(dateVal).getDay();
      return day > 0 && day < 6;
    }
    const readableString = Dateconversions.convertGermanToEnglishReadableString(Dateconversions.convertDateToReadableString(dateVal));
    if (this.holidays.includes(readableString)) {
      return false;
    }
    const day = dateVal.getDay();
    return day > 0 && day < 6;
  }

  getCombinedDate(dateString?: string): Date {
    const date = dateString || this.date;
    const timezoneOffsetInHours = new Date(`${date}T00:00:00.000Z`).getTimezoneOffset() * -1;
    const offsetSuffix = `${timezoneOffsetInHours < 0 ? '-' : '+'}0${Math.abs(timezoneOffsetInHours / 60)}:00`;
    return new Date(`${date}T00:00:00.000${offsetSuffix}`);
  }

  getWeekdaybyDate(date? : Date) : string {
    const dateToCheck = date || this.getCombinedDate();
    switch (dateToCheck.getDay()) {
      case 1: return 'Mo,';
      case 2: return 'Di,';
      case 3: return 'Mi,';
      case 4: return 'Do,';
      case 5: return 'Fr,';
      default: return '';
    }
  }

  setPreviousDate(): void {
    const date = this.getCombinedDate();
    date.setDate(date.getDate() - 1);
    while (!this.dateIsAllowed(date)) {
      date.setDate(date.getDate() - 1);
    }
    this.date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  setNextDate(): void {
    const date = this.getCombinedDate();
    date.setDate(date.getDate() + 1);
    while (!this.dateIsAllowed(date)) {
      date.setDate(date.getDate() + 1);
    }
    this.date = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }
}

</script>

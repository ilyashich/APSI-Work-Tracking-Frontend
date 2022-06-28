export class CalendarJob {
    Id: number;
    Subject: string;
    StartTime: Date;
    EndTime: Date;

    constructor(id: number, name: string, startDate: number[], endDate: number[]) {
        this.Id = id;
        this.Subject = name;
        this.StartTime = new Date(startDate[0], startDate[1], startDate[2], startDate[3], startDate[4]);
        this.EndTime = new Date(endDate[0], endDate[1], endDate[2], endDate[3], endDate[4]);
      }
}
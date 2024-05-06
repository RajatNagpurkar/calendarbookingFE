import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class DataService {
  
  static colors = {
    green: "#6aa84f",
    yellow: "#f1c232",
    red: "#cc4125",
    gray: "#808080",
    blue: "#2e78d6",
  };

  events = [
  ];

  constructor(private http : HttpClient){
  }

  getEvents(): Observable<any[]> {
   
    // simulating an HTTP request
    return new Observable<any[]>((observer) => {
      this.http.get("http://10.0.120.113").subscribe(
        (data: any) => {
          const modifiedData = data.map((event: any) => {
            return {
              id: event.id,
              start: new DayPilot.Date(event.startTime),
              end: new DayPilot.Date(event.endTime),
              text: event.purposeOfBooking
              // Add more properties or modify existing ones as needed
            };
          });
          this.events = modifiedData;
          observer.next(modifiedData);
           // Emit the received data
           
          observer.complete(); // Complete the Observable
        },
        (error: any) => {
          observer.error(error); // Emit any errors
        }
      );
    });
  }

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());

  getColors(): any[] {
      const colors = [
        {name: "Green", id: DataService.colors.green},
        {name: "Yellow", id: DataService.colors.yellow},
        {name: "Red", id: DataService.colors.red},
        {name: "Gray", id: DataService.colors.gray},
        {name: "Blue", id: DataService.colors.blue},
      ];
      return colors;
  }

}

import {Component, ViewChild, AfterViewInit} from "@angular/core";
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotMonthComponent,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";
import {DataService} from "./data.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'calendar-component',
  template: `
    <div class="container">
      <div class="navigator">
        <daypilot-navigator [config]="configNavigator" [events]="events" [(date)]="date" (dateChange)="changeDate($event)" #navigator></daypilot-navigator>
      </div>
      <div class="content">
        <div class="buttons">
        <button (click)="viewDay()" [class]="this.configNavigator.selectMode == 'Day' ? 'selected' : ''">Day</button>
        <button (click)="viewWeek()" [class]="this.configNavigator.selectMode == 'Week' ? 'selected' : ''">Week</button>
        <button (click)="viewMonth()" [class]="this.configNavigator.selectMode == 'Month' ? 'selected' : ''">Month</button>
        </div>

        <daypilot-calendar [config]="configDay" [events]="events" #day></daypilot-calendar>
        <daypilot-calendar [config]="configWeek" [events]="events" #week></daypilot-calendar>
        <daypilot-month [config]="configMonth" [events]="events" #month></daypilot-month>
      </div>
    </div>

  `,
  styles: [`
    .container {
      display: flex;
      flex-direction: row;
    }

    .navigator {
      margin-right: 10px;
    }

    .content {
      flex-grow: 1;
    }

    .buttons {
      margin-bottom: 10px;
      display: inline-flex;
    }

    button {
      background-color: #3c78d8;
      color: white;
      border: 0;
      padding: .5rem 1rem;
      width: 80px;
      font-size: 15px;
      font-weight: 500;
      cursor: pointer;
      margin-right: 1px;
      transition: all 0.2s;
      box-shadow: 0 4px 6px rgba(0,0,0,0.08);
      box-sizing: border-box;
    }

    button:last-child {
      margin-right: 0;
    }

    button.selected {
      background-color: #1c4587;
      box-shadow: 0 3px 5px rgba(0,0,0,0.1);
    }

    button:first-child {
      border-top-left-radius: 30px;
      border-bottom-left-radius: 30px;
    }

    button:last-child {
      border-top-right-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    button:hover {
      background-color: #2f66c4;
      box-shadow: 0 5px 7px rgba(0,0,0,0.1);
    }

    button:active {
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

  `]
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("day") day!: DayPilotCalendarComponent;
  @ViewChild("week") week!: DayPilotCalendarComponent;
  @ViewChild("month") month!: DayPilotMonthComponent;
  @ViewChild("navigator") nav!: DayPilotNavigatorComponent;

  events: DayPilot.EventData[] = [];

  date = DayPilot.Date.today();
  serverAddress = 'http://10.0.120.113';

  contextMenu = new DayPilot.Menu({
    items: [
      {
        text: "Delete",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          console.log(event)
          dp.events.remove(event.cache.id);
          this.http.delete(this.serverAddress+`:8282/bookings/`+event.cache.id).subscribe((res)=>{
              console.log(res)
          })
        }
      },
      {
        text: "Edit...",
        onClick: async args => {
          const event = args.source;
          const dp = event.calendar;
          var items = [
            {
              name: "Start Time",
              id: "startTime",
              labelText: "Start Time:",
              dateFormat: "MM/dd/yyyy", 
              type: "datetime",
              value:  ''
            },
            {
              name: "End Time",
              id: "endTime",
              labelText: "End Time:",
              dateFormat: "MM/dd/yyyy",
              type: "datetime",
              value: ''
            }]
            const data = {
              startTime: event.data.start,
              endTime: event.data.end
            }
          dp.clearSelection();
          console.log(event.cache)
          var modal = await DayPilot.Modal.form(items,data);
          if (!modal.result) { return; }
          event.data.text = modal.result;
          console.log(modal)
          this.http.put(this.serverAddress+`:8282/bookings/${event.data.id}`,modal.result).subscribe((res) => {
            //console.log(res)
            this.loadEvents();
            this.http.get(this.serverAddress+`:8282/bookings`).subscribe(
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
           // Emit the received data
        },
        (error: any) => {
          console.error(error); // Emit any errors
        }
      );
          })
          dp.events.update(event);
        }
      },
      {
        text: "-"
      },
      {
        text: "Red",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.red;
          dp.events.update(event);
        }
      },
      {
        text: "Green",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.green;

          dp.events.update(event);
        }
      },
      {
        text: "Blue",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.blue;

          dp.events.update(event);
        }
      },
      {
        text: "Yellow",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.yellow;

          dp.events.update(event);
        }
      },

      {
        text: "Gray",
        onClick: args => {
          const event = args.source;
          const dp = event.calendar;
          event.data.backColor = DataService.colors.gray;

          dp.events.update(event);
        }
      }
    ]
  });

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 3,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: args => {
      this.loadEvents();
    }
  };

  selectTomorrow() {
    this.date = DayPilot.Date.today().addDays(1);
  }

  changeDate(date: DayPilot.Date): void {
    this.configDay.startDate = date;
    this.configWeek.startDate = date;
    this.configMonth.startDate = date;
  }

  configDay: DayPilot.CalendarConfig = {
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configWeek: DayPilot.CalendarConfig = {
    viewType: "Week",
    durationBarVisible: false,
    contextMenu: this.contextMenu,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onBeforeEventRender: this.onBeforeEventRender.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  configMonth: DayPilot.MonthConfig = {
    contextMenu: this.contextMenu,
    eventBarVisible: false,
    onTimeRangeSelected: this.onTimeRangeSelected.bind(this),
    onEventClick: this.onEventClick.bind(this),
  };

  constructor(private ds: DataService,private http : HttpClient) {
    this.viewWeek();
  }

  ngAfterViewInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    const from = this.nav.control.visibleStart();
    const to = this.nav.control.visibleEnd();
    console.log(this.ds)
    this.ds.getEvents().subscribe(result => {
      console.log(result)
      console.log(DayPilot.Date.today().firstDayOfWeek().addDays(1).addHours(15))
      this.events = result;
    });
  }

  viewDay():void {
    this.configNavigator.selectMode = "Day";
    this.configDay.visible = true;
    this.configWeek.visible = false;
    this.configMonth.visible = false;
  }

  viewWeek():void {
    this.configNavigator.selectMode = "Week";
    this.configDay.visible = false;
    this.configWeek.visible = true;
    this.configMonth.visible = false;
  }

  viewMonth():void {
    this.configNavigator.selectMode = "Month";
    this.configDay.visible = false;
    this.configWeek.visible = false;
    this.configMonth.visible = true;
    
  }

  onBeforeEventRender(args: any) {
      const dp = args.control;
      args.data.areas = [
        {
          top: 3,
          right: 3,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#minichevron-down-2",
          fontColor: "#fff",
          toolTip: "Show context menu",
          action: "ContextMenu",
        },
        {
          top: 3,
          right: 25,
          width: 20,
          height: 20,
          symbol: "assets/icons/daypilot.svg#x-circle",
          fontColor: "#fff",
          action: "None",
          toolTip: "Delete event",
          onClick: async (args: any)   => {
            dp.events.remove(args.source);
          }
        }
      ];

      args.data.areas.push({
        bottom: 5,
        left: 5,
        width: 36,
        height: 36,
        action: "None",
        // image: `https://picsum.photos/36/36?random=${args.data.id}`,
        // style: "border-radius: 50%; border: 2px solid #fff; overflow: hidden;",
      });
  }

  async onTimeRangeSelected(args: any) {
    // var html = '<div><label for="title">Event Title:</label><input type="text" id="title" value="Event 1"></div>' +
    //        '<div><label for="StartTime">Start Time:</label><input type="text" id="startTime" value=""></div>' + 
    //        '<div><label for="EndTime">End Time:</label><input type="text" id="endTime" value=""></div>' + 
    //        '<div><label for="EmployeeId">Employee ID:</label><input type="text" id="employeeId" value=""></div>';
    console.log("here",args)
    var items = [
      {
        name: "Start Time",
        id: "startTime",
        labelText: "Start Time:",
        dateFormat: "MM/dd/yyyy", 
        type: "datetime",
        value: "" 
      },
      {
        name: "End Time",
        id: "endTime",
        labelText: "End Time:",
        dateFormat: "MM/dd/yyyy", 
        type: "datetime",
        value: ""
      },
      {
        name: "Employee Id",
        id: "employeeId",
        labelText: "Employee ID:",
        type: "text",
        value: ""
      },
      {
        name: "Name",
        id: "name",
        labelText: "Name:",
        type: "text",
        value: ""
      },
      {
        name: "Department",
        id: "department",
        labelText: "Department:",
        type: "text",
        value: ""
      },
      {
        name: "Purpose Of Booking",
        id: "purposeOfBooking",
        labelText: "Purpose Of Booking:",
        type: "text",
        value: ""
      },
      {
      name: "Room",
      id: "meetingRoom",
      options:  [{
        name: 'BOARD ROOM',
        id: 1,
      },
      {
        name: 'MEETING ROOM',
        id: 2,
      },
      {
        name: 'CALL BOOTH 1',
        id: 3,
      },
      {
        name: 'CALL BOOTH 2',
        id: 4,
      }],
      type: "select",
      }
    ];
     //const m = await DayPilot.Modal.prompt("Create a new event:", "Event 1",);
    const dp = args.control;
    console.log("dp",dp);

    dp.minDate = new DayPilot.Date().toDate();
    
    dp.clearSelection();
    // if (!modal.result) { return; }
    var modal = await DayPilot.Modal.form(items); 
    
  //   dp.events.add(new DayPilot.Event({
  //     start: args.startTime,
  //     end: args.endTime,
  //     title: args.title,

  //     id: DayPilot.guid(),
  //     text: modal.result
  //   }));
  //   // this.http.post("")
  // }
  // modal.result.startTime = modal.result.startTime.slice(0, -3);
  // modal.result.endTime = modal.result.endTime.slice(0, -3);
  if(modal.result.meetingRoom == 1) {
    modal.result.meetingRoom =  {
      "id": 1,
      "roomType": "BOARD_ROOM"
  }
  }
  else if(modal.result.meetingRoom == 2) {
    modal.result.meetingRoom = {
      "id": 2,
      "roomType": "MEETING_ROOM"
  }
  }
  else if(modal.result.meetingRoom == 3) {
    modal.result.meetingRoom =  {
      "id": 3,
      "roomType": "CALL_BOOTH_1"
  }
  }
  else if(modal.result.meetingRoom == 4) {
    modal.result.meetingRoom ={
      "id": 4,
      "roomType": "CALL_BOOTH_2"
  }
  }
  console.log(modal.result)
this.http.post(this.serverAddress+`:8282/bookings/book`,modal.result).subscribe((res)=> {
  console.log(res),
  (error: any) => {
          alert(error); // Emit any errors
        }
})
}

  async onEventClick(args: any) {
    const form = [
      {name: "Text", id: "text"},
      {name: "Start", id: "start", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "End", id: "end", dateFormat: "MM/dd/yyyy", type: "datetime"},
      {name: "Color", id: "backColor", type: "select", options: this.ds.getColors()},
    ];

    const data = args.e.data;

    const modal = await DayPilot.Modal.form(form, data);

    if (modal.canceled) {
      return;
    }

    const dp = args.control;
    dp.events.update(modal.result);
  }


}
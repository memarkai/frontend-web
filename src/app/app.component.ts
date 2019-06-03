import { Component, OnInit } from '@angular/core';
import { AppointmentEntryService } from './services/appointment-entry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit{
  constructor(private api:AppointmentEntryService){
  }

  title = 'markai-gui';

  ngOnInit() {
    
    this.api.login().subscribe(data => {
      localStorage.setItem("token",data)
      var doutor1:Object = new Object();
      doutor1["crm"] = "1234356/PE";
      doutor1["name"] = "Jose Albino";
      doutor1["specialtyId"] = "bc062b46-4341-4246-b4af-e0a42908f937";
      this.api.criaMedico(doutor1).subscribe(data => {
        console.log(data);
      })})
  
  }

}

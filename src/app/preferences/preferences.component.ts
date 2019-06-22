import { Component, OnInit } from '@angular/core';

//Services
import { ClinicApiService } from '../services/clinic-api.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.css']
})
export class PreferencesComponent implements OnInit {

  public clinic: any = {};
  public plans: any = [];
  public plan: any = {};

  //Autocomplete
  keyword: any = 'name';
  public plansAdd: any[] = []; //Plans Add

  constructor(private clinicApiService: ClinicApiService) { }

  ngOnInit() { 
    this.getClinicInfo();
    this.getPlans();
    this.setupPlanInitialValue();
   }

  getClinicInfo(){
    this.clinicApiService.getClinicInformation().subscribe((data) => {
      this.clinic = data;
    });
  }

  getPlans(){
    this.clinicApiService.getAllPlans().subscribe((data) => {
      this.plans = data;
    });
  }

  selectEvent(item: any) {
    console.log("Selected item: ", item);
    const elem = this.plansAdd.find(a => a.name == item.name);
    if(!elem) this.plansAdd.push(item);
    this.setupPlanInitialValue();
  }
 
  onChangeSearch(val: string) {
    console.log("Changed Search: ", val);
  }
  
  onFocused(event: any){
    console.log("Get Focused: ", event);
  }

  setupPlanInitialValue(){
    this.plan = '';
  }

  updatePlans(){
    
  }

  removePlan(item: any){
    console.log("Remove item: ", item);
    this.plansAdd = this.plansAdd.filter((value) => {
      return value !== item;
    });
  }

}

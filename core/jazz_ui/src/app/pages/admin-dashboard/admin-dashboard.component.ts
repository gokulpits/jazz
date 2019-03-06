import {AfterViewChecked, AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ToasterService} from 'angular2-toaster';
import {AdminUtilsService} from '../../core/services/admin-utils.service';
import { RequestService } from '../../core/services/index';


@Component({
  selector: 'admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  providers: [RequestService],
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit{

  @ViewChild('jsonRoot') jsonRoot;
  public adminData;
  public isCollapsed = true;
  public state;
  public userData;
  check: boolean = false;
  isPUTLoading: boolean = false;
  private http: any;
 

  constructor(private adminUtils: AdminUtilsService,private request: RequestService, private toasterService: ToasterService,) {

    this.toasterService = toasterService;
    this.http = request;
  }

  ngOnInit() {
    this.state = 'loading';
    this.adminUtils.getJazzConfig()
      .then((data: any) => {
        this.state = 'resolved';
        this.adminData = data;
        this.getUsers();
      })
      .catch((error) => {
        console.log(error);
        this.state = 'error';
      })
  }

getUsers(){
  this.state = 'loading';
  this.adminUtils.getAdminUsers()
    .then((data: any) => {
      this.state = 'resolved';
      this.userData = data;
    })
    .catch((error) => {
      console.log(error);
      this.state = 'error';
    })
}

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    this.jsonRoot.setCollapse(this.isCollapsed);
  }

  
  checkValue(event,name){
    let payload = {};
      this.check = !event;
      if(this.check==false){
      payload['status'] = 0;
      }
      else{
        payload['status'] = 1;
      }

       this.isPUTLoading = true;
       this.http.put('/jazz/usermanagement/' +name,payload)
         .subscribe(
           (Response) => {
             console.log("response",Response)
             // debugger
             this.isPUTLoading = false;
            	 this.toasterService.pop('success',Response.data.message);
           },
           (Error) => {
           
             this.isPUTLoading = false;
            
           });

      }

}

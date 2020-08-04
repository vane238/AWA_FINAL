import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {RequestOptions, Request, RequestMethod} from '@angular/http';

import { FormsModule } from '@angular/forms';


@Component({
  // selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  user: UserDetails;
  courseCode
  courseName
  api
  course: any = { name: "", code: "" }
  sessionStatus: boolean = false
  newSyllabus = "";
  files: File[];
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private route: ActivatedRoute, private auth: AuthenticationService, private router: Router, private http: HttpClient) {
    this.route.params.subscribe(params => {
      this.courseCode = params.courseCode;
      this.course.code = params.courseCode;
      console.log("Requesting " + this.courseCode);
      this.http.get('/api/courseDetails/' + this.courseCode, this.httpOptions)
        .subscribe(res => {
          console.log(res);
          this.course = res;
        });
    });
    console.log("Course is " + this.courseCode);
  }
  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.user = user;
    }, (err) => {
      console.error(err);
    });

  }
  
  sendMessage() {
  }
  addNew(event) {
    if (event.keyCode == 13) {
      console.log("Enter pressed.");
      if (this.newSyllabus) {
        console.log("Adding Syllabus..");

        this.http.post('/api/addSyllabus',
          JSON.stringify({
            "course": this.course.code,
            "syllabus": this.newSyllabus
          }), this.httpOptions)
          .subscribe(res => {
            console.log(res);
            this.course = res;
          });
      }
    }

  }

  
  upload() {
   
let headers = new Headers();
        /** In Angular 5, including the header Content-Type can invalidate your request */
        headers.append('Content-Type', 'multipart/form-data');
        headers.append('Accept', 'application/json');
        /*let options = { headers: headers };*/
        let options = new RequestOptions({ headers: headers });

        let testData: FormData = new FormData();
        testData.append('file_upload', this.files[0], this.files[0].name);
        this.http.post('/api/upload', testData,options)
        
        .subscribe(response => {
          console.log(response);
        });
  }
  

  updateFiles(event ){
    if (event.target.files.length > 0) {
      console.log(event.target.files[0]);
      this.files = event.target.files;
    }
  }
}

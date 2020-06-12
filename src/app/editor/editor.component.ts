import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Url } from '../util/util';
import { stringify } from 'querystring';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  extractors = ['', 'Keep Everything Extractor', 'Article Extractor', 'Largest Content Extractor', 'Default Extractor'];
  outputFormats = ['', 'HTML', 'HTML Fragment', 'Text', 'JSON']

  value = '';
  displayDataExtraction = true;
  displayEditor = false;
  displaySuccessTranfer = false;

  url = "";
  extractor = "";
  outputFormat = "";

  constructor(private formBuilder: FormBuilder) { }

  valueChange(e: string) {
    this.value = e;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      url: ['https://theinnovativeeducator.blogspot.com/2018/05/8-tips-for-quality-posts-during.html', [Validators.required]],
      extractor: ['Default Extractor', Validators.required],
      outputFormat: ['JSON', Validators.required],
    });
  }

  onClickBack() {
    this.displayDataExtraction = true;
    this.displayEditor = false;
    this.displaySuccessTranfer = false;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  async postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  async postDataParams(url = '', data = {}) {
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data)// body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }


  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.url = this.registerForm.controls['url'].value;
    this.extractor = this.registerForm.controls['extractor'].value;
    this.outputFormat = this.registerForm.controls['outputFormat'].value;

    this.postData(environment.extractorEndPoint, {
      "url": this.url,
      "extractor": this.extractor,
      "outputformat": this.outputFormat
    }).then(res => {
      this.value = res.title + "/n" + res.extractedContent;
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;
    })
  }

  onClickCreateCourse() {
    let courseName = ""
    let courseShortName = ""
    let courseIdNumber = 2
    this.createCourse(courseName, courseShortName, environment.moodleWsCourseCategoryId, courseIdNumber);
  }

  // onClickAddDiscussion() {
  //   this.crea
  // }

  // onClickAddDiscussionPost() {
  //   this.crea
  // }

  // onClickAddNewWikiPage() {

  // }

  // onClickAddContentToWikiPage() {

  // }

  createCourse(courseName: string, courseShortName: string, courseCategoryId: number, courseIdNumber: number) {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "courses[0][fullname]", courseName);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][shortname]", courseShortName);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][categoryid]", courseCategoryId);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][idnumber]", courseIdNumber);
    apiCallUrl = Url.addParam(apiCallUrl, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncCreateCourse);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    console.log("apiCallUrl", apiCallUrl);
    debugger

    this.postDataParams(apiCallUrl).then(res => {
      console.log("apiCallUrl", apiCallUrl);
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    })

  }

  addDiscussion() {


  }

  addDiscussionPost() {


  }


}

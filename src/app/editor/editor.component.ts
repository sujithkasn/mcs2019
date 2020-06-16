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
  contentForm: FormGroup;
  kendoEditorForm: FormGroup;
  submitted = false;
  libraries = ['', 'Boilerpipe', 'BoilerPy3', 'BeautifulSoup'];
  beautifulSoupExtractors = ['N/A'];
  boilerpipeExtractors = ['', 'Default Extractor', 'Article Extractor', 'Largest Content Extractor', 'Keep Everything Extractor'];
  boilerPy3Extractors = ['', 'Default Extractor', 'Article Extractor', 'Article Sentences Extractor', 'Largest Content Extractor', 'Canola Extractor', 'Keep Everything Extractor', 'Num Words Rules Extractor'];
  outputFormats = ['', 'HTML', 'HTML Fragment', 'Text', 'JSON'];

  extractors = this.boilerpipeExtractors;

  title = '';
  content = '';
  displayDataExtraction = true;
  displayEditor = false;
  displaySuccessTranfer = false;
  createdItem = '';
  tranferError = '';
  transferMessage = '';

  url = "";
  library = "";
  extractor = "";
  outputFormat = "";

  constructor(private formBuilder: FormBuilder) { }

  valueChange(e: string) {
    this.content = e;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      url: ['https://theinnovativeeducator.blogspot.com/2018/05/8-tips-for-quality-posts-during.html', [Validators.required]],
      library: ['Boilerpipe', Validators.required],
      extractor: ['Default Extractor', Validators.required],
      outputFormat: ['HTML', Validators.required],
    });
    this.contentForm = this.formBuilder.group({
      title: ['', [Validators.required]],
    });
    this.kendoEditorForm = this.formBuilder.group({
      kendoEditor: ['', [Validators.required]],
    });
  }

  // convenience getter for easy access to form fields
  get regForm() { return this.registerForm.controls; }

  // get contForm() { return this.contForm.controls; }

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

  onLibraryChange() {
    switch (this.registerForm.controls['library'].value) {
      case 'Boilerpipe':
        this.extractors = this.boilerpipeExtractors;
        this.registerForm.controls['extractor'].setValue(this.extractors[1]);
        break;

      case 'BoilerPy3':
        this.extractors = this.boilerPy3Extractors;
        this.registerForm.controls['extractor'].setValue(this.extractors[1]);
        break;

      case 'BeautifulSoup':
        this.extractors = this.beautifulSoupExtractors;
        this.registerForm.controls['extractor'].setValue(this.extractors[0]);
        break;

      case '':
        this.extractors = [];
        break;

      default:
        break;
    }
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.url = this.registerForm.controls['url'].value;
    this.library = this.registerForm.controls['library'].value;
    this.extractor = this.registerForm.controls['extractor'].value;
    this.outputFormat = this.registerForm.controls['outputFormat'].value;

    this.postData(environment.extractorEndPoint, {
      "url": this.url,
      "library": this.library,
      "extractor": this.extractor,
      "outputformat": this.outputFormat
    }).then(res => {
      this.title = res.title;
      this.contentForm.controls['title'].setValue(this.title);
      this.kendoEditorForm.controls['kendoEditor'].setValue(res.content);
      this.content = res.content;
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;

      // this.kendoEditorForm.controls['kendoEditor'].updateValueAndValidity({ onlySelf: true, emitEvent: true });
    })
    this.valueChange(this.kendoEditorForm.controls['kendoEditor'].value);
  }

  onClickBack(step: number) {
    if (step == 0) {
      this.displayDataExtraction = true;
      this.displayEditor = false;
      this.displaySuccessTranfer = false;
      this.transferMessage = '';
      this.createdItem = '';
    } else if (step == 1) {
      this.displayDataExtraction = false;
      this.displayEditor = true;
      this.displaySuccessTranfer = false;
      this.transferMessage = '';
      this.createdItem = '';
    }
  }

  onClickCreateCourse() {
    // TODO: To be replaced from the input from front end
    let courseName = "DEMO Course 2"
    let courseShortName = "DEMO 2"
    let courseIdNumber = 2
    this.createdItem = "Course";
    this.createCourse(courseName, courseShortName, environment.moodleWsCourseCategoryId, courseIdNumber);
  }

  onClickAddDiscussion() {
    this.createdItem = "Forum Discussion";
    this.addDiscussion();
  }

  onClickAddDiscussionPost() {
    this.createdItem = "Discussion Post";
    this.addDiscussionPost();
  }

  // onClickAddNewWikiPage() {
  // this.createdItem = "New Wiki Page";

  // }

  // onClickAddContentToWikiPage() {
  // this.createdItem = "Wiki page content";

  // }

  createCourse(courseName: string, courseShortName: string, courseCategoryId: number, courseIdNumber: number) {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncCreateCourse);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][fullname]", encodeURIComponent(courseName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][shortname]", encodeURIComponent(courseShortName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][categoryid]", courseCategoryId);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][idnumber]", courseIdNumber);

    this.postDataParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.message;
        this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
      }
      else if (res[0]) {
        this.tranferError = ''
        this.transferMessage = 'New Course: ' + res[0].id + ' with Short name ' + res[0].shortname + 'has been successfully created...!';
      }
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    });
  }

  addDiscussion() {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussion);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    // TODO: To be replaced from the input from front end
    apiCallUrl = Url.addParam(apiCallUrl, "forumid", environment.moodleWsForumId);
    apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent('DEMO Forum Discussion'));
    apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

    this.postDataParams(apiCallUrl).then(res => {
       if (res.exception) {
        this.tranferError = res.message;
        this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
      }
      else if (res) {
        this.tranferError = ''
        this.transferMessage = 'Forum Discussion: ' + res.discussionid + ' has been successfully added...!';
      }
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    })
  }

  addDiscussionPost() {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussionPost);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    apiCallUrl = Url.addParam(apiCallUrl, "postid", environment.moodleWsDiscussionId);
    // TODO: To be replaced from the input from front end
    apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent('DEMO Forum Discussion Post'));
    apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

    this.postDataParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.message;
        this.transferMessage = res.exception + ' - ' + res.errorcode + ' - ' + res.message;
      }
      else if (res) {
        this.tranferError = ''
        this.transferMessage = 'Forum Discussion post: ' + res.postid + ' has been successfully added...!';
      }
      this.displaySuccessTranfer = true;
      this.displayEditor = false;
      this.displayDataExtraction = false;
    })
  }
}

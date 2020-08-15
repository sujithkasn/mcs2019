import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Url } from '../util/util';
import { stringify } from 'querystring';
import { DataService } from '../services/data.service';
import { Observable, of } from 'rxjs';



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

  libraries = ['', 'Readability', 'Boilerpipe', 'Newspaper'];
  noExtractors = ['N/A'];
  boilerpipeExtractors = ['', 'Default Extractor', 'Article Extractor', 'Largest Content Extractor', 'Keep Everything Extractor'];
  outputFormats = ['']
  readabilityOutputFormats = ['HTML'];
  boilerpipeOutputFormats = ['', 'HTML', 'HTML Fragment', 'Text', 'JSON'];
  newspaperOutputFormats = ['HTML', 'Text'];

  extractors = this.noExtractors;

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

  //Create Course Dialog
  public createCourseDialogOpened = false;
  public courseCategories$: Observable<any>;
  public courseToCreate = {
    courseName: '',
    courseShortName: '',
    courseCategory: null,
    courseIdNumber: ''
  };

  //Create Forum Discussion Dialog
  public createForumDiscussionDialogOpened = false;
  public courses$: Observable<any>;
  public courseForums$: Observable<any>;
  public forumDiscussionToCreate = {
    course: null,
    forum: null
  };

  constructor(private formBuilder: FormBuilder, private dataService: DataService) { }

  valueChange(e: string) {
    this.content = e;
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      url: ['http://techblogs/uxx/?p=7454', [Validators.required]],
      library: ['Readability', Validators.required],
      extractor: ['N/A', Validators.required],
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

  onLibraryChange() {
    switch (this.registerForm.controls['library'].value) {
      case 'Readability':
        this.extractors = this.noExtractors;
        this.outputFormats = this.readabilityOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[0]);
        this.registerForm.controls['outputFormat'].setValue(this.outputFormats[0]);
        break;

      case 'Boilerpipe':
        this.extractors = this.boilerpipeExtractors;
        this.outputFormats = this.boilerpipeOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[1]);
        break;

      case 'Newspaper':
        this.extractors = this.noExtractors;
        this.outputFormats = this.newspaperOutputFormats;
        this.registerForm.controls['extractor'].setValue(this.extractors[0]);
        this.registerForm.controls['outputFormat'].setValue(this.outputFormats[0]);
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

    this.url = this.registerForm.controls['url'].value;
    this.library = this.registerForm.controls['library'].value;
    this.extractor = this.registerForm.controls['extractor'].value;
    this.outputFormat = this.registerForm.controls['outputFormat'].value;

    this.dataService.postDataWithParams(environment.extractorEndPoint, {
      "url": this.url,
      "library": this.library,
      "extractor": this.extractor,
      "outputformat": this.outputFormat
    }).then(res => {
      // Adding Library and extractor to the title
      if (this.extractor != "" && this.extractor != "N/A") {
        this.title = res.title + " : (" + this.library + " - " + this.extractor + ")";
      }
      else {
        this.title = res.title + " : (" + this.library + ")";
      }

      this.contentForm.controls['title'].setValue(this.title);
      this.kendoEditorForm.controls['kendoEditor'].setValue(res.content);
      this.content = res.content;
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;
    }).finally(() => {
      this.displayEditor = true;
      this.displayDataExtraction = false;
      this.displaySuccessTranfer = false;
    });
  }

  onClickBack(step?: number) {
    if (step == 0) {
      this.displayDataExtraction = true;
      this.displayEditor = false;
    } else if (step == 1) {
      this.displayDataExtraction = false;
      this.displayEditor = true;
    }
    this.displaySuccessTranfer = false;
    this.tranferError = '';
    this.transferMessage = '';
    this.createdItem = '';
  }

  public onCreateCourseDialogOpen() {
    this.courseToCreate = {
      courseName: '',
      courseShortName: '',
      courseCategory: null,
      courseIdNumber: ''
    };
    this.createCourseDialogOpened = true;
    this.createdItem = "Course";
    of(this.dataService.getCourseCategories()).subscribe(categories => {
      this.courseCategories$ = categories;
    });
  }

  public submitCreateCourse() {
    const { courseName, courseShortName, courseCategory, courseIdNumber } = this.courseToCreate;
    this.createCourse(courseName, courseShortName, courseCategory.id, Number(courseIdNumber));
  }

  public onCreateCourseDialogClose() {
    this.createCourseDialogOpened = false;
    this.onClickBack();
  }

  public createForumDiscussionDialogOpen() {
    this.forumDiscussionToCreate = {
      course: null,
      forum: null
    };
    this.createForumDiscussionDialogOpened = true;
    this.createdItem = "Forum Discussion";
    of(this.dataService.getCourses()).subscribe(courses => {
      this.courses$ = courses;
    });
    this.onCourseChange();
  }

  public onCourseChange() {
    of(this.dataService.getCourseForums(this.forumDiscussionToCreate.course)).subscribe(courseForums => {
      this.courseForums$ = courseForums;
    });
  }

  public submitCreateForumDiscussion() {
    const { course, forum } = this.forumDiscussionToCreate;
    this.createForumDiscussion(Number(this.forumDiscussionToCreate.forum.id));
  }

  public onCreateForumDiscussionDialogClose() {
    this.createForumDiscussionDialogOpened = false;
    this.onClickBack();
  }

  createCourse(courseName: string, courseShortName: string, courseCategoryId: number, courseIdNumber: number) {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncCreateCourse);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][fullname]", encodeURIComponent(courseName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][shortname]", encodeURIComponent(courseShortName));
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][categoryid]", courseCategoryId);
    apiCallUrl = Url.addParam(apiCallUrl, "courses[0][idnumber]", courseIdNumber);

    this.dataService.postDataWithParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.exception;
        this.transferMessage = res.message;
      }
      else if (res[0]) {
        this.tranferError = ''
        this.transferMessage = 'New Course: \"' + res[0].id + '\" with Short name \"' + res[0].shortname + '\" has been created successfully.';
      }
    });
  }

  createForumDiscussion(forumId: number) {
    let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
    apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussion);
    apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
    apiCallUrl = Url.addParam(apiCallUrl, "forumid", forumId);
    apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent(this.title));
    apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

    this.dataService.postDataWithParams(apiCallUrl).then(res => {
      if (res.exception) {
        this.tranferError = res.exception;
        this.transferMessage = res.message;
      }
      else if (res) {
        this.tranferError = ''
        this.transferMessage = 'Forum Discussion: \"' + res.discussionid + '\" has been created successfully.';
      }
    });
  }


  // addDiscussionPost(discussionPostId: number) {
  //   let apiCallUrl = Url.addParam(environment.moodleEndPoint, "wstoken", environment.moodleWsToken);
  //   apiCallUrl = Url.addParam(apiCallUrl, "wsfunction", environment.moodleWsFuncForumAddDiscussionPost);
  //   apiCallUrl = Url.addParam(apiCallUrl, "moodlewsrestformat", environment.moodleWsRestFormat);
  //   apiCallUrl = Url.addParam(apiCallUrl, "postid", discussionPostId);
  //   apiCallUrl = Url.addParam(apiCallUrl, "subject", encodeURIComponent(this.title));
  //   apiCallUrl = Url.addParam(apiCallUrl, "message", encodeURIComponent(this.content));

  //   this.dataService.postDataWithParams(apiCallUrl).then(res => {
  //     if (res.exception) {
  //       this.tranferError = res.exception;
  //       this.transferMessage = res.message;
  //     }
  //     else if (res) {
  //       this.tranferError = ''
  //       this.transferMessage = 'Forum Discussion post: ' + res.postid + ' has been added successfully.';
  //     }
  //     this.displaySuccessTranfer = true;
  //     this.displayEditor = false;
  //     this.displayDataExtraction = false;
  //   })
  // }

  // onClickAddNewWikiPage() {
  // this.createdItem = "New Wiki Page";
  // }
  // onClickAddContentToWikiPage() {
  // this.createdItem = "Wiki page content";
  // }
}

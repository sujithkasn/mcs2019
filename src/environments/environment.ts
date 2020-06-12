// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  extractorEndPoint: 'http://localhost:8000/demo/extract_content_api/',
  moodleEndPoint:'http://cmbgseapp1636/moodle/webservice/rest/server.php',
  moodleWsToken: '38091c6777f2ac297655b12c1fba35e7',
  moodleWsRestFormat: 'json',
  moodleWsFuncCreateCourse: 'core_course_create_courses',
  moodleWsFuncForumAddDiscussion: 'mod_forum_add_discussion',
  moodleWsFuncForumAddDiscussionPost: 'mod_forum_add_discussion_post',
  moodleWsCourseCategoryId: 13,
  moodleWsForumId: 8,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

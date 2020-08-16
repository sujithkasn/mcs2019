// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  extractorEndPoint: 'http://localhost:8000/demo/extract_content_api/',
  moodleBaseUrl: 'http://localhost:8080/moodle/',
  moodleEndPoint:'http://localhost:8080/moodle/webservice/rest/server.php',
  moodleWsToken: 'f644a958bbb0b5836070680831d15b35',
  moodleWsRestFormat: 'json',
  moodleWsFuncGetCourseCategories: 'core_course_get_categories',
  moodleWsFuncCreateCourse: 'core_course_create_courses',
  moodleWsFuncGetCourses: 'core_course_get_courses_by_field',
  moodleWsFuncGetForums: 'mod_forum_get_forums_by_courses',
  moodleWsFuncForumAddDiscussion: 'mod_forum_add_discussion',
  moodleWsFuncForumAddDiscussionPost: 'mod_forum_add_discussion_post',
  moodleCourseUrl: 'http://localhost:8080/moodle/course/view.php?id=',
  moodleForumDiscussionUrl: 'http://localhost:8080/moodle/mod/forum/discuss.php?d=',
  
  // moodleWsCourseCategoryId: 13,
  // moodleWsForumId: 43,
  // moodleWsDiscussionId: 87,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

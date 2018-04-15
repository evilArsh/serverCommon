'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    // const jsonp=app.jsonp();
    const { router, controller } = app;
    //cm
    router.resources('cm','/api/cm', controller.cm);
    router.resources('user', '/api/user', controller.user);
    router.resources('signIn', '/api/signIn', controller.signIn);
    router.resources('signUp', '/api/signUp', controller.signUp);
    router.resources('token', '/api/token', controller.token);
    //jaa
    router.resources('aa', '/api/aa', controller.aa);
    router.resources('resources', '/api/'+app.config.sourceDir, controller.resources);
};
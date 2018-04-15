'use strict';
const path = require('path');
const fs = require('fs');

const Controller = require('egg').Controller;
class ResourcesController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    async show(){
        // this.app.config.static.dir
        const { ctx ,app} = this;
        const uri=ctx.params.id;
        var baseDir=this.app.baseDir+'\\';
        baseDir=app.config.sourceDir;
        const filePath = path.resolve(baseDir, uri);
        this.ctx.attachment(uri);
        this.ctx.set('Content-Type', 'application/octet-stream');
        this.ctx.body = fs.createReadStream(filePath);
    }
}
module.exports = ResourcesController;
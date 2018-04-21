'use strict';
const Controller = require('egg').Controller;
class AAController extends Controller {
    constructor(ctx) {
        super(ctx);
    }
    //参数?func=''?
    //万能函数=_=
    async create() {
        const {
            ctx,
            app
        } = this;
        try {

            let result;
            let func = ctx.query.func;
            ctx.helper.xssFilter(ctx.query);
            switch (func) {
                case "setMsg": ctx.body = await ctx.service.aa.upLoadMsg(ctx.query); break;
                case "userUpload": ctx.body = await ctx.service.aa.userUpload(ctx.query); break;

                case "setBoard": ctx.body = await ctx.service.aa.getBoard(); break;
                case "delProject": ctx.body = await ctx.service.aa.delProject(ctx.request.body); break;
                case "delProjectU": ctx.body = await ctx.service.aa.delProjectU(ctx.request.body); break;
                case "check": ctx.body = await ctx.service.aa.check(ctx.request.body); break;
                case "getBoard": ctx.body = await ctx.service.aa.setBoard(); break;
                case "change": ctx.body = await ctx.service.aa.change(ctx.request.body); break;
                default:
                    ctx.body = {success:false,data:'请求出错'};
            }
        } catch (err) {
            console.log(err);

            ctx.body = {success:false,data:'请求出错'};
        }
    }
    async index(){
        const {
            ctx,
            app
        } = this;
        try {

            let result;
            let func = ctx.query.func;
            
            ctx.helper.xssFilter(ctx.query);
            ctx.helper.xssFilter(ctx.params.id)
            switch (func) {
                case "getMsg": ctx.body = await ctx.service.aa.getMsg(ctx.query); break;
                case "getContent": ctx.body = await ctx.service.aa.getContent(ctx.query.id); break;
                case "fileManage": ctx.body = await ctx.service.aa.fileManage(ctx.query); break;

                case "getBoard": ctx.body = await ctx.service.aa.setBoard(); break;
                case "getUserData": ctx.body = await ctx.service.aa.getUserData(ctx.query); break;
                default:
                    ctx.body = "{success:false,data:'请求出错'}";
            }
        } catch (err) {
            console.log(err);

            ctx.body = "{success:false,data:'请求出错'}";
        }
    }

}
module.exports = AAController;
'use strict';
const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const formidable = require("formidable");
const awaitWriteStream = require('await-stream-ready').write;
const sendToWormhole = require('stream-wormhole');
class AaService extends Service {
    //是否成功 提示信息 返回数据
    async setStatus(su, da, pa) {
        var d = {
            success: su,
            data: da,
        };
        if (pa) {
            d.package = pa;
        }
        return d;
    }
    //设置用户身份
    async setIdentify(data) {
        const {
            ctx,
            app
        } = this;
        try {
            var d = data.isAdmin === true ? "Y" : "N";
            console.log('d:' + d);

            await app.mysql.update('user_verify', {
                userIsAdmin: d
            }, {
                    where: {
                        userMail: data.userMail
                    }
                })
        } catch (err) {
            console.log(err);

        }
    }
    //竞赛信息
    async getMsg(data) {
        const { ctx, app } = this;
        try {
            let type=data.type;
            
            let {queryAfter, number } = ctx.helper.reqParamSet(data);
            queryAfter=parseInt(queryAfter); 
            number=parseInt(number); 
            const result = await app.mysql.select('matchs', {
                columns: ['id','type', 'title', 'content', 'imageURI', 'fileURI','time'],
                orders: [ 
                    ['id', 'desc']
                ],
                where:{
                    'type':type
                },
                limit: number,
                offset: queryAfter
            });
            let sql=`select count(id)as number from matchs WHERE type='竞赛信息'`;
            let count =await app.mysql.query(sql);
            result.push(count[0].number)
            
            // console.log(Object.assign({},count,result));
            
            return this.setStatus(true,'获取数据成功',result);
        } catch (err) {
            throw err;
        }
    }
    async getContent(id) {
        const { ctx, app } = this;
        try {
            const result = await app.mysql.select('matchs', {
                columns: ['content','time'],
                where:{
                    'id':id
                }
            });
            if(result.length){
                return this.setStatus(true,'获取数据成功',result[0]);
            }
            return this.setStatus(false,'获取数据失败');
        } catch (err) {
            throw err;
        }
    }
    async upLoadMsg(param) {
        const {
            ctx,
            app
        } = this;
        let usable=await ctx.service.token.isTokenUsable();
        if(!usable){
            return ctx.helper.errorUserIdentify(app.config.ERROR_USER_IDENTIFY);
        }
        const parts = this.ctx.multipart({ autoFields: true });
        let part;
        let result;
        let files = [];
        let type = param.type,
            title = param.title,
            content,
            imageURI,
            fileURI;
        console.log('参数:', param);
        var form = new formidable.IncomingForm();
        form.parse(ctx.req, async function (err, fields, files) {
            if (err) {
                throw err;
            }
            content = fields.content;
        });
        try {
            while ((part = await parts()) !== null) {

                if (typeof part === 'object' && 'undefined' !== typeof part.filename) {
                    const fn = part.filename.toLowerCase();
                    switch (part.fieldname) {
                        case 'file': fileURI = part.filename; break;
                        case 'image': imageURI = part.filename; break;
                    };
                    const target = path.join(this.config.baseDir, app.config.sourceDir, fn);
                    const writeStream = fs.createWriteStream(target);
                    await awaitWriteStream(part.pipe(writeStream));
                    files.push(part.filename)
                }
                if (typeof part !== 'object') break;
            }
            //插入数据库
            let rst = await app.mysql.insert('matchs', {
                'type': type,
                'title': title,
                'content': content,
                'imageURI': imageURI,
                'fileURI': fileURI,
                'time': ctx.helper.dateFormate('yyyy-MM-dd', new Date())
            })
            console.log(rst);

            if (rst.affectedRows === 1) {
                return this.setStatus(true, '文件上传成功', files)
            }
            return this.setStatus(true, '文件上传失败', files)
        } catch (err) {
            console.log("uploadERR:", err);
            if (typeof part === 'object') {
                await sendToWormhole(part);
            }
            throw err;
        }
    }

    async getBoard() {
        const {
            ctx,
            app
        } = this;

        try {

        } catch (err) {

        }
    }
    async setBoard() {
        const {
            ctx,
            app
        } = this;

        try {

        } catch (err) {

        }
    }
};
module.exports = AaService;
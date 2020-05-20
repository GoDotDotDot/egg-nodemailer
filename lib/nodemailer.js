"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const nodemailer = require("nodemailer");
const juice = require("juice");
const fs = require("fs");
const path = require("path");
const util = require("util");
const readFile = util.promisify(fs.readFile);
class NodeEmail {
    constructor(config, app) {
        this.config = config;
        this.app = app;
    }
    getConfig() {
        return this.config;
    }
    getApp() {
        return this.app;
    }
    /**
     * 发送邮件
     * @param mailOptions 邮件配置项
     * @param transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
     * @param config 可选，SMTP 连接配置项，未赋值时，将会取 nodemailer 配置
     * @param defaults 可选，SMTP transport options
     * @return object { content: 邮件内容, result: 邮件发送结果 }
     */
    sendMail({ mailOptions, transport, config, defaults, } = { mailOptions: {} }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const _transport = transport || this.createTransport(config || this.config, defaults);
            const options = mailOptions;
            const { htmlTemplateName, htmlTemplateData, text, htmlTemplateDir } = options;
            let html;
            if (htmlTemplateName) {
                html = yield readFile(htmlTemplateDir ? path.join(htmlTemplateDir, htmlTemplateName) : path.join(__dirname, '../html-template', htmlTemplateName), 'utf8');
                html = juice(html);
                const ctx = this.app.createAnonymousContext();
                html = yield ctx.renderString(html, htmlTemplateData, {
                    viewEngine: 'ejs',
                });
                options.html = html;
            }
            return {
                content: html || text,
                result: yield _transport.sendMail(options),
            };
        });
    }
    /**
     * 创建 SMTP transport
     * @param config 可选，SMTP transport 邮箱服务器配置项，未赋值时，将会取 nodemailer 配置
     * @param defaults 可选，SMTP transport options
     */
    createTransport(config, defaults) {
        const transport = nodemailer.createTransport(config || this.config, defaults);
        return transport;
    }
    /**
     * 验证 SMTP 邮件服务器配置是否可用
     * @param _transport 可选，SMTP transport 对象，未赋值时，将会根据 nodemailer 配置自动创建
     */
    verify(_transport) {
        const transport = _transport || this.createTransport();
        return transport.verify();
    }
}
exports.default = NodeEmail;

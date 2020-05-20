import { Singleton, Singleton, Singleton } from 'egg';
import SMTPTransport = require('nodemailer/lib/smtp-transport');

import { SendMailOptions } from 'nodemailer';
import NodeEmail from './lib/nodemailer';

declare module 'egg' {
  interface Application {
    nodemailer: NodeMailer;
  }

  interface NodeMailer extends Singleton, NodeEmail {
    get(id: string): NodeEmail;
  }

  interface EggAppConfig {
    nodemailer: {
      client: SMTPTransport | SMTPTransport.Options | NodeEmailConfig;
      clients?: {
        [key: string]: SMTPTransport | SMTPTransport.Options | NodeEmailConfig;
      };
    };
  }
}

export interface NodeEmailConfig {
  htmlTemplateDir: string;
}
export interface NodeMailerOptions extends SendMailOptions {
  htmlTemplateName?: string;
  htmlTemplateData?: object;
}

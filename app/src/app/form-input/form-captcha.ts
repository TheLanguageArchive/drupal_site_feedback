export interface CaptchaOptions {

    type: string;
    csid: number;
    token: string;
    response: string;
    html: string;
};

export class FormCaptcha {

    type: string;
    csid: number;
    token: string;
    response: string;
    html: string;

    constructor(captcha: CaptchaOptions) {

        this.type       = captcha.type;
        this.csid       = captcha.csid;
        this.token      = captcha.token;
        this.response   = captcha.response;
        this.html       = captcha.html;
    }
};

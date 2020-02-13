import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormInputGroup, FormInputTextfield, FormInputEmail } from '../form-input';
import { FormInputTextarea, FormCaptcha, CaptchaOptions } from '../form-input';
import { FormInputHidden } from '../form-input';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CaptchaService } from './captcha.service';
import { FormGroup } from '@angular/forms';

export interface DrupalSiteFeedbackErrorInterface {

    type: 'error';
    message: string;
};

export interface DrupalSiteFeedbackSuccessInterface {

    type: 'success';
    message: {

        id: string;
        title: string;
        components: {
            [key: number]: FormInputGroup
        };
        captcha: CaptchaOptions | false;
    };
};

@Injectable()
export class DrupalApiService {

    static WEBFORM_FETCHED    = 1001;
    static WEBFORM_NOT_FOUND  = 1002;
    static SUBMISSION_SUCCESS = 1003;
    static CAPTCHA_INVALID    = 1004;

    url: string;

    constructor(private http: HttpClient, private captchaService: CaptchaService) {
    }

    setUrl(url: string) {
        this.url = url;
    }

    getForm(): Observable<FormInputGroup> {

        return this.http
            .get(this.url, {params: {req: encodeURIComponent(window.location.href)}})
            .pipe(
                map(data => this.serialize(data as DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface))
            );
    }

    submitForm(input: FormInputGroup, manager: FormGroup) {

        let params = {

            ds_feedback: manager.value,
            captcha: this.captchaService.getParams(input, manager),
        };

        return this.http
            .post(`${this.url}/create`, params);
    }

    serialize(data: DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface)
    {
        if (data.type === 'error') {
            throw new Error(data.message as string);
        }

        let total      = Object.values(data.message.components).length;
        let captcha    = 0;
        let components = [];

        for (let idx in data.message.components) {

            let component = data.message.components[idx];
            let items     = [];

            for (let item of component.items) {

                let input = null;
                if (item.type === 'textfield') {
                    input = new FormInputTextfield(item);
                }

                if (item.type === 'textarea') {
                    input = new FormInputTextarea(item);
                }

                if (item.type === 'email') {
                    input = new FormInputEmail(item);
                }

                if (item.type === 'hidden') {
                    input = new FormInputHidden(item);
                }

                if (null !== input) {
                    items.push(input);
                }
            }

            if (items.length > 0) {

                let options = {

                    order: component.order,
                    captcha: null,
                };

                captcha += 1;
                if (captcha === total && false !== data.message.captcha) {
                    options.captcha = new FormCaptcha(data.message.captcha);
                }

                components.push(new FormInputGroup(component.key, component.title, items, options));
            }
        }

        return new FormInputGroup(data.message.id, data.message.title, components);
    }
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormInputGroup, FormInputTextfield, FormInputEmail, FormInputTextarea, FormCaptcha, CaptchaOptions } from '../form-input';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

    url: string;

    constructor(private http: HttpClient) {
    }

    setUrl(url: string) {
        this.url = url;
    }

    getForm(): Observable<FormInputGroup> {

        return this.http
            .get(this.url)
            .pipe(
                map(data => this.serialize(data as DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface))
            );
    }

    submitForm(input: FormInputGroup, data: {}) {

        let params = {

            ds_feedback: data,
            captcha: null,
        };

        if (input.items[0].captcha) {

            let form = Object.values(data) as [{captcha: string}];

            params.captcha = {

                sid: input.items[0].captcha.csid,
                token: input.items[0].captcha.token,
                response: form[0].captcha,
            };
        }

        return this.http
            .post(`${this.url}/create`, params);
    }

    serialize(data: DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface)
    {
        if (data.type === 'error') {
            throw new Error(data.message as string);
        }

        let captcha      = false;
        const components = [];

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

                if (null !== input) {
                    items.push(input);
                }
            }

            if (items.length > 0) {

                let options = {

                    order: component.order,
                    captcha: null,
                };

                if (false === captcha && false !== data.message.captcha) {

                    captcha         = true;
                    options.captcha = new FormCaptcha(data.message.captcha);
                }

                components.push(new FormInputGroup(component.key, component.title, items, options));
            }
        }

        return new FormInputGroup(data.message.id, data.message.title, components);
    }
};

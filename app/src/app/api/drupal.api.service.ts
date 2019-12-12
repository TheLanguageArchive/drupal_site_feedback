import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormInputGroup, FormInputTextfield, FormInputEmail, FormInputTextarea } from '../form-input';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DrupalSiteFeedbackErrorInterface {

    type: 'error';
    message: string;
}

export interface DrupalSiteFeedbackSuccessInterface {

    type: 'success';
    message: {

        id: string;
        title: string;
        components: {
            [key: number]: FormInputGroup
        };
    };
}

@Injectable({
    providedIn: 'root'
})
export class DrupalApiService {

    constructor(private http: HttpClient) {
    }

    getForm(): Observable<FormInputGroup> {

        return this.http
            .get('http://localhost/flat/ds_feedback/295')
            .pipe(
                map(data => this.serialize(data as DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface))
            );
    }

    submitForm(data: {}) {

        return this.http
            .post('http://localhost/flat/ds_feedback/295/create', {ds_feedback: data});
    }

    serialize(data: DrupalSiteFeedbackSuccessInterface | DrupalSiteFeedbackErrorInterface)
    {
        if (data.type === 'error') {
            throw new Error(data.message as string);
        }

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

                components.push(new FormInputGroup(component.key, component.title, items, {
                    order: component.order
                }));
            }
        }

        return new FormInputGroup(data.message.id, data.message.title, components);
    }
}

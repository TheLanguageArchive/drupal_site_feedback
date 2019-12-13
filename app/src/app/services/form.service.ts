import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormInputGroup, FormInputEmail } from '../form-input';

@Injectable()
export class FormService {

    constructor(private fb: FormBuilder) {
    }

    buildManager(form: FormInputGroup) {

        let manager = this.fb.group({});

        form.items.forEach((input: FormInputGroup) => {

            let group = this.fb.group({});

            input.items.forEach((item) => {

                let validators = [];
                if (true === item.required) {
                    validators.push(Validators.required);
                }

                if ((item as FormInputEmail).type !== 'undefined' && (item as FormInputEmail).type === 'email') {
                    validators.push(Validators.email);
                }

                group.addControl(item.key, this.fb.control('', validators));
            });

            manager.addControl(input.key, group);
        });

        return manager;
    }
}

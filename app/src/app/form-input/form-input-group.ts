import { FormInputControl, FormInputControlOptions } from './form-input-control';

export class FormInputGroup extends FormInputControl<string> {

    type = 'fieldset';

    title: string;
    items: FormInputControl<any>[];

    constructor(key: string, title: string, items: FormInputControl<any>[], options: FormInputControlOptions<string> = {}) {

        super(options);

        this.key   = options.key || key;
        this.title = title;
        this.items = items;
    }
}

import { FormInputControl, FormInputControlOptions } from './form-input-control';

export class FormInputTextfield extends FormInputControl<string> {

    type = 'textfield';

    constructor(options: FormInputControlOptions<string> = {}) {
        super(options);
    }
}

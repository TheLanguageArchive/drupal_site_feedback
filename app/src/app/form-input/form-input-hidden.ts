import { FormInputControl, FormInputControlOptions } from './form-input-control';

export class FormInputHidden extends FormInputControl<string> {

    type = 'hidden';

    constructor(options: FormInputControlOptions<string> = {}) {
        super(options);
    }
}

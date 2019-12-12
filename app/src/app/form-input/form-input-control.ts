export interface FormInputControlOptions<T> {

    value?: T;
    key?: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    order?: number;
    type?: string;
}

export class FormInputControl<T> {

    value: T;
    key: string;
    label: string;
    placeholder: string;
    required: boolean;
    order: number;
    type: string;

    constructor(options: FormInputControlOptions<T> = {}) {

        this.value       = options.value;
        this.key         = options.key || '';
        this.label       = options.label || '';
        this.placeholder = options.placeholder || '';
        this.required    = !!options.required;
        this.order       = options.order === undefined ? 1 : options.order;
        this.type        = options.type || '';
    }
}

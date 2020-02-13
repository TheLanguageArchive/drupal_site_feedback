import { FormInputGroup, FormCaptcha } from '../form-input';
import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

declare var grecaptcha: any;

@Injectable()
export class CaptchaService {

    render(formInput: FormInputGroup) {

        let recaptcha = document.querySelector('.g-recaptcha');
        if (recaptcha) {

          try {

            grecaptcha.render(recaptcha, {
              sitekey: this.getRecaptchaSitekey(formInput),
            });

          } catch (e) {}
        }
    }

    isValid(formInput: FormInputGroup, manager: FormGroup) {

        let item = this.getCaptchaItem(formInput);

        if (!item) {
            return false;
        }

        if (item.captcha.type === 'recaptcha/reCAPTCHA' && this.getRecaptchaValue() !== '') {
            return true;
        }

        if (item.captcha.type === 'captcha/Math' && this.getMathValue(item.key, manager) !== '') {
            return true;
        }

        return false;
    }

    getParams(formInput: FormInputGroup, manager: FormGroup) {

        let item = this.getCaptchaItem(formInput);

        if (!item) {
            return null;
        }

        return {

            sid: item.captcha.csid,
            token: item.captcha.token,
            response: (item.captcha.type === 'recaptcha/reCAPTCHA' ? this.getRecaptchaValue() : this.getMathValue(item.key, manager)),
        };
    }

    resetCaptcha(formInput: FormInputGroup, manager: FormGroup, captcha: FormCaptcha) {

        let item = this.getCaptchaItem(formInput);

        if (!item) {
            return;
        }

        // first resetting math field
        let captchaInput = manager.get(item.key).get('captcha');

        if (captchaInput) {
            captchaInput.reset();
        }

        // then resetting recaptcha if active
        if (item.captcha.type === 'recaptcha/reCAPTCHA') {
            grecaptcha.reset();
        }

        // and finally reloading captcha data
        item.captcha = captcha;
    }

    getCaptchaItem(formInput: FormInputGroup) {
        return formInput.items.find(item => item.captcha !== null);
    }

    getRecaptchaSitekey(formInput: FormInputGroup) {
        return formInput.items.find(item => item.captcha !== null).captcha.sitekey;
    }

    getRecaptchaValue() {
        return (document.getElementById('g-recaptcha-response') as HTMLTextAreaElement).value;
    }

    getMathValue(key: string, manager: FormGroup) {

        let captcha = manager.get(key).get('captcha');
        return captcha ? captcha.value : '';
    }
}

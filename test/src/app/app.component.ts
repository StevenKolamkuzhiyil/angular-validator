import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'tst-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'test';

  control: FormControl;

  constructor() {}

  ngOnInit(): void {
    this.control = new FormControl(null, [CustomValidators.requiredCustom(2)]);
    console.log(this.control);
    console.log(this.control.validator);
    console.log(hasRequiredField(this.control));
  }
}

export class CustomValidators extends Validators {

  static requiredCustom(max: number): ValidatorFn {
    return (control: AbstractControl) => maxValidator(control, max);
  }
}

export function maxValidator(control: AbstractControl, max: number): ValidationErrors | null {
  return isEmptyInputValue(control.value) || control.value.length > max ? Validators.required(control) : null;
}
function isEmptyInputValue(value: any): boolean {
  // we don't check for string here so it also works with arrays
  return value == null || value.length === 0;
}

export const hasRequiredField = (abstractControl: AbstractControl): boolean => {
  if (abstractControl.validator) {
      const validator = abstractControl.validator({} as AbstractControl);
      if (validator && validator.required) {
          return true;
      }
  }
  if (abstractControl['controls']) {
      for (const controlName in abstractControl['controls']) {
          if (abstractControl['controls'][controlName]) {
              if (hasRequiredField(abstractControl['controls'][controlName])) {
                  return true;
              }
          }
      }
  }
  return false;
};
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {ChemicalElement} from "../../models/chemical-elements.model";
import {MatButton} from "@angular/material/button";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";

interface LoginForm {
  name: FormControl<string>;
  position: FormControl<number>;
  weight: FormControl<number>;
  symbol: FormControl<string>;
}

@Component({
  selector: 'app-chemical-element-edit-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose,
    MatFormField,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    MatError,
    MatLabel
  ],
  templateUrl: './chemical-element-edit-modal.component.html'
})
export class ChemicalElementEditModalComponent implements OnInit {

  elementForm: FormGroup<LoginForm> = new FormGroup(<LoginForm>{
    name: new FormControl('', {
      validators: Validators.required
    }),
    symbol: new FormControl('', {
      validators: [Validators.required, Validators.maxLength(2)]
    }),
    weight: new FormControl(0, {
      validators: [Validators.required, Validators.min(0)]
    }),
    position: new FormControl(0, {
      validators: [Validators.required, Validators.min(0)]
    })
  });

  constructor(public dialogRef: MatDialogRef<ChemicalElementEditModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { element: ChemicalElement }) {
  }

  ngOnInit(): void {
    if (this.data.element) {
      this.elementForm.patchValue(this.data.element);
    }
  }

  onSave(): void {
    if (this.elementForm.valid) {
      this.dialogRef.close(this.elementForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

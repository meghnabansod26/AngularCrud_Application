// Import necessary modules

import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { APIService } from '../services/api.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {ToastrModule, ToastrService} from 'ngx-toastr';

// Define interface for roles

interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
})
export class DialogComponent implements OnInit {
  // Declare variables

  registerForm!: FormGroup;
  actionBtn: string = 'Submit';
  genderList = ['Male', 'Female'];
  isLoading = false;

  // Define roles
  roles: Role[] = [
    { value: 'Developer', viewValue: 'Developer' },
    { value: 'Tester', viewValue: 'Tester' },
    { value: 'Manager', viewValue: 'Manager' },
    { value: 'Teamleader', viewValue: 'TeamLeader' },
  ];

  // Define skills form group and validator

  skills = this.formBuilder.group(
    {
      java: false,
      nodejs: false,
      react: false,
      angular: false,
      android: false,
    },
    { validators: this.checkSkills }
  );

  checkSkills(group: FormGroup) {
    const values = Object.values(group.value);
    const isChecked = values.some((val) => val === true);
    return isChecked ? null : { skillRequired: true };
  }

  // Constructor

  constructor(
    private API: APIService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private toastr : ToastrService
  ) {}

  // Initialization

  ngOnInit(): void {
    // Define register form and its form controls

    this.registerForm = this.formBuilder.group({
      FirstName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        numericValidator,
      ]),
      LastName: new FormControl('', [
        Validators.required,
        Validators.pattern('^[a-zA-Z]+$'),
        numericValidator,
      ]),

      Gender: ['', Validators.required],
      Role: ['', Validators.required],
      // date: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]),
      date: ['', Validators.required],
      AboutEmployee: ['', [Validators.required, Validators.maxLength(30)]], // Added form control for the textarea
      skills: this.skills, // Include the skills form group here
    });

    // If data is being edited, populate form fields with existing values

    if (this.editData) {
      this.actionBtn = 'Edit';
      this.registerForm.controls['FirstName'].setValue(this.editData.FirstName);
      this.registerForm.controls['LastName'].setValue(this.editData.LastName);
      this.registerForm.controls['Gender'].setValue(this.editData.Gender);
      this.registerForm.controls['date'].setValue(this.editData.date);
      this.registerForm.controls['Role'].setValue(this.editData.Role);
      this.registerForm.controls['skills'].setValue(this.editData.skills);
      this.registerForm.controls['AboutEmployee'].setValue(
        this.editData.AboutEmployee
      );
    }

    // Define numeric validator function

    function numericValidator(
      control: FormControl
    ): { [key: string]: boolean } | null {
      const isNumeric = /^[0-9]+$/.test(control.value);
      return isNumeric ? { numeric: true } : null;
    }
  }
  // Register user function

  registerUser(): void {
    console.log(this.registerForm.value);
    // If data is not being edited and form is valid, register user and close dialog
    if (!this.editData) {
      if (this.registerForm.valid) {
        this.API.postRegister(this.registerForm.value).subscribe({
          next: (res) => {
            this.toastr.success("Registration Successfully Done");
            this.registerForm.reset();
            this.dialogRef.close('Register');
          },
          error: () => {
            // this.toastr.warning("Error while registration");/
            alert("SUccesful");
          },
        });
      }
    } else {
      this.updateEmployee();
    }

    this.isLoading = true;

    // make API call or perform any other necessary action

    // form submission logic
    setTimeout(() => {
      this.isLoading = false;

      // this.snackBar.open('Form submitted successfully!', 'Close', {
      //   duration: 2000, // duration for the message to display (in milliseconds)
      // });
    }, 2000);
  }
  updateEmployee() {
    this.API.putRegister(this.registerForm.value, this.editData.id).subscribe({
      next: (res) => {
        this.toastr.success("Employee Details Updated");
        this.registerForm.reset();
        this.dialogRef.close('edit');
      },
      error: () => {
      this.toastr.warning("Error while updating")      },
    });
  }
}

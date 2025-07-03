import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService,User } from '../../../../services/auth.service';
import { NgIf } from '@angular/common';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo implements OnInit, OnDestroy {
  user!: User;
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.user = null as any;
      this.form = null as any;
      return;
    }

    this.loadUser();
  }

  private loadUser() {
    this.authService
      .fetchLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.user = res.data.user;
          this.initializeForm();
        },
        error: () => {
          this.authService.logout();
          Swal.fire({
            icon: 'error',
            title: 'Session expired!',
            text: 'Please log in again.',
          });
          this.user = null as any;
          this.form = null as any;
        },
      });
  }

  private initializeForm() {
    this.form = this.fb.group(
      {
        name: [{ value: this.user.name, disabled: true }],
        email: [
          this.user.email,
          [Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
        ],
        currentPassword: [''],
        password: [
          '',
          Validators.compose([
            Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/),
            Validators.minLength(6),
            Validators.maxLength(32),
          ]),
        ],
        confirmPassword: [''],
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    if ((password || confirm) && password !== confirm) {
      return { mismatch: true };
    }
    return null;
  }

  get email() {
    return this.form.get('email');
  }
  get currentPassword() {
    return this.form.get('currentPassword');
  }
  get password() {
    return this.form.get('password');
  }
  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const emailChanged =
      this.email?.value &&
      this.email.valid &&
      this.email.value !== this.user.email;

    const passwordChanged = this.password?.value && this.password.valid;

    if (!emailChanged && !passwordChanged) {
      Swal.fire({
        icon: 'info',
        title: 'No changes',
        text: 'There are no changes to save.',
      });
      return;
    }

    // Case 1: Only email changed
    if (emailChanged && !passwordChanged) {
      this.authService
        .updateUser(this.user._id, { email: this.email.value })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'User email updated successfully',
            });
            this.loadUser(); // Refresh form with new email
          },
          error: (err) => this.handleServerError(err),
        });
      return;
    }

    // Case 2: Only password changed
    if (passwordChanged && !emailChanged) {
      const currentPasswordValue = this.currentPassword?.value;
      if (!currentPasswordValue) {
        this.currentPassword?.setErrors({ required: true });
        return;
      }

      this.authService
        .changePassword(
          this.user._id,
          currentPasswordValue,
          this.password.value,
          this.confirmPassword?.value || ''
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Password updated successfully',
            });
            this.form.reset({
              name: this.user.name,
              email: this.user.email,
              currentPassword: '',
              password: '',
              confirmPassword: '',
            });
          },
          error: (err) => this.handleServerError(err),
        });
      return;
    }

    // Case 3: Both email and password changed → all-or-nothing
    if (emailChanged && passwordChanged) {
      const currentPasswordValue = this.currentPassword?.value;
      if (!currentPasswordValue) {
        this.currentPassword?.setErrors({ required: true });
        return;
      }

      forkJoin({
        emailUpdate: this.authService.updateUser(this.user._id, {
          email: this.email.value,
        }),
        passwordChange: this.authService.changePassword(
          this.user._id,
          currentPasswordValue,
          this.password.value,
          this.confirmPassword?.value || ''
        ),
      })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Email and password updated successfully',
            });
            this.loadUser(); // Refresh form
          },
          error: (err) => this.handleServerError(err),
        });
    }
  }

  private handleServerError(err: any) {
    console.error('Server error:', err);

    const pathMap: Record<string, string> = {
      newPassword: 'password',
      currentPassword: 'currentPassword',
      email: 'email',
    };

    const errors = err?.error?.errors || err?.error?.body;

    if (Array.isArray(errors)) {
      for (const errorItem of errors) {
        const serverPath = errorItem?.path;
        const serverMsg = errorItem?.msg;

        if (serverPath && serverMsg) {
          const formPath = pathMap[serverPath] || serverPath;
          const control = this.form.get(formPath);
          if (control) {
            control.setErrors({ serverError: serverMsg });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: serverMsg,
            });
          }
        }
      }
    } else if (errors?.path && errors?.msg) {
      const serverPath = errors.path;
      const serverMsg = errors.msg;

      const formPath = pathMap[serverPath] || serverPath;
      const control = this.form.get(formPath);
      if (control) {
        control.setErrors({ serverError: serverMsg });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: serverMsg,
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred.',
      });
    }
  }
}

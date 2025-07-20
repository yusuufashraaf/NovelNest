import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService, User } from '../../../../services/auth.service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [ReactiveFormsModule,NgIf],
  templateUrl: './personal-info.html',
  styleUrls: ['./personal-info.css'],
})
export class PersonalInfo implements OnInit, OnDestroy {
  user!: User;
  form!: FormGroup;
  private destroy$ = new Subject<void>();

  isLoadingUser = true;
  isSubmitting = false;

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
    this.isLoadingUser = true;
    this.authService
      .fetchLoggedInUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.user = res.data.user;
          this.initializeForm();
          this.isLoadingUser = false;
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
          this.isLoadingUser = false;
        },
      });
  }

  private initializeForm() {
    this.form = this.fb.group(
      {
        name: [this.user.name, [Validators.required, Validators.minLength(2)]],
        email: [
          { value: this.user.email, disabled: true },
          [
            Validators.required,
            Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
          ],
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

  get name() {
    return this.form.get('name');
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

    const nameChanged = this.name?.value && this.name.value !== this.user.name;
    const emailChanged =
      this.email?.value && this.email.value !== this.user.email;
    const passwordChanged = this.password?.value && this.password.valid;

    if (!nameChanged && !emailChanged && !passwordChanged) {
      Swal.fire({
        icon: 'info',
        title: 'No changes',
        text: 'There are no changes to save.',
      });
      return;
    }

    const tasks = [];

    if (nameChanged || emailChanged) {
      const updateData: any = {};
      if (nameChanged) updateData.name = this.name?.value;
      if (emailChanged) updateData.email = this.email?.value;

      tasks.push(this.authService.updateUser(this.user._id, updateData));
    }

    if (passwordChanged) {
      const currentPasswordValue = this.currentPassword?.value;
      if (!currentPasswordValue) {
        this.currentPassword?.setErrors({ required: true });
        return;
      }

      tasks.push(
        this.authService.changePassword(
          currentPasswordValue,
          this.password.value,
          this.confirmPassword?.value || ''
        )
      );
    }

    this.isSubmitting = true;

    forkJoin(tasks)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Your information has been updated successfully.',
          });
          this.loadUser();
          this.isSubmitting = false;
        },
        error: (err) => {
          this.handleServerError(err);
          this.isSubmitting = false;
        },
      });
  }

  private handleServerError(err: any) {
    console.error('Server error:', err);

    const pathMap: Record<string, string> = {
      newPassword: 'password',
      currentPassword: 'currentPassword',
      email: 'email',
      name: 'name',
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../components/ui/page-header/page-header.component';
import { IconComponent } from '../../../components/ui/icon/icon.component';
import { StatusBadgeComponent } from '../../../components/ui/status-badge/status-badge.component';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: string;
  avatar?: string;
  lastLogin: Date;
  accountCreated: Date;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  applicationUpdates: boolean;
  systemMaintenance: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
}

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    TranslateModule, 
    PageHeaderComponent, 
    IconComponent, 
    StatusBadgeComponent
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.scss'
})
export class ProfileSettingsComponent {
  activeTab = 'profile';
  profileForm: FormGroup;
  passwordForm: FormGroup;
  
  userProfile: UserProfile = {
    firstName: 'Ahmad',
    lastName: 'Al-Mansouri',
    email: 'ahmad.almansouri@adio.gov.ae',
    phoneNumber: '+971 50 123 4567',
    department: 'Energy Support Program',
    role: 'Senior Application Reviewer',
    lastLogin: new Date('2025-01-20T09:30:00'),
    accountCreated: new Date('2023-06-15T14:20:00')
  };

  notificationSettings: NotificationSettings = {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    applicationUpdates: true,
    systemMaintenance: true,
    securityAlerts: true,
    weeklyReports: false
  };

  languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇦🇪' }
  ];

  selectedLanguage = 'en';
  selectedTimezone = 'Asia/Dubai';

  timezones = [
    { value: 'Asia/Dubai', label: 'Dubai (GMT+4)' },
    { value: 'UTC', label: 'UTC (GMT+0)' },
    { value: 'America/New_York', label: 'New York (GMT-5)' },
    { value: 'Europe/London', label: 'London (GMT+0)' }
  ];

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required, Validators.minLength(2)]],
      lastName: [this.userProfile.lastName, [Validators.required, Validators.minLength(2)]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phoneNumber: [this.userProfile.phoneNumber, [Validators.required]],
      department: [this.userProfile.department, [Validators.required]],
      role: [this.userProfile.role, [Validators.required]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onProfileSubmit() {
    if (this.profileForm.valid) {
      // Update user profile
      Object.assign(this.userProfile, this.profileForm.value);
      console.log('Profile updated:', this.userProfile);
      // Show success message
    }
  }

  onPasswordSubmit() {
    if (this.passwordForm.valid) {
      // Update password
      console.log('Password updated');
      this.passwordForm.reset();
      // Show success message
    }
  }

  onNotificationSettingsChange() {
    console.log('Notification settings updated:', this.notificationSettings);
    // Save notification settings
  }

  onLanguageChange() {
    console.log('Language changed to:', this.selectedLanguage);
    // Apply language change
  }

  onTimezoneChange() {
    console.log('Timezone changed to:', this.selectedTimezone);
    // Apply timezone change
  }

  uploadAvatar(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Handle file upload
      console.log('Avatar upload:', file.name);
      // Preview and save avatar
    }
  }

  getInitials(): string {
    return (this.userProfile.firstName[0] + this.userProfile.lastName[0]).toUpperCase();
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  tabs = [
    { id: 'profile', label: 'Profile Information', icon: 'user' },
    { id: 'security', label: 'Security', icon: 'shield' },
    { id: 'notifications', label: 'Notifications', icon: 'bell' },
    { id: 'preferences', label: 'Preferences', icon: 'settings' }
  ];
}
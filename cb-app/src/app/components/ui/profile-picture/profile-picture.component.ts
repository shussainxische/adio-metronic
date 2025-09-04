import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-picture',
  imports: [CommonModule],
  templateUrl: './profile-picture.component.html',
  styleUrl: './profile-picture.component.scss'
})
export class ProfilePictureComponent {
  @Input() photoUrl: string | null = null;
  @Input() name: string = '';
  @Input() size: string = '9'; // Default size, can be customized
  @Input() customClass: string = ''; // Optional additional classes

  get profilePictureExists(): boolean {
    return this.photoUrl !== null && this.photoUrl !== undefined && this.photoUrl !== '';
  }

  get firstLetter(): string {
    return this.name && this.name.length > 0 ? this.name.charAt(0).toUpperCase() : '';
  }
}

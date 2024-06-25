import type { Customer } from '@commercetools/platform-sdk';
import { div, h2, input, section } from '@control.ts/min';
import { Router } from 'vanilla-routing';

import { showToastMessage } from '@components/Toast';
import profileService from '@services/ProfileService';

import styles from './ProfilePage.module.scss';

export class ProfilePage {
  private pageWrapper: HTMLElement = section({ className: styles.wrapper });

  public createPage(): HTMLElement {
    this.createContainer();

    return this.pageWrapper;
  }

  private async createContainer(): Promise<HTMLElement> {
    const userData = await profileService.getUserData();
    const container = div({ className: styles.container });
    if (userData && userData.statusCode === 200) {
      const title = h2({ className: styles.title, txt: `Welcome, ${userData.body.firstName}!` });
      const oldProfile = div({ className: styles.profileBtn, txt: `OLD PROFILE` });
      oldProfile.addEventListener('click', () => {
        Router.go('/profile', { addToHistory: true });
      });
      const info = this.createUserInfo(userData.body);
      container.append(title, oldProfile, info);
    }
    this.pageWrapper.append(container);
    return container;
  }

  private createUserInfo(data: Customer): HTMLElement {
    const container = div({ className: styles.infoContainer });

    const firstName = this.createFirstNameItem(`${data.firstName}`);
    const lastName = this.createLastNameItem(`${data.lastName}`);
    const email = this.createEmailItem(`${data.email}`);
    const birthday = this.createDateOfBirthItem(`${data.dateOfBirth}`);

    container.append(firstName, lastName, email, birthday);
    return container;
  }

  private createFirstNameItem(value: string): HTMLElement {
    const container = div({ className: styles.itemContainer });
    const title = div({ className: styles.itemTitle, txt: `First name` });
    const subContainer = div({ className: styles.subContainer });
    const data = input({ className: styles.itemData, value, disabled: true });
    const editBtn = div({ className: styles.editBtn });
    subContainer.append(data, editBtn);
    editBtn.addEventListener('click', async () => {
      this.updateFirstName(data);
    });
    data.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.updateFirstName(data);
      }
    });
    container.append(title, subContainer);
    return container;
  }

  private createLastNameItem(value: string): HTMLElement {
    const container = div({ className: styles.itemContainer });
    const title = div({ className: styles.itemTitle, txt: `Last name` });
    const subContainer = div({ className: styles.subContainer });
    const data = input({ className: styles.itemData, value, disabled: true });
    const editBtn = div({ className: styles.editBtn });
    subContainer.append(data, editBtn);
    editBtn.addEventListener('click', async () => {
      this.updateLastName(data);
    });
    data.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.updateLastName(data);
      }
    });
    container.append(title, subContainer);
    return container;
  }

  private createEmailItem(value: string): HTMLElement {
    const container = div({ className: styles.itemContainer });
    const title = div({ className: styles.itemTitle, txt: `Email` });
    const subContainer = div({ className: styles.subContainer });
    const data = input({ className: styles.itemData, value, disabled: true });
    const editBtn = div({ className: styles.editBtn });
    subContainer.append(data, editBtn);
    editBtn.addEventListener('click', async () => {
      this.updateEmail(data);
    });
    data.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.updateEmail(data);
      }
    });
    container.append(title, subContainer);
    return container;
  }

  private createDateOfBirthItem(value: string): HTMLElement {
    const container = div({ className: styles.itemContainer });
    const title = div({ className: styles.itemTitle, txt: `Birthday` });
    const subContainer = div({ className: styles.subContainer });
    const data = input({ className: styles.itemData, type: 'date', value, disabled: true });
    const editBtn = div({ className: styles.editBtn });
    subContainer.append(data, editBtn);
    editBtn.addEventListener('click', async () => {
      this.updateDateOfBirth(data);
    });
    data.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        this.updateDateOfBirth(data);
      }
    });
    container.append(title, subContainer);
    return container;
  }

  private async updateFirstName(field: HTMLInputElement): Promise<void> {
    if (field.disabled) {
      field.disabled = false;
      field.focus();
    } else {
      try {
        const response = await profileService.updateFirstName(field.value);
        if (response.statusCode === 200) {
          field.disabled = true;
        }
      } catch (e) {
        showToastMessage('Failed to save the data. Please, try again.');
      }
    }
  }

  private async updateLastName(field: HTMLInputElement): Promise<void> {
    if (field.disabled) {
      field.disabled = false;
      field.focus();
    } else {
      try {
        const response = await profileService.updateLastName(field.value);
        if (response.statusCode === 200) {
          field.disabled = true;
        }
      } catch (e) {
        showToastMessage('Failed to save the data. Please, try again.');
      }
    }
  }

  private async updateEmail(field: HTMLInputElement): Promise<void> {
    if (field.disabled) {
      field.disabled = false;
      field.focus();
    } else {
      try {
        const response = await profileService.updateEmail(field.value);
        if (response.statusCode === 200) {
          field.disabled = true;
        }
      } catch (e) {
        showToastMessage('Failed to save the data. Please, try again.');
      }
    }
  }

  private async updateDateOfBirth(field: HTMLInputElement): Promise<void> {
    if (field.disabled) {
      field.disabled = false;
      field.focus();
    } else {
      try {
        const response = await profileService.updateDateOfBirth(field.value);
        if (response.statusCode === 200) {
          field.disabled = true;
        }
      } catch (e) {
        showToastMessage('Failed to save the data. Please, try again.');
      }
    }
  }
}

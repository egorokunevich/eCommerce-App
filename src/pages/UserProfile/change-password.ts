// import { Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import type { Customer, MyCustomerChangePassword } from '@commercetools/platform-sdk';
import { article, button, form } from '@control.ts/min';

import { ToastColors, showToastMessage } from '@components/Toast';
import RegistrationPage from '@pages/RegistrationPage';
import clientService from '@services/ClientService';
import { setAttributes } from '@utils/BaseComponentProps';
import { isRegistrationActive, validationText } from '@utils/RegistrationValidationsData';

import styles from './styles.module.scss';

export class ChangePassword {
  private registrationPageClass: RegistrationPage = new RegistrationPage();
  // maybe it need deleted
  private oldLabelPassword: null | HTMLElement = null;
  private newLabelPassword: null | HTMLElement = null;
  private repeatLabelPassword: null | HTMLElement = null;

  private oldInputTagPassword: null | HTMLElement = null;
  private newInputTagPassword: null | HTMLElement = null;
  private repeatInputTagPassword: null | HTMLElement = null;

  private async getDataFromServer(): Promise<Customer | null> {
    try {
      const data = await clientService.apiRoot.me().get().execute();
      return data.body;
    } catch (e) {
      showToastMessage('Failed to save new password. Please, try again.');
    }
    return null;
  }

  public async creteNodePassword(): Promise<HTMLElement> {
    const node = article(
      { className: styles.profileChangePassword },
      this.createInputsPassword(),
      await this.createBtnToSaveChange(),
    );
    return node;
  }

  private createInputsPassword(): HTMLElement {
    this.oldLabelPassword = this.registrationPageClass.createFormLabel('Old-Password', validationText.password);
    this.oldInputTagPassword = this.registrationPageClass.inputTag;

    this.newLabelPassword = this.registrationPageClass.createFormLabel('New-Password', validationText.password);
    this.newInputTagPassword = this.registrationPageClass.inputTag;

    this.repeatLabelPassword = this.registrationPageClass.createFormLabel('Repeat-Password', validationText.password);
    this.repeatInputTagPassword = this.registrationPageClass.inputTag;

    const node = form({}, this.oldLabelPassword, this.newLabelPassword, this.repeatLabelPassword);

    return node;
  }

  private async createBtnToSaveChange(): Promise<HTMLElement> {
    const { validationMessages } = this.registrationPageClass;
    const node = setAttributes(
      button({
        className: [styles.userInfoBtn, styles.saveBtnPassword].join(' '),
        txt: 'Save',
      }),
      { type: 'button', text: true },
    );
    node.addEventListener('click', async () => {
      const data = await this.getDataFromServer();
      if (data) {
        const { email } = data;
        const newPassword = this.isValueInputs();
        if (
          isRegistrationActive(validationMessages) &&
          newPassword !== '' &&
          this.oldInputTagPassword instanceof HTMLInputElement
        ) {
          try {
            await this.changePassword(this.oldInputTagPassword.value, newPassword);

            showToastMessage('Password changed successfully', ToastColors.Green);
            await clientService.logout();

            await clientService.login(email, newPassword);
          } catch {
            showToastMessage('Your old password is wrong', ToastColors.Red);
          }
        } else {
          showToastMessage('Your password is not the same', ToastColors.Red);
        }
      }
    });

    return node;
  }

  private isValueInputs(): string {
    if (
      this.newInputTagPassword instanceof HTMLInputElement &&
      this.repeatInputTagPassword instanceof HTMLInputElement
    ) {
      return this.repeatInputTagPassword.value === this.newInputTagPassword.value ? this.newInputTagPassword.value : '';
    }
    return '';
  }

  private async changePassword(currentPassword: string, newPassword: string): Promise<Customer | null> {
    const data = await this.getDataFromServer();
    if (data) {
      const { version } = data;
      const changePasswordDraft: MyCustomerChangePassword = {
        version,
        currentPassword,
        newPassword,
      };

      const response = await clientService.apiRoot.me().password().post({ body: changePasswordDraft }).execute();

      return response.body;
    }
    return null;
  }
}

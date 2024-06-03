// import { Customer, CustomerUpdateAction } from '@commercetools/platform-sdk';
import type { Customer, MyCustomerUpdateAction } from '@commercetools/platform-sdk';
import { article, button, div } from '@control.ts/min';

import { ToastColors, showToastMessage } from '@components/Toast';
import RegistrationPage from '@pages/RegistrationPage';
import clientService from '@services/ClientService';
import { isRegistrationActive, validationText } from '@utils/RegistrationValidationsData';

import styles from './styles.module.scss';

interface UserInput {
  inputEmail: string;
  inputFirstName: string;
  inputLastName: string;
  inputDateOfBirth: string;
}

export class ChangeUserData {
  private registrationPageClass: RegistrationPage = new RegistrationPage();

  private inputEmail: null | HTMLElement = null;
  private inputFirstName: null | HTMLElement = null;
  private inputLastName: null | HTMLElement = null;
  private inputDateOfBirth: null | HTMLElement = null;

  private async getDataFromServer(): Promise<Customer> {
    const data = await clientService.apiRoot.me().get().execute();
    return data.body;
  }

  public async createChangeLayout(): Promise<HTMLElement> {
    const node = article(
      { className: styles.changeInformation },
      await this.createInputs(),
      await this.createBtnToSaveNewDataProfile(),
    );
    return node;
  }

  private async createInputs(): Promise<HTMLElement> {
    const data = await this.getDataFromServer();
    const node = div({});
    const { email, firstName, lastName, dateOfBirth } = data;

    if (email && firstName && lastName && dateOfBirth) {
      const labelEmail = this.registrationPageClass.createFormLabel(email, validationText.email);
      this.inputEmail = this.registrationPageClass.inputTag;

      const labelFirstName = this.registrationPageClass.createFormLabel(firstName, validationText.firstName);
      this.inputFirstName = this.registrationPageClass.inputTag;

      const labelLastName = this.registrationPageClass.createFormLabel(lastName, validationText.lastName);
      this.inputLastName = this.registrationPageClass.inputTag;

      const labelDateOfBirth = this.registrationPageClass.createFormLabel('dateOfBirth', validationText.dateOfBirth);
      this.inputDateOfBirth = this.registrationPageClass.inputTag;
      node.append(labelFirstName, labelLastName, labelDateOfBirth, labelEmail);
    }

    return node;
  }

  private async createBtnToSaveNewDataProfile(): Promise<HTMLButtonElement> {
    const { validationMessages } = this.registrationPageClass;
    const btn = button({ className: styles.userInfoBtn, txt: 'Save' });

    btn.addEventListener('click', async () => {
      const inputsValue = this.checkInputsValue();
      if (inputsValue && isRegistrationActive(validationMessages) && this.isInputsValueEmpty()) {
        await this.updateMyCustomerData(this.updateActions(inputsValue));
        showToastMessage('Your information was change', ToastColors.Green);

        const newArticle = document.querySelector(`.${styles.profileInformation}`);
        if (newArticle !== null) {
          newArticle.innerHTML = '';
          newArticle.append(await this.createInputs(), await this.createBtnToSaveNewDataProfile());
        }
      } else {
        showToastMessage('Write all Fields', ToastColors.Red);
      }
    });
    return btn;
  }

  private async updateMyCustomerData(actions: MyCustomerUpdateAction[]): Promise<Customer> {
    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version: (await this.getDataFromServer()).version,
          actions,
        },
      })
      .execute();

    return response.body;
  }

  private updateActions(objInputsValue: UserInput): MyCustomerUpdateAction[] {
    return [
      {
        action: 'setFirstName',
        firstName: objInputsValue.inputFirstName,
      },
      {
        action: 'setLastName',
        lastName: objInputsValue.inputLastName,
      },
      {
        action: 'changeEmail',
        email: objInputsValue.inputEmail,
      },
      {
        action: 'setDateOfBirth',
        dateOfBirth: objInputsValue.inputDateOfBirth,
      },
    ];
  }

  public checkInputsValue(): UserInput | undefined {
    if (
      this.inputEmail instanceof HTMLInputElement &&
      this.inputFirstName instanceof HTMLInputElement &&
      this.inputLastName instanceof HTMLInputElement &&
      this.inputDateOfBirth instanceof HTMLInputElement
    ) {
      return {
        inputEmail: this.inputEmail.value,
        inputFirstName: this.inputFirstName.value,
        inputLastName: this.inputLastName.value,
        inputDateOfBirth: this.inputDateOfBirth.value,
      };
    }
    return undefined;
  }

  private isInputsValueEmpty(): boolean {
    const inputsValue = this.checkInputsValue();

    return inputsValue ? Object.values(inputsValue).every((value) => value !== '') : false;
  }
}

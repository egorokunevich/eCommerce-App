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

  private async getDataFromServer(): Promise<Customer | null> {
    try {
      const data = await clientService.apiRoot.me().get().execute();
      return data.body;
    } catch (e) {
      showToastMessage('Failed to load data from server. Please, try again.');
    }
    return null;
  }

  public async createChangeLayout(): Promise<HTMLElement | null> {
    const inputs = await this.createInputs();
    if (inputs) {
      const node = article({ className: styles.changeInformation }, inputs, await this.createBtnToSaveNewDataProfile());
      return node;
    }
    return null;
  }

  private async createInputs(): Promise<HTMLElement | null> {
    const data = await this.getDataFromServer();
    if (data) {
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
    return null;
  }

  private async createBtnToSaveNewDataProfile(): Promise<HTMLButtonElement> {
    const { validationMessages } = this.registrationPageClass;
    const btn = button({ className: styles.userInfoBtn, txt: 'Save' });

    btn.addEventListener('click', async () => {
      const inputsValue = this.checkInputsValue();
      if (inputsValue && isRegistrationActive(validationMessages) && this.isInputsValueEmpty()) {
        await this.updateMyCustomerData(this.updateActions(inputsValue));
        showToastMessage('Your information was changed', ToastColors.Green);

        const newArticle = document.querySelector(`.${styles.profileInformation}`);
        if (newArticle !== null) {
          newArticle.innerHTML = '';
          const inputs = await this.createInputs();
          if (inputs) {
            newArticle.append(inputs, await this.createBtnToSaveNewDataProfile());
          }
        }
      } else {
        showToastMessage('Write all Fields', ToastColors.Red);
      }
    });
    return btn;
  }

  private async updateMyCustomerData(actions: MyCustomerUpdateAction[]): Promise<Customer | null> {
    const data = await this.getDataFromServer();
    if (data) {
      const { version } = data;
      const response = await clientService.apiRoot
        .me()
        .post({
          body: {
            version,
            actions,
          },
        })
        .execute();

      return response.body;
    }
    return null;
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

import { a, div, h2, h3, h4, img, p, section } from '@control.ts/min';

import styles from './AboutUsPage.module.scss';

type Developer = {
  name: string;
  github: string;
  role: string;
  education: string;
  photo: string;
  description: string;
  funFact: string;
};

export class AboutUsPage {
  public pageWrapper: HTMLElement;

  constructor() {
    this.pageWrapper = section({ className: `${styles.aboutUsPageWrapper}` });
  }
  public createPage(): Element {
    const pageTitle = h2({ className: `${styles.pageTitle}`, txt: 'Meet the Coffee Loop Development Dream Team' });
    const description = p({
      className: `${styles.pageDescription}`,
      txt: `Welcome to the "About Us" page for the Coffee Loop development team! Here, we blend talent, enthusiasm, and a touch of caffeine-fueled creativity to bring you the ultimate online shopping experience for coffee and tea lovers. Let us introduce the people who have brewed up this project.`,
    });

    this.pageWrapper.append(pageTitle, description);
    this.createCardCV(this.getDevelopers());
    const pageSecret = h2({
      className: `${styles.pageTitle}`,
      txt: 'Our Collaboration Recipe: Agile with a Dash of Humor',
    });
    const descriptionTeam = p({
      className: `${styles.pageDescription}`,
      txt: `At Coffee Loop, we believe that a well-brewed cup of coffee and a collaborative team spirit are the keys to success. Our team thrives on Agile methodologies, allowing us to adapt quickly and efficiently to the ever-changing demands of the project. We hold regular stand-up meetings, where we discuss our progress, share ideas, and sip on our favorite caffeinated beverages. Our friendly and helpful approach ensures that everyone"s contributions are valued and that no task is too daunting when tackled together. Whether it"s brainstorming over a cup of tea or debugging with a latte in hand, our team knows how to keep things light-hearted and productive. We measure our project milestones not just in lines of code but in cups of coffee consumed – because at Coffee Loop, we believe that every great feature starts with a great cup of coffee! Thank you for taking the time to get to know us. We hope you enjoy browsing our site as much as we enjoyed creating it – with a little help from our favorite caffeinated companions!`,
    });
    const schoolLinkContainer = div({ className: styles.schoolLinkContainer });
    const schoolLink = a({ href: 'https://rs.school/', target: '_blank', className: styles.schoolLink });
    const schoolLogo = img({ className: styles.schoolLogo, src: './assets/icons/rsschool.png', alt: 'RS School logo' });
    schoolLink.append(schoolLogo);
    schoolLinkContainer.append(schoolLink);
    this.pageWrapper.append(pageSecret, descriptionTeam, schoolLinkContainer);
    return this.pageWrapper;
  }

  private createCardCV(developers: Developer[]): void {
    const cardContainer = div({ className: styles.cardContainer });

    developers.forEach((dev) => {
      const devCard = this.createDeveloperCard(dev);
      cardContainer.append(devCard);
    });

    this.pageWrapper.append(cardContainer);
  }

  private createDeveloperCard(dev: Developer): HTMLElement {
    const devCard = div({ className: styles.devCard });

    const photoContainer = div({ className: styles.photoContainer });
    const photo = img({ className: styles.devPhoto, src: dev.photo, alt: `${dev.name}'s photo` });
    photoContainer.append(photo);

    const infoContainer = div({ className: styles.infoContainer });
    const nameLink = a({ href: dev.github, target: '_blank', className: styles.devNameLink });
    const nameElement = h3({ className: styles.devName, txt: dev.name });
    const githubLogo = img({ className: styles.githubLogo, src: './assets/icons/github.png', alt: 'GitHub logo' });
    nameLink.append(nameElement, githubLogo);
    const roleElement = h4({ className: styles.devRole, txt: dev.role });
    const educationElement = h4({ className: styles.devEducation, txt: dev.education });
    const descriptionElement = p({ className: styles.devDescription, txt: dev.description });
    const funFactElement = p({ className: styles.devFunFact, txt: `Note! ${dev.funFact}` });

    infoContainer.append(nameLink, roleElement, educationElement, descriptionElement, funFactElement);
    devCard.append(photoContainer, infoContainer);

    return devCard;
  }

  private getDevelopers(): Developer[] {
    return [
      {
        name: 'Yahor Akunevich: The TypeScript Jedi',
        github: 'https://github.com/egorokunevich',
        role: 'Team Lead and Chief Code Quality Guardian',
        education: 'Education: BNTU, Faculty of Instrumentation, specializing in Security Engineering',
        photo: './assets/photos/egor1.png',
        description:
          'Yahor, our fearless leader, is the mastermind behind our development process. Yahor believes that coding is not just a profession but an inspiring journey full of potential and excitement. He has led the team with a sharp eye for detail, ensuring our code is as clean as a freshly brewed cup of espresso. Yahor`s impressive contributions include configuring the Tokens, Flows at Commercetools and developing key components like the Login Page and Catalog Product Page with filters and sorting options. He`s also known for consuming an impressive 137 cups of mocachino with coconut milk while perfecting these features – that`s dedication to both his craft and his coffee!',
        funFact:
          'Yahor has a personal vendetta against bugs, and rumor has it that he can debug code faster than you can make a cup of instant coffee!',
      },
      {
        name: 'Elena Ivanova: The Multitasking Maven',
        github: 'https://github.com/Elena-lucky',
        role: 'Front-End Developer Extraordinaire',
        education: 'Education: The Belarusian State University, filological faculty',
        photo: './assets/photos/lena.jpg',
        description:
          'Elena brings a unique blend of linguistic skills and coding prowess to the table. As a philologist with a big dream of becoming a front-end developer, she has seamlessly transitioned into the tech world. Elena is the epitome of responsibility and efficiency, with excellent self-management and time-management skills. Elena has been the driving force behind the Main Page, Detailed Product Page, and the "About Us" page you are reading right now. She has fueled her creativity and productivity with 194 cups of cappuccino, each sip helping her bring the project settings and environments to life.',
        funFact:
          'Elena can juggle multiple tasks while balancing a cappuccino in one hand and a keyboard in the other – truly a multitasking marvel!',
      },
      {
        name: 'Glib Shemenkov: The CodeWarrior',
        github: 'https://github.com/Kravius',
        role: 'Front-End Specialist and Bug Squasher',
        education:
          'Education: Mykhailo Ostrohradskyi Kremenchuk National University, Master`s in Electronics Engineering',
        photo: './assets/photos/gleb.jpg',
        description:
          'Glib is our front-end wizard, armed with a master`s degree in Electronics Engineering and a penchant for solving complex programming problems on CodeWars. When he`s not developing new features, he`s busy replicating the projects of experienced programmers and planning his next big step into the world of React. Glib has been instrumental in developing the Registration Page, User Profile Page, and the Basket Page. With 176 cups of strong espresso under his belt, Glib has coded his way through countless challenges, ensuring that our project is as robust as a double shot of espresso.',
        funFact:
          'Glib`s favorite debugging tool? A fresh cup of espresso – it helps him stay awake and alert during those late-night coding sessions!',
      },
    ];
  }
}

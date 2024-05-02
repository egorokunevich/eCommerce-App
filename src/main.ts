import AppController from './components/controller/AppController';
import './main.css';

document.addEventListener('DOMContentLoaded', () => {
  const appController = new AppController();
  appController.checkLocalStorageAndLoadPage();
});

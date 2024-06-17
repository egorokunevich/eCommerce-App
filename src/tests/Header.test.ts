// Импорт необходимых модулей из vitest
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

// Импорт элементов и стилей
import Header from '../components/Header';
import styles from '../components/Header.module.scss';

// Описание тестов для класса Header
describe('Header', () => {
  let headerInstance: Header | null = null;
  beforeEach(() => {
    headerInstance = new Header();
  });

  afterEach(() => {
    headerInstance = null;
  });

  // Тест на создание элемента заголовка
  it('должен корректно создавать элемент заголовка', () => {
    if (!headerInstance) {
      throw new Error('Header instance is null');
    }

    headerInstance.createHeader();

    // Проверка созданного элемента заголовка
    const headerElement = headerInstance.getHeaderElement();
    expect(headerElement).toBeInstanceOf(HTMLElement);
    expect(headerElement?.classList.contains(styles.header)).toBe(true);
  });

  it('должен корректно добавлять элемент заголовка в DOM', () => {
    if (!headerInstance) {
      throw new Error('Header instance is null');
    }

    document.body.innerHTML = ''; // Очистка body перед тестом

    headerInstance.renderHeader();

    // Проверка наличия элемента заголовка в DOM
    const headerMain = document.querySelector(`.${styles.header}`);
    expect(headerMain).toBeInstanceOf(HTMLElement);
  });
});

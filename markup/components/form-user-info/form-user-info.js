/* eslint-disable no-console, import/no-unresolved */
import { userRegistrationData } from 'components/form-user-registration/form-user-registration';

document.addEventListener(`DOMContentLoaded`, () => {
  let userInfoData = {};

  const formUserInfo = document.querySelector('.form-user-info');

  const formUserInfoCloseButton = formUserInfo.querySelector('.form-user-info__button--close');

  formUserInfoCloseButton.addEventListener('click', ({ target }) => {
    target.closest('.form-user-info').reset();
    target.closest('.form-user-info').classList.add('form-user-info--invisible');

    document.querySelector('.button--registration').classList.remove('button--invisible');
  });

  formUserInfo.addEventListener('submit', (event) => {
    event.preventDefault();

    const { target } = event;

    const registrationButton = document.querySelector('.button--registration');

    const formData = new FormData(target);

    const formCategoriesData = formData.getAll('categories');

    userInfoData = { ...userInfoData, ...Object.fromEntries(formData) };

    registrationButton.classList.remove('button--invisible');
    registrationButton.classList.add('button--success');
    registrationButton.disabled = true;

    target.classList.add('form-user-info--invisible');

    userInfoData = { ...userInfoData, categories: formCategoriesData };

    console.log(JSON.stringify({ ...userRegistrationData, ...userInfoData }));
  });
});

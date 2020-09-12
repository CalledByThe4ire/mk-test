document.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector('.button--registration').addEventListener('click', ({ target }) => {
    const formUserRegistration = document.querySelector('.form-user-registration');

    formUserRegistration.classList.remove('form-user-registration--invisible');
    formUserRegistration.classList.add('animate__fadeIn');
    target.classList.add('button--invisible');
  });
});

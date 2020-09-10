document.addEventListener(`DOMContentLoaded`, () => {
  const formElements = {
    email: document.querySelector('form [name="email"]'),
    nickname: document.querySelector('form [name="nickname"]'),
    password: document.querySelector('form [name="password"]'),
    passwordConfirmation: document.querySelector('[name="passwordConfirmation"]'),
    submit: document.querySelector('form [type="submit"]')
  };

  [formElements.email, formElements.passwordConfirmation].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      switch (target.name) {
        case 'email':
          target.parentElement.classList.toggle('form-field--invalid', target.value === '');
          break;
        case 'passwordConfirmation':
          target.parentElement.classList.toggle(
            'form-field--invalid',
            target.value !== formElements.password.value
          );
          break;
        default:
          throw new Error(`Unknown name: ${target.name}`);
      }
    })
  );
});

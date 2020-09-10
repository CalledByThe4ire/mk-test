document.addEventListener(`DOMContentLoaded`, () => {
  const formElements = {
    email: document.querySelector('form [name="email"]'),
    nickname: document.querySelector('form [name="nickname"]'),
    password: document.querySelector('form [name="password"]'),
    passwordConfirmation: document.querySelector('[name="passwordConfirmation"]'),
    submit: document.querySelector('form [type="submit"]')
  };

  const validationMapping = {
    email: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      isValid(value) {
        return /\S+@\S+\.\S+/.test(value.toLowerCase());
      }
    },
    passwordConfirmation: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      isValid(value) {
        const password = formElements.password.value;

        return value === password;
      }
    }
  };

  const isFieldValid = (fieldName, fieldValue) =>
    Object.keys(validationMapping[fieldName]).every((key) => validationMapping[fieldName][key](fieldValue));

  [formElements.email, formElements.passwordConfirmation].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.lastElementChild;

      feedbackElement.classList.add('form-field__feedback');

      switch (target.name) {
        case 'email':
          formFieldElement.classList.toggle('form-field--invalid', !isFieldValid(target.name, target.value));

          if (!isFieldValid(target.name, target.value)) {
            if (!validationMapping[target.name].isNotEmpty(target.value)) {
              feedbackElement.textContent = 'Поле является обязательным для заполнения';
            } else {
              feedbackElement.textContent = 'Указанный e-mail является некорректным';
            }

            formFieldElement.append(feedbackElement);
          }

          break;

        case 'passwordConfirmation':
          formFieldElement.classList.toggle('form-field--invalid', !isFieldValid(target.name, target.value));

          if (!validationMapping[target.name].isValid(target.value)) {
            feedbackElement.textContent = 'Введённые пароли не совпадают';
          }

          break;
        default:
          throw new Error(`Unknown name: ${target.name}`);
      }
    })
  );

  [formElements.email, formElements.passwordConfirmation].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.lastElementChild;

      formFieldElement.classList.remove('form-field--invalid');
      feedbackElement.textContent = '';
    })
  );
});

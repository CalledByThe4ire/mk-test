/* eslint-disable no-console */

document.addEventListener(`DOMContentLoaded`, () => {
  const form = document.querySelector('.form');

  const formFields = {
    email: document.querySelector('form [name="email"]'),
    nickname: document.querySelector('form [name="nickname"]'),
    password: document.querySelector('form [name="password"]'),
    passwordConfirmation: document.querySelector('[name="passwordConfirmation"]')
  };

  const submit = form.querySelector('[type="submit"]');

  const close = form.querySelector('.form__button--close');

  const formFieldsValidationMapping = {
    email: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      isValid(value) {
        return /\S+@\S+\.\S+/.test(value.toLowerCase());
      }
    },
    nickname: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      hasRequiredSymbolsCount(value) {
        return value.length >= 3 && value.length <= 40;
      },
      hasValidSymbols(value) {
        return /\w/.test(value);
      },
      startsWithALetter(value) {
        if (value) {
          return /^[a-zA-Z]/.test(value[0]);
        }

        return false;
      }
    },
    password: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      hasRequiredSymbolsCount(value) {
        return value.length >= 6 && value.length <= 32;
      },
      hasDigit(value) {
        return /\d/.test(value);
      },
      hasLowerAndUpperCase(value) {
        return /([A-Z].*[a-z]|[a-z].*[A-Z])/.test(value);
      },
      isUnique(value) {
        if (formFields.nickname.value.length === 0 && value.length === 0) {
          return true;
        }

        return formFields.nickname.value !== value;
      }
    },
    passwordConfirmation: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      isValid(value) {
        const password = formFields.password.value;

        return value === password;
      }
    },
    userAgreement: {
      isValid(value) {
        return !!value;
      }
    }
  };

  const isFieldValid = (fieldName, fieldValue) =>
    formFieldsValidationMapping[fieldName] &&
    Object.keys(formFieldsValidationMapping[fieldName]).every((key) =>
      formFieldsValidationMapping[fieldName][key](fieldValue)
    );

  const getInvalidChecksNames = (fieldName, fieldValue) =>
    Object.keys(formFieldsValidationMapping[fieldName])
      .map((key) => {
        const isPassed = formFieldsValidationMapping[fieldName][key](fieldValue);

        if (!isPassed) {
          return key;
        }

        return null;
      })
      .filter((v) => v);

  const sortFieldRequirementsByValidity = (fieldName, fieldValue) => {
    const fieldRequirements = Object.keys(formFieldsValidationMapping[fieldName]);

    const fieldInvalidRequirements = fieldRequirements.reduce((acc, key) => {
      const newAcc = formFieldsValidationMapping[fieldName][key](fieldValue) ? acc : [...acc, key];

      return newAcc;
    }, []);

    const fieldValidRequirements = fieldRequirements.filter(
      (requirement) => !fieldInvalidRequirements.includes(requirement)
    );

    return {
      fieldValidRequirements,
      fieldInvalidRequirements
    };
  };

  let isChecked = false;

  close.addEventListener('click', ({ target }) => {
    const f = target.closest('.form');

    f.classList.add('form--invisible');

    f.reset();
    document.querySelector('.button--registration').classList.remove('button--invisible');
  });

  form.addEventListener('input', ({ currentTarget }) => {
    const formEntries = [...new FormData(currentTarget).entries()];

    const [isConfirmed] = formEntries
      .map(([key, value]) => {
        if (key === 'userAgreement') {
          return value;
        }

        return null;
      })
      .filter((v) => v);

    const isFormValid = formEntries.every(([key, value]) => isFieldValid(key, value)) && !!isConfirmed;

    submit.disabled = !isFormValid;
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const { target } = event;

    const registrationButton = document.querySelector('.button--registration');

    registrationButton.classList.remove('button--invisible');
    registrationButton.classList.add('button--success');
    registrationButton.disabled = true;
    target.classList.add('form--invisible');

    console.log(JSON.stringify(Object.fromEntries(new FormData(event.target))));
  });

  [formFields.email, formFields.passwordConfirmation].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      switch (target.name) {
        case 'email':
          if (target.value.length !== 0) {
            if (!formFieldsValidationMapping[target.name].isValid(target.value)) {
              feedbackElement.textContent = 'Указанный e-mail является некорректным';
              formFieldElement.classList.add('form-field--invalid');
            } else {
              formFieldElement.classList.add('form-field--valid');
            }
          }

          break;

        case 'passwordConfirmation':
          if (formFields.password.value !== target.value) {
            feedbackElement.textContent = 'Введённые пароли не совпадают';
            formFieldElement.classList.add('form-field--invalid');
          } else if (formFields.password.value.length !== 0 && target.value !== 0) {
            formFieldElement.classList.add('form-field--valid');
          }

          break;

        default:
          throw new Error(`Unknown name: ${target.name}`);
      }
    })
  );

  [formFields.email, formFields.passwordConfirmation].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      formFieldElement.classList.remove('form-field--invalid', 'form-field--valid');
      feedbackElement.textContent = '';
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      formFieldElement.classList.remove('form-field--invalid', 'form-field--valid');
      feedbackElement.textContent = '';

      const validationRulesContainer = formFieldElement.querySelector('.form-field__validation-rules');

      validationRulesContainer.classList.remove('form-field__validation-rules--invisible');
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      switch (target.name) {
        case 'nickname':
          if (target.value.length !== 0) {
            if (!isFieldValid(target.name, target.value)) {
              formFieldElement.classList.add('form-field--invalid');

              if (getInvalidChecksNames(target.name, target.value).includes('startsWithALetter')) {
                feedbackElement.textContent = 'Никнейм может начинаться только с буквы';
              }
            } else {
              formFieldElement.classList.add('form-field--valid');
            }
          }

          break;

        case 'password':
          if (target.value.length !== 0) {
            if (!isFieldValid(target.name, target.value)) {
              formFieldElement.classList.add('form-field--invalid');

              if (getInvalidChecksNames(target.name, target.value).includes('isUnique')) {
                feedbackElement.textContent = 'Пароль не должен совпадать с Никнеймом';
              }
            } else {
              formFieldElement.classList.add('form-field--valid');
            }
          }

          break;

        default:
          throw new Error(`Unknown name: ${target.name}`);
      }

      const validationRulesContainer = formFieldElement.querySelector('.form-field__validation-rules');

      if (!isChecked) {
        validationRulesContainer.classList.add('form-field__validation-rules--invisible');
      }
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('input', ({ target }) => {
      const { name, value } = target;

      const requirementsMapping = sortFieldRequirementsByValidity(name, value);

      const validationRulesListItems = target.parentElement.querySelectorAll(' .list > .list__item');

      if (isChecked) {
        validationRulesListItems.forEach((val) => {
          const item = val;

          item.classList.remove('list__item--valid', 'list__item--invalid');

          const classList = Array.from(item.classList).map((className) => {
            const [el, modifier] = className.split('--');

            if (requirementsMapping.fieldValidRequirements.includes(modifier)) {
              return `${el}--${modifier} ${el}--valid`;
            }

            if (requirementsMapping.fieldInvalidRequirements.includes(modifier)) {
              return `${el}--${modifier} ${el}--invalid`;
            }

            return className;
          });

          item.className = classList.join(' ');
        });
      } else {
        isChecked = true;

        validationRulesListItems.forEach((val) => {
          const item = val;

          const classList = Array.from(item.classList).map((className) => {
            const [el, modifier] = className.split('--');

            if (requirementsMapping.fieldValidRequirements.includes(modifier)) {
              return `${el}--${modifier} ${el}--valid`;
            }

            return className;
          });

          item.className = classList.join(' ');
        });
      }
    })
  );
});

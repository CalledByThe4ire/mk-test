/* eslint-disable no-console */

document.addEventListener(`DOMContentLoaded`, () => {
  const formUserRegistration = document.querySelector('.form-user-registration');

  const formUserRegistrationFields = {
    email: formUserRegistration.querySelector('[name="email"]'),
    nickname: formUserRegistration.querySelector('[name="nickname"]'),
    password: formUserRegistration.querySelector('[name="password"]'),
    passwordConfirmation: formUserRegistration.querySelector('[name="passwordConfirmation"]')
  };

  const formUserRegistrationSubmitButton = formUserRegistration.querySelector('[type="submit"]');

  const formUserRegistrationCloseButton = formUserRegistration.querySelector(
    '.form-user-registration__button--close'
  );

  let userRegistrationData = {};

  const formUserRegistrationFieldsValidationsMapping = {
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
        return /^\w+$/.test(value);
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
        if (formUserRegistrationFields.nickname.value.length === 0 && value.length === 0) {
          return true;
        }

        return formUserRegistrationFields.nickname.value !== value;
      }
    },
    passwordConfirmation: {
      isNotEmpty(value) {
        return value.length !== 0;
      },
      isValid(value) {
        const password = formUserRegistrationFields.password.value;

        return value === password;
      }
    },
    userAgreement: {
      isValid(value) {
        return !!value;
      }
    }
  };

  const isFormUserRegistrationFieldValid = (fieldName, fieldValue) =>
    formUserRegistrationFieldsValidationsMapping[fieldName] &&
    Object.keys(formUserRegistrationFieldsValidationsMapping[fieldName]).every((key) =>
      formUserRegistrationFieldsValidationsMapping[fieldName][key](fieldValue)
    );

  const getInvalidChecksNames = (fieldName, fieldValue) =>
    Object.keys(formUserRegistrationFieldsValidationsMapping[fieldName])
      .map((key) => {
        const isPassed = formUserRegistrationFieldsValidationsMapping[fieldName][key](fieldValue);

        if (!isPassed) {
          return key;
        }

        return null;
      })
      .filter((v) => v);

  const sortFormFieldRequirementsByValidity = (fieldName, fieldValue) => {
    const fieldRequirements = Object.keys(formUserRegistrationFieldsValidationsMapping[fieldName]);

    const formFieldInvalidRequirements = fieldRequirements.reduce((acc, key) => {
      const newAcc = formUserRegistrationFieldsValidationsMapping[fieldName][key](fieldValue)
        ? acc
        : [...acc, key];

      return newAcc;
    }, []);

    const formFieldValidRequirements = fieldRequirements.filter(
      (requirement) => !formFieldInvalidRequirements.includes(requirement)
    );

    return {
      fieldValidRequirements: formFieldValidRequirements,
      fieldInvalidRequirements: formFieldInvalidRequirements
    };
  };

  formUserRegistrationCloseButton.addEventListener('click', ({ target }) => {
    const f = target.closest('.form-user-registration');

    f.querySelectorAll('.form-field').forEach((formField) =>
      formField.classList.remove('form-field--valid', 'form-field--invalid')
    );

    f.querySelectorAll('.form-field__validation-rules-container').forEach((container) =>
      container.classList.add('form-field__validation-rules-container--invisible')
    );

    f.querySelectorAll('.form-field__feedback').forEach((feedback) => {
      const fb = feedback;

      fb.textContent = '';
    });

    f.classList.add('form-user-registration--invisible');

    f.reset();
    document.querySelector('.button--registration').classList.remove('button--invisible');
  });

  formUserRegistration.addEventListener('input', ({ currentTarget }) => {
    const formEntries = [...new FormData(currentTarget).entries()];

    const [isConfirmed] = formEntries
      .map(([key, value]) => {
        if (key === 'userAgreement') {
          return value;
        }

        return null;
      })
      .filter((v) => v);

    const isFormValid =
      formEntries.every(([key, value]) => isFormUserRegistrationFieldValid(key, value)) && !!isConfirmed;

    formUserRegistrationSubmitButton.disabled = !isFormValid;
  });

  formUserRegistration.addEventListener('submit', (event) => {
    event.preventDefault();

    const { target } = event;

    const registrationButton = document.querySelector('.button--registration');

    registrationButton.classList.remove('button--invisible');
    registrationButton.classList.add('button--success');
    registrationButton.disabled = true;
    target.classList.add('form-user-registration--invisible');

    userRegistrationData = { ...userRegistrationData, ...Object.fromEntries(new FormData(target)) };

    console.log(userRegistrationData);
  });

  [formUserRegistrationFields.email, formUserRegistrationFields.passwordConfirmation].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      switch (target.name) {
        case 'email':
          if (target.value.length !== 0) {
            if (!formUserRegistrationFieldsValidationsMapping[target.name].isValid(target.value)) {
              feedbackElement.textContent = 'Указанный e-mail является некорректным';
              formFieldElement.classList.add('form-field--invalid');
            } else {
              formFieldElement.classList.add('form-field--valid');
            }
          }

          break;

        case 'passwordConfirmation':
          if (formUserRegistrationFields.password.value !== target.value) {
            feedbackElement.textContent = 'Введённые пароли не совпадают';
            formFieldElement.classList.add('form-field--invalid');
          } else if (formUserRegistrationFields.password.value.length !== 0 && target.value !== 0) {
            formFieldElement.classList.add('form-field--valid');
          }

          break;

        default:
          throw new Error(`Unknown name: ${target.name}`);
      }
    })
  );

  [formUserRegistrationFields.email, formUserRegistrationFields.passwordConfirmation].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      formFieldElement.classList.remove('form-field--invalid', 'form-field--valid');
      feedbackElement.textContent = '';
    })
  );

  [formUserRegistrationFields.nickname, formUserRegistrationFields.password].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      formFieldElement.classList.remove('form-field--invalid', 'form-field--valid');
      feedbackElement.textContent = '';

      const validationRulesContainer = formFieldElement.querySelector(
        '.form-field__validation-rules-container'
      );

      validationRulesContainer.classList.remove('form-field__validation-rules-container--invisible');
    })
  );

  [formUserRegistrationFields.nickname, formUserRegistrationFields.password].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const validationRulesContainer = formFieldElement.querySelector(
        '.form-field__validation-rules-container'
      );

      const validationRulesListItems = validationRulesContainer.querySelectorAll(
        '.validation-rules-list > .validation-rules-list__item'
      );

      const isCheckedBefore = Array.from(validationRulesListItems).every(
        (item) => !JSON.parse(item.dataset.isCheckedBefore)
      );

      const isValid = Array.from(validationRulesListItems).every((item) =>
        item.classList.contains('validation-rules-list__item--valid')
      );

      if ((target.value.length === 0 && isCheckedBefore) || (target.value.length !== 0 && isValid)) {
        validationRulesContainer.classList.add('form-field__validation-rules-container--invisible');
      }

      const feedbackElement = formFieldElement.querySelector('.form-field__feedback');

      switch (target.name) {
        case 'nickname':
          if (target.value.length !== 0 || (target.value.length === 0 && !isValid)) {
            if (!isFormUserRegistrationFieldValid(target.name, target.value)) {
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
          if (target.value.length !== 0 || (target.value.length === 0 && !isValid)) {
            if (!isFormUserRegistrationFieldValid(target.name, target.value)) {
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
    })
  );

  [formUserRegistrationFields.nickname, formUserRegistrationFields.password].forEach((element) =>
    element.addEventListener('input', ({ target }) => {
      const { name, value } = target;

      const requirementsMapping = sortFormFieldRequirementsByValidity(name, value);

      const validationRulesListItems = target.parentElement.querySelectorAll(
        '.validation-rules-list > .validation-rules-list__item'
      );

      if (name === 'password') {
        formUserRegistrationFields.passwordConfirmation.value = '';
        formUserRegistrationFields.passwordConfirmation.parentElement.classList.remove(
          'form-field--valid',
          'form-field--invalid'
        );
        formUserRegistrationFields.passwordConfirmation.nextElementSibling.textContent = '';
      }

      validationRulesListItems.forEach((val) => {
        const item = val;

        const isCheckedBefore = JSON.parse(item.dataset.isCheckedBefore);

        item.classList.remove('validation-rules-list__item--valid', 'validation-rules-list__item--invalid');

        const classList = Array.from(item.classList).map((className) => {
          const [el, modifier] = className.split('--');

          if (requirementsMapping.fieldValidRequirements.includes(modifier)) {
            item.dataset.isCheckedBefore = 'true';

            return `${el}--${modifier} ${el}--valid`;
          }

          if (requirementsMapping.fieldInvalidRequirements.includes(modifier)) {
            return isCheckedBefore ? `${el}--${modifier} ${el}--invalid` : `${el}--${modifier}`;
          }

          return className;
        });

        item.className = classList.join(' ');
      });
    })
  );
});

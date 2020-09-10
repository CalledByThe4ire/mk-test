document.addEventListener(`DOMContentLoaded`, () => {
  const formFields = {
    email: document.querySelector('form [name="email"]'),
    nickname: document.querySelector('form [name="nickname"]'),
    password: document.querySelector('form [name="password"]'),
    passwordConfirmation: document.querySelector('[name="passwordConfirmation"]')
  };

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
    }
  };

  const isFieldValid = (fieldName, fieldValue) =>
    Object.keys(formFieldsValidationMapping[fieldName]).every((key) =>
      formFieldsValidationMapping[fieldName][key](fieldValue)
    );

  const sortFieldRequirementsByValidity = (fieldName, fieldValue) => {
    const fieldRequirements = Object.keys(formFieldsValidationMapping[fieldName]);

    const fieldInvalidRequirements = fieldRequirements.reduce((acc, key) => {
      const newAcc = formFieldsValidationMapping[fieldName][key](fieldValue) ? acc : [...acc, key];

      return newAcc;
    }, []);

    const fieldValidRequirements = fieldRequirements.filter(
      (requirement) => !fieldInvalidRequirements.includes(requirement)
    );

    if (fieldValue.length === 0) {
      return {
        fieldValidRequirements: [],
        fieldInvalidRequirements: []
      };
    }

    return {
      fieldValidRequirements,
      fieldInvalidRequirements
    };
  };

  [formFields.email, formFields.passwordConfirmation].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const feedbackElement = formFieldElement.lastElementChild;

      feedbackElement.classList.add('form-field__feedback');

      switch (target.name) {
        case 'email':
          formFieldElement.classList.toggle('form-field--invalid', !isFieldValid(target.name, target.value));

          if (!isFieldValid(target.name, target.value)) {
            if (!formFieldsValidationMapping[target.name].isNotEmpty(target.value)) {
              feedbackElement.textContent = 'Поле является обязательным для заполнения';
            } else {
              feedbackElement.textContent = 'Указанный e-mail является некорректным';
            }

            formFieldElement.append(feedbackElement);
          }

          break;

        case 'passwordConfirmation':
          formFieldElement.classList.toggle('form-field--invalid', !isFieldValid(target.name, target.value));

          if (!formFieldsValidationMapping[target.name].isValid(target.value)) {
            feedbackElement.textContent = 'Введённые пароли не совпадают';
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

      const feedbackElement = formFieldElement.lastElementChild;

      formFieldElement.classList.remove('form-field--invalid');
      feedbackElement.textContent = '';
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('focus', ({ target }) => {
      const formFieldElement = target.parentElement;

      const validationRulesContainer = formFieldElement.lastElementChild;

      validationRulesContainer.classList.remove('form-field__validation-rules--invisible');
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('blur', ({ target }) => {
      const formFieldElement = target.parentElement;

      const validationRulesContainer = formFieldElement.lastElementChild;

      if (!formFieldsValidationMapping[target.name].isNotEmpty(target.value)) {
        validationRulesContainer.classList.add('form-field__validation-rules--invisible');
      }
    })
  );

  [formFields.nickname, formFields.password].forEach((element) =>
    element.addEventListener('input', ({ target: { name, value } }) => {
      sortFieldRequirementsByValidity(name, value);
    })
  );
});

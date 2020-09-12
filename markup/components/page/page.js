document.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector('.button--registration').addEventListener('click', ({ target }) => {
    document.querySelector('.form-user-registration').classList.remove('form-user-registration--invisible');
    target.classList.add('button--invisible');
  });
});

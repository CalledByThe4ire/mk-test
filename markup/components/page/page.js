document.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector('.button--registration').addEventListener('click', ({ target }) => {
    document.querySelector('.form').classList.remove('form--invisible');
    target.classList.add('button--invisible');
  });
});

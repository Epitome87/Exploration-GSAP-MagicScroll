const themeBtn = document.querySelector('.theme-btn');

function getCurrentTheme() {
  let theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';

  localStorage.getItem('theme')
    ? (theme = localStorage.getItem('theme'))
    : null;

  return theme;
}

function loadTheme(theme) {
  const root = document.querySelector(':root');

  if (theme === 'light') {
    themeBtn.innerText = 'Dark';
  } else {
    themeBtn.innerText = 'Light';
  }
  localStorage.setItem('theme', theme);
  root.setAttribute('color-scheme', theme);
}

themeBtn.addEventListener('click', () => {
  let theme = getCurrentTheme();

  if (theme === 'dark') {
    theme = 'light';
  } else {
    theme = 'dark';
  }

  loadTheme(theme);
});

window.addEventListener('DOMContentLoaded', () => {
  loadTheme(getCurrentTheme());
});

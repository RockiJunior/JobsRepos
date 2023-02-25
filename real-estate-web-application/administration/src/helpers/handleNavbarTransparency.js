const windowHeight = window.innerHeight;

export default () => {
  const scrollTop = window.scrollY;
  let alpha = (scrollTop / windowHeight) * 3;
  alpha >= 1 && (alpha = 1);
  document.getElementsByClassName(
    'navbar-theme'
  )[0].style.backgroundColor = `rgba(20, 22, 30, ${alpha})`;
};

export const version = '3.3.0';
export const navbarBreakPoint = 'lg'; // Vertical navbar breakpoint
export const topNavbarBreakpoint = 'sm';
export const settings = {
  isFluid: true,
  isRTL: false,
  isDark: !localStorage.getItem('isDark')
    ? false
    : localStorage.getItem('isDark') === 'true'
    ? true
    : false,
  navbarPosition: 'vertical',
  showBurgerMenu: true, // controls showing vertical nav on mobile
  currency: '$',
  isNavbarVerticalCollapsed: false, // toggle vertical navbar collapse
  navbarStyle: 'card'
};

export default { version, navbarBreakPoint, topNavbarBreakpoint, settings };

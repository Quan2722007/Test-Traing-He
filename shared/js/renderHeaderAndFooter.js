function loadComponentStyle() {
  const header = document.createElement('link');
  header.rel = 'stylesheet';
  header.href = '../../shared/components/header/header.css';

  const footer = document.createElement('link');
  footer.rel = 'stylesheet';
  footer.href = '../../shared/components/footer/footer.css';

  document.head.appendChild(header);
  document.head.appendChild(footer);
}
loadComponentStyle();

export default loadComponentStyle;
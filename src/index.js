import './styles/index.scss'
import Snake from './js/Snake.js'

window.addEventListener('DOMContentLoaded', () => {
    const snake = new Snake(document.querySelector('#canvas'));
    snake.run();
})
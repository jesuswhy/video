const video = document.getElementById('myVideo');
const progressBar = document.getElementById('progressBar');
const playPauseBtn = document.getElementById('playPauseBtn');
const fullscreenBtn = document.getElementById('fullscreenBtn');
const videoContainer = document.getElementById('videoContainer');

const animationDuration = 60000; // 60 секунд для прогресс-бара
let hideTimeout;
let rafId;
let pausedProgress = 0; // Сохраненный прогресс (в миллисекундах) до паузы
let isPlaying = false;
let startTimestamp = null;

// Функция плавного замедления
function easeOutQuad(t) {
  return t * (2 - t); // Квадратичное замедление
}

// Анимация прогресс-бара
function animateProgressBar(timestamp) {
  if (!startTimestamp) startTimestamp = timestamp; // Устанавливаем начальный таймстамп

  const elapsed = timestamp - startTimestamp + pausedProgress; // Учитываем прогресс до паузы
  const progress = Math.min(elapsed / animationDuration, 1);
  const easedProgress = easeOutQuad(progress);

  // Устанавливаем ширину прогресс-бара
  progressBar.style.width = (easedProgress * 100) + '%';

  // Если анимация не завершена, продолжаем её
  if (progress < 1 && isPlaying) {
    rafId = requestAnimationFrame(animateProgressBar);
  } else {
    cancelAnimationFrame(rafId);
  }
}

// Скрытие кнопки воспроизведения
function hidePlayPauseButton() {
  playPauseBtn.style.opacity = '0';
}

// Сброс и запуск таймера автоскрытия кнопки
function resetHideTimeout() {
  clearTimeout(hideTimeout);
  playPauseBtn.style.opacity = '1'; // Показываем кнопку
  hideTimeout = setTimeout(hidePlayPauseButton, 2000); // Скрываем через 2 секунды
}

// Функция для переключения воспроизведения
function togglePlayPause() {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    isPlaying = true;
    startTimestamp = null; // Сбрасываем, чтобы начать с текущего времени
    requestAnimationFrame(animateProgressBar); // Продолжаем анимацию
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    isPlaying = false;
    pausedProgress += Date.now() - (startTimestamp || Date.now()); // Фиксируем прогресс на момент паузы
    cancelAnimationFrame(rafId);
  }
  resetHideTimeout(); // Перезапуск таймера скрытия кнопки
}

// Функция для переключения полноэкранного режима
function toggleFullscreen() {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
    // Пытаемся войти в полноэкранный режим
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.webkitRequestFullscreen) { // Для Safari
      videoContainer.webkitRequestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) { // Для Firefox
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.msRequestFullscreen) { // Для IE/Edge
      videoContainer.msRequestFullscreen();
    }
    fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>'; // Меняем иконку на "сжать"
  } else {
    // Выход из полноэкранного режима
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { // Для Safari
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) { // Для Firefox
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) { // Для IE/Edge
      document.msExitFullscreen();
    }
    fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>'; // Меняем иконку на "развернуть"
  }
}

// Навешиваем обработчик на кнопку и на видео для клика
playPauseBtn.addEventListener('click', togglePlayPause);
video.addEventListener('click', togglePlayPause); // Обработчик на видео

// Навешиваем обработчик на кнопку полноэкранного режима
fullscreenBtn.addEventListener('click', toggleFullscreen);

// Сбрасываем таймер при старте воспроизведения
video.addEventListener('play', resetHideTimeout);
video.addEventListener('pause', () => clearTimeout(hideTimeout)); // Показываем кнопку на паузе

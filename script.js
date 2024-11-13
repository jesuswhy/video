const video = document.getElementById('myVideo');
const progressBar = document.getElementById('progressBar');
const playPauseBtn = document.getElementById('playPauseBtn');

const animationDuration = 57000; // 60 секунд для прогресс-бара
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

// Навешиваем обработчик на кнопку и на видео для клика
playPauseBtn.addEventListener('click', togglePlayPause);
video.addEventListener('click', togglePlayPause); // Обработчик на видео

// Сбрасываем таймер при старте воспроизведения
video.addEventListener('play', resetHideTimeout);
video.addEventListener('pause', () => clearTimeout(hideTimeout)); // Показываем кнопку на паузе

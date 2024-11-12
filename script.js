const video = document.getElementById('myVideo');
const progressBar = document.getElementById('progressBar');
const playPauseBtn = document.getElementById('playPauseBtn');
let progress = 0;
let playRate = 1.0; // Начальная скорость прогресс-бара

// Функция для обновления прогресс-бара с замедлением
function updateProgressBar() {
  if (progress < video.duration) {
    progress += 0.05 * playRate; // Прогресс бар движется на основе playRate
    const percentage = (progress / video.duration) * 100;
    progressBar.style.width = percentage + '%';

    // Плавное замедление playRate по мере приближения к концу видео
    playRate = 1.0 - (progress / video.duration) * 0.9; // Скорость замедляется от 1.0 до 0.1
  }
}

// Отключаем перемотку
video.addEventListener('seeking', () => {
  if (video.currentTime > progress) {
    video.currentTime = progress;
  }
});

// Обновление прогресс-бара при воспроизведении
video.addEventListener('timeupdate', () => {
  if (!video.paused) {
    updateProgressBar();
  }
});

// Управление кнопкой Play/Pause
playPauseBtn.addEventListener('click', () => {
  if (video.paused) {
    video.play();
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>'; // Иконка паузы
  } else {
    video.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Иконка воспроизведения
  }
});

// ================= KHAI BÁO CÁC BIẾN TOÀN CỤC =================

const CORRECT_PIN = "1010"; // Mật mã đăng nhập mặc định (Mới: 1010)
let currentPasscode = "";
let failedAttempts = 0;

// Danh sách bài hát phục vụ trình phát nhạc
const playlist = [
  {
    title: "Nguyễn Văn Mười 💖",
    artist: "My Love",
    file: "music/Nguyễn Văn Mười.mp3",
    cover: "Pictures/1.jpg"
  },
  {
    title: "Nếu Như Ta Chẳng Còn 💝",
    artist: "Nhạc Tình Yêu",
    file: "music/Nếu Như Ta Chẳng Còn.mp3",
    cover: "Pictures/2.jpg"
  },
  {
    title: "Love 💕",
    artist: "Love Song",
    file: "music/Love.mp3",
    cover: "Pictures/3.jpg"
  },
  {
    title: "My Love Mine All Mine ☁️",
    artist: "Mitski",
    file: "music/Mitski - My Love Mine All Mine.mp3",
    cover: "Pictures/4.jpg"
  },
  {
    title: "Ariana Grande 🥰",
    artist: "Ariana Grande",
    file: "music/Ariana Grande.mp3",
    cover: "Pictures/5.jpg"
  },
  {
    title: "Nơi Này Có Anh 💖",
    artist: "Sơn Tùng M-TP",
    file: "music/Nơi Này Có Anh.MP3",
    cover: "Pictures/6.jpg"
  },
  {
    title: "Đúng Người Đúng Thời Điểm 💝",
    artist: "Thanh Hưng",
    file: "music/Đúng Người Đúng Thời Điểm.MP3",
    cover: "Pictures/7.jpg"
  },
  {
    title: "Ai Là Người Thương Em 💕",
    artist: "Quân A.P",
    file: "music/Ai Là Người Thương Em.MP3",
    cover: "Pictures/8.jpg"
  },
  {
    title: "Hơn Cả Mây Trời ☁️",
    artist: "Việt",
    file: "music/Hơn Cả Mây Trời.MP3",
    cover: "Pictures/9.jpg"
  },
  {
    title: "Em Có Nhớ Anh Không 🥰",
    artist: "Tú Na",
    file: "music/Em Có Nhớ Anh Không.MP3",
    cover: "Pictures/10.jpg"
  },
  {
    title: "Nhạc Nền Falling For You ❤️",
    artist: "3D Heart Theme",
    file: "nhac.mp3",
    cover: "Pictures/1.jpg"
  }
];

let currentTrackIndex = 0;
const audioPlayer = document.getElementById("main-audio");
let isPlaying = false;
let playbackSpeed = 1.0;

// Danh sách ảnh trong album
const photos = [
  "Pictures/1.jpg",
  "Pictures/2.jpg",
  "Pictures/3.jpg",
  "Pictures/4.jpg",
  "Pictures/5.jpg",
  "Pictures/6.jpg",
  "Pictures/7.jpg",
  "Pictures/8.jpg",
  "Pictures/9.jpg",
  "Pictures/10.jpg"
];
let currentPhotoIndex = 0;

// ================= KHỞI TẠO KHI TẢI TRANG =================

window.addEventListener("DOMContentLoaded", () => {
  // Tạo hiệu ứng trái tim bay lơ lửng ở hình nền
  initBackgroundHearts();
  
  // Nạp danh sách bài hát vào giao diện
  initPlaylistHTML();
  
  // Thiết lập bài hát đầu tiên cho trình phát nhạc
  loadTrack(0);
});

// ================= HIỆU ỨNG TRÁI TIM BAY NỀN (BACKGROUND) =================

function initBackgroundHearts() {
  const container = document.getElementById("bg-hearts");
  const heartIcons = ["fa-heart", "fa-heart", "fa-heart-pulse"];
  
  // Tạo 1 trái tim mỗi 1.2 giây
  setInterval(() => {
    const heart = document.createElement("i");
    const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.className = `fa-solid ${randomIcon} floating-heart`;
    heart.style.left = Math.random() * 100 + "vw";
    
    // Random kích thước từ 12px đến 28px
    const size = Math.random() * 16 + 12;
    heart.style.fontSize = size + "px";
    
    // Random thời gian di chuyển từ 8s đến 18s
    const duration = Math.random() * 10 + 8;
    heart.style.animationDuration = duration + "s";
    
    // Random độ mờ
    heart.style.opacity = Math.random() * 0.4 + 0.1;
    
    container.appendChild(heart);
    
    // Xóa trái tim sau khi hoàn thành animation để giải phóng bộ nhớ
    setTimeout(() => {
      heart.remove();
    }, duration * 1000);
  }, 1200);
}

// ================= LOGIC BÀN PHÍM VÀ ĐĂNG NHẬP =================

function pressNum(num) {
  if (currentPasscode.length < 6) {
    currentPasscode += num;
    updatePasscodeDisplay();
  }
}

function deleteLastDigit() {
  if (currentPasscode.length > 0) {
    currentPasscode = currentPasscode.slice(0, -1);
    updatePasscodeDisplay();
  }
}

function clearPasscode() {
  currentPasscode = "";
  updatePasscodeDisplay();
}

function updatePasscodeDisplay() {
  const inputEl = document.getElementById("passcode-input");
  // Hiển thị ký tự tròn đen tương ứng độ dài nhập vào
  inputEl.value = "●".repeat(currentPasscode.length);
}

function verifyPassword() {
  if (currentPasscode === CORRECT_PIN) {
    // Đăng nhập thành công! Hiệu ứng chuyển màn hình mượt mà
    const loginScreen = document.getElementById("login-screen");
    const mainScreen = document.getElementById("main-screen");
    
    loginScreen.style.transition = "opacity 0.5s ease";
    loginScreen.style.opacity = "0";
    
    setTimeout(() => {
      loginScreen.classList.add("hidden");
      mainScreen.classList.remove("hidden");
      mainScreen.style.opacity = "0";
      
      // Kích hoạt animation hiện dần
      setTimeout(() => {
        mainScreen.style.transition = "opacity 0.6s ease";
        mainScreen.style.opacity = "1";
      }, 50);
      
      // Tạo một cơn mưa tim ăn mừng
      celebrateLogin();
    }, 500);
  } else {
    // Đăng nhập thất bại
    failedAttempts++;
    alert("Sai mật khẩu mất rồi! Bé thử lại xem nhé 🥺");
    clearPasscode();
    
    // Nếu nhập sai 3 lần trở lên, tự động mở gợi ý
    if (failedAttempts >= 3) {
      showHintModal();
    }
  }
}

function celebrateLogin() {
  // Thả ngẫu nhiên 30 trái tim ăn mừng
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const heart = document.createElement("i");
      heart.className = "fa-solid fa-heart burst-heart";
      heart.style.left = Math.random() * 80 + 10 + "vw";
      heart.style.bottom = "0px";
      
      const size = Math.random() * 20 + 15;
      heart.style.fontSize = size + "px";
      
      // Tạo tọa độ bắn ngẫu nhiên lên trên
      const tx = (Math.random() - 0.5) * 200;
      const ty = -(Math.random() * 300 + 200);
      const tr = Math.random() * 360;
      
      heart.style.setProperty("--x", `${tx}px`);
      heart.style.setProperty("--y", `${ty}px`);
      heart.style.setProperty("--r", `${tr}deg`);
      
      document.getElementById("heart-burst-container").appendChild(heart);
      
      setTimeout(() => {
        heart.remove();
      }, 1500);
    }, i * 50);
  }
}

// ================= GỢI Ý MẬT MÃ POPUP =================

function showHintModal() {
  document.getElementById("hint-modal").classList.remove("hidden");
}

function closeHintModal() {
  document.getElementById("hint-modal").classList.add("hidden");
}

// ================= QUẢN LÝ POPUP CHUNG =================

function openPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.remove("hidden");
  
  // Nếu mở gallery, load ảnh hiện tại
  if (id === "gallery-popup") {
    loadPhoto(currentPhotoIndex);
  }
}

function closePopup(id) {
  document.getElementById(id).classList.add("hidden");
}

// ================= TRÌNH PHÁT NHẠC (MUSIC SECTION) =================

function initPlaylistHTML() {
  const listContainer = document.getElementById("music-playlist");
  listContainer.innerHTML = "";
  
  playlist.forEach((track, index) => {
    const trackItem = document.createElement("div");
    trackItem.className = `music-track-item ${index === currentTrackIndex ? "active" : ""}`;
    trackItem.onclick = () => selectTrack(index);
    
    trackItem.innerHTML = `
      <div class="track-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="track-info">
        <span class="track-title">${track.title}</span>
        <span class="track-artist">${track.artist}</span>
      </div>
      <div class="track-play-icon">
        <i class="fa-solid ${index === currentTrackIndex && isPlaying ? "fa-circle-pause" : "fa-circle-play"}"></i>
      </div>
    `;
    listContainer.appendChild(trackItem);
  });
}

function loadTrack(index) {
  currentTrackIndex = index;
  const track = playlist[index];
  
  audioPlayer.src = track.file;
  audioPlayer.load();
  playbackSpeed = 1.0;
  audioPlayer.playbackRate = playbackSpeed;
  document.getElementById("speed-btn").innerText = "1.0x";
  
  // Cập nhật giao diện Trình phát nhạc
  document.getElementById("player-song-title").innerText = track.title;
  document.getElementById("player-song-artist").innerText = track.artist;
  document.getElementById("player-cover").src = track.cover;
  
  // Cập nhật trạng thái active trên danh sách bài hát
  const items = document.querySelectorAll(".music-track-item");
  items.forEach((item, idx) => {
    if (idx === index) {
      item.classList.add("active");
      item.querySelector(".track-play-icon i").className = isPlaying ? "fa-solid fa-circle-pause" : "fa-solid fa-circle-play";
    } else {
      item.classList.remove("active");
      item.querySelector(".track-play-icon i").className = "fa-solid fa-circle-play";
    }
  });

  // Thiết lập lại thanh trượt tiến trình
  document.getElementById("progress-bar").value = 0;
  document.getElementById("time-current").innerText = "00:00";
}

function selectTrack(index) {
  if (index === currentTrackIndex) {
    togglePlay();
  } else {
    isPlaying = true;
    loadTrack(index);
    audioPlayer.play()
      .then(() => {
        updatePlayButtonState(true);
      })
      .catch(e => console.log("Không thể tự động phát nhạc:", e));
  }
}

function togglePlay() {
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
    updatePlayButtonState(false);
  } else {
    audioPlayer.play()
      .then(() => {
        isPlaying = true;
        updatePlayButtonState(true);
      })
      .catch(e => console.log("Lỗi khi phát nhạc:", e));
  }
}

function updatePlayButtonState(playing) {
  const playBtn = document.getElementById("play-btn");
  const coverImg = document.getElementById("player-cover");
  
  if (playing) {
    playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    coverImg.className = "rotating-playing";
  } else {
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    coverImg.className = "rotating-paused";
  }
  
  // Cập nhật biểu tượng ở danh sách nhạc
  initPlaylistHTML();
}

// Lắng nghe sự kiện audio
audioPlayer.addEventListener("timeupdate", () => {
  if (audioPlayer.duration) {
    const curTime = audioPlayer.currentTime;
    const durTime = audioPlayer.duration;
    
    // Cập nhật thanh trượt
    const percent = (curTime / durTime) * 100;
    document.getElementById("progress-bar").value = percent;
    
    // Cập nhật hiển thị thời gian
    document.getElementById("time-current").innerText = formatTime(curTime);
  }
});

audioPlayer.addEventListener("loadedmetadata", () => {
  document.getElementById("time-total").innerText = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener("ended", () => {
  // Tự động chuyển bài kế tiếp khi hết bài
  let nextIndex = currentTrackIndex + 1;
  if (nextIndex >= playlist.length) {
    nextIndex = 0; // Quay lại bài đầu tiên
  }
  selectTrack(nextIndex);
});

// Kéo thanh trượt để tua nhạc
document.getElementById("progress-bar").addEventListener("input", (e) => {
  if (audioPlayer.duration) {
    const newTime = (e.target.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  }
});

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Tua đi/tua lại 10 giây
function skipAudio(seconds) {
  audioPlayer.currentTime = Math.max(0, Math.min(audioPlayer.duration || 0, audioPlayer.currentTime + seconds));
}

// Thay đổi tốc độ phát
function changePlaybackSpeed() {
  if (playbackSpeed === 1.0) {
    playbackSpeed = 1.25;
  } else if (playbackSpeed === 1.25) {
    playbackSpeed = 1.5;
  } else {
    playbackSpeed = 1.0;
  }
  audioPlayer.playbackRate = playbackSpeed;
  document.getElementById("speed-btn").innerText = playbackSpeed.toFixed(2) + "x";
}

// Tắt/Mở âm lượng
function toggleMute() {
  const volumeBtn = document.getElementById("volume-btn");
  if (audioPlayer.muted) {
    audioPlayer.muted = false;
    volumeBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
  } else {
    audioPlayer.muted = true;
    volumeBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
  }
}

// ================= THƯ VIỆN ẢNH (GALLERY SECTION) =================

function loadPhoto(index) {
  currentPhotoIndex = index;
  const imgEl = document.getElementById("gallery-current-image");
  imgEl.style.opacity = "0"; // Tạo hiệu ứng mờ đi để đổi ảnh
  
  setTimeout(() => {
    imgEl.src = photos[index];
    imgEl.style.opacity = "1";
    document.getElementById("gallery-title").innerText = `Gallery Ảnh Tình Yêu - Số ${index + 1}/${photos.length}`;
  }, 150);
}

function navigateGallery(direction) {
  let newIndex = currentPhotoIndex + direction;
  if (newIndex < 0) {
    newIndex = photos.length - 1; // Quay lại cuối
  } else if (newIndex >= photos.length) {
    newIndex = 0; // Quay về đầu
  }
  loadPhoto(newIndex);
}

// Hiệu ứng bong bóng trái tim bay khi nhấn thả tim
function triggerHeartBurst(event) {
  const container = document.getElementById("heart-burst-container");
  const heartIcons = ["fa-heart", "fa-heart", "fa-heart-pulse"];
  
  // Tọa độ nút bấm
  const rect = event.currentTarget.getBoundingClientRect();
  const startX = rect.left + rect.width / 2;
  const startY = rect.top;

  // Tạo 15 trái tim bay lên tỏa rộng
  for (let i = 0; i < 15; i++) {
    const heart = document.createElement("i");
    const randomIcon = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    heart.className = `fa-solid ${randomIcon} burst-heart`;
    heart.style.left = startX + "px";
    heart.style.top = startY + "px";
    
    // Tùy biến kích thước trái tim
    const size = Math.random() * 20 + 12;
    heart.style.fontSize = size + "px";
    
    // Tạo quỹ đạo bay (x: lệch trái phải, y: bay lên cao)
    const angle = (Math.random() * 120 + 30) * (Math.PI / 180); // từ 30 đến 150 độ
    const velocity = Math.random() * 180 + 120; // tốc độ
    const tx = Math.cos(angle) * velocity;
    const ty = -Math.sin(angle) * velocity - 100; // bay cao hơn
    
    const tr = Math.random() * 360; // quay góc
    
    heart.style.setProperty("--x", `${tx}px`);
    heart.style.setProperty("--y", `${ty}px`);
    heart.style.setProperty("--r", `${tr}deg`);
    
    // Random màu sắc tông hồng
    const colors = ["#ff4d6d", "#ff758f", "#ff85a1", "#ffccd5", "#ff0054", "#ff5400"];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(heart);
    
    // Dọn dẹp hạt sau khi bay xong
    setTimeout(() => {
      heart.remove();
    }, 1500);
  }
}

// ================= KHU VỰC FALLING FOR YOU =================

function openFallingForYou() {
  // Dừng phát nhạc ở ứng dụng chính trước để tránh đè nhạc
  if (isPlaying) {
    togglePlay();
  }
  
  const fallingPopup = document.getElementById("falling-popup");
  const iframe = document.getElementById("falling-iframe");
  
  // Tải trang falling.html
  iframe.src = "falling.html";
  fallingPopup.classList.remove("hidden");
}

function closeFallingForYou() {
  const fallingPopup = document.getElementById("falling-popup");
  const iframe = document.getElementById("falling-iframe");
  
  // Dừng tải trang và dừng nhạc bên trong iframe
  iframe.src = "";
  fallingPopup.classList.add("hidden");
}

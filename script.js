
const $ = (id) => document.getElementById(id);

const screenIds = ["intro", "quiz", "result", "twist"];

const questions = [
  {
    title: "Nếu crush nhắn “em ngủ chưa?” lúc 2 giờ sáng, b sẽ...",
    desc: "Hệ thống đang phân tích mức độ tỉnh táo của người chơi.",
    answers: [
      "A. Ngủ rồi, linh hồn vẫn online.",
      "B. Rep trong 0,2 giây rồi giả vờ tình cờ.",
      "C. Chụp màn hình gửi hội đồng quản trị.",
      "D. Crush nào? Tui chỉ có deadline."
    ],
    reactions: [
      "Hồn offline mà tay vẫn rep, công nghệ phát triển quá.",
      "Tốc độ rep nhanh hơn tốc độ làm bài tập. Đáng nghi!",
      "Hội đồng quản trị đã nhận hồ sơ. Chờ xét duyệt.",
      "Deadline nghe xong cũng thấy được an ủi."
    ]
  },
  {
    title: "Khi nghe câu “Tao kể m nghe cái này, đừng nói ai nha”...",
    desc: "Cảnh báo: kỹ năng quản lý thông tin sắp được kiểm tra.",
    answers: [
      "A. Được, kể đi. Tui kín miệng lắm.",
      "B. Bật chế độ hóng chuyện cấp quốc gia.",
      "C. Nghe xong nhớ rõ hơn cả bài Văn.",
      "D. Tui không nhiều chuyện, tui chỉ cập nhật dữ liệu."
    ],
    reactions: [
      "Câu nói kinh điển trước khi một bí mật có thêm nhân chứng.",
      "Tai đã kết nối Wi-Fi, không thể ngắt mạng.",
      "Bài kiểm tra thì quên, chuyện lớp thì nhớ từng dấu phẩy.",
      "Nghe chuyên nghiệp vậy thôi chứ hệ thống biết hết rồi."
    ]
  },
  {
    title: "Nếu được tặng quà 20/10, b chọn món nào?",
    desc: "Đây là khảo sát nghiêm túc. Nghiêm túc khoảng 3%.",
    answers: [
      "A. Tiền mặt. Tình cảm chưa thanh toán được hóa đơn.",
      "B. Đồ ăn. Nói ít thôi, đặt món đi.",
      "C. Một ngày không deadline, không kiểm tra.",
      "D. Cả ba. Đừng bắt tui phải lựa chọn."
    ],
    reactions: [
      "Thẳng thắn, thực tế, không lòng vòng. Nhà đầu tư tương lai!",
      "Trái tim có thể tan vỡ, đồ ăn thì không được phép nguội.",
      "Ước mơ giản dị nhưng giáo viên nghe hơi áp lực.",
      "Tham vọng lớn, tầm nhìn xa. Hệ thống ghi nhận!"
    ]
  }
];

const ranks = [
  {
    name: "BÀ HOÀNG NGOẠI GIAO",
    icon: "🤝",
    text: "Biết nói đúng lúc, biết hóng đúng chuyện. Khả năng ứng biến của b khiến hệ thống cũng phải dè chừng."
  },
  {
    name: "CHÚA TỂ HÓNG CHUYỆN",
    icon: "👁️",
    text: "Thông tin chưa được công bố nhưng b đã có mặt tại hiện trường. Tốc độ cập nhật đáng được đưa vào sách giáo khoa."
  },
  {
    name: "CHIẾN THẦN THỰC TẾ",
    icon: "💸",
    text: "Không màu mè, không vòng vo. Có quà thì vui, có đồ ăn thì càng vui. Một lối sống đáng học hỏi."
  },
  {
    name: "NỮ HOÀNG BẤT ỔN",
    icon: "👑",
    text: "Không ai biết b đang nghĩ gì, kể cả chính b. Nhưng có một điều chắc chắn: b luôn có cách biến chuyện bình thường thành chuyện để kể."
  }
];

let currentQuestion = 0;
let answersChosen = [];
let hasAnswered = false;
let twistOpened = false;

function showScreen(id) {
  screenIds.forEach((screenId) => {
    $(screenId).classList.toggle("active", screenId === id);
  });

  const status = {
    intro: "WAITING PLAYER...",
    quiz: "MISSION IN PROGRESS",
    result: "MISSION COMPLETE",
    twist: "SECRET FILE FOUND"
  };

  $("systemStatus").textContent = status[id] || "SYSTEM ONLINE";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showToast(message) {
  const layer = $("toastLayer");
  const toast = document.createElement("div");

  toast.className = "toast";
  toast.textContent = message;
  layer.replaceChildren(toast);

  window.setTimeout(() => {
    if (toast.parentNode === layer) {
      toast.remove();
    }
  }, 2200);
}

function resetGame() {
  currentQuestion = 0;
  answersChosen = [];
  hasAnswered = false;
  twistOpened = false;

  $("nextBtn").classList.add("hidden");
  $("finalReveal").classList.add("hidden");
  $("revealBtn").classList.remove("hidden");

  $("twistMessage").textContent = "ĐANG GIẢI MÃ PHẦN THƯỞNG...";
  $("toastLayer").replaceChildren();
}

function renderQuestion() {
  const question = questions[currentQuestion];

  hasAnswered = false;

  $("levelLabel").textContent =
    `STAGE 0${currentQuestion + 1}`;

  $("questionCount").textContent =
    `0${currentQuestion + 1} / 0${questions.length}`;

  $("progressBar").style.width =
    `${(currentQuestion / questions.length) * 100}%`;

  $("questionTitle").textContent = question.title;
  $("questionDesc").textContent = question.desc;
  $("feedback").textContent = "";
  $("nextBtn").classList.add("hidden");

  const list = $("answerList");
  list.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-btn";
    button.textContent = answer;

    button.addEventListener("click", () => selectAnswer(index));

    list.appendChild(button);
  });
}

function selectAnswer(index) {
  if (hasAnswered) return;

  hasAnswered = true;
  answersChosen[currentQuestion] = index;

  const question = questions[currentQuestion];
  const buttons = $("answerList").querySelectorAll(".answer-btn");

  buttons.forEach((button, i) => {
    button.disabled = true;

    if (i === index) {
      button.classList.add("selected");
    }
  });

  $("feedback").textContent = `> ${question.reactions[index]}`;

  $("progressBar").style.width =
    `${((currentQuestion + 1) / questions.length) * 100}%`;

  $("nextBtn").textContent =
    currentQuestion === questions.length - 1
      ? "XEM BÁO CÁO CUỐI ▶"
      : "STAGE TIẾP THEO ▶";

  $("nextBtn").classList.remove("hidden");
}

function calculateRank() {
  const a = answersChosen;

  // Không có đáp án đúng hoặc sai.
  // Chọn D ở câu cuối sẽ mở danh hiệu đặc biệt.
  if (a[2] === 3) {
    return {
      name: "TRÙM CUỐI THAM VỌNG",
      icon: "💎",
      text: "Người khác chọn một, b chọn tất cả. Hệ thống không phán xét, chỉ âm thầm kiểm tra ngân sách."
    };
  }

  if (a[1] === 1 || a[1] === 2 || a[1] === 3) {
    return ranks[1];
  }

  if (a[2] === 0 || a[2] === 1) {
    return ranks[2];
  }

  if (a[0] === 2) {
    return ranks[0];
  }

  return ranks[3];
}

function showResult() {
  const rank = calculateRank();

  $("resultIcon").textContent = rank.icon;
  $("rankName").textContent = rank.name;
  $("resultTitle").textContent = "HỒ SƠ NGƯỜI CHƠI";
  $("resultText").textContent = rank.text;

  const achievements = [
    "Đã vượt qua 3 câu hỏi vô tri.",
    "Đã mở khóa kỹ năng sinh tồn học đường.",
    "Đã chứng minh khả năng lựa chọn quà.",
    "Được hệ thống công nhận là nhân tố khó đoán."
  ];

  const achievementIndex =
    (answersChosen[0] + answersChosen[1] + answersChosen[2]) % achievements.length;

  $("achievementText").textContent = achievements[achievementIndex];

  showScreen("result");
  showToast("ACHIEVEMENT UNLOCKED!");
}

function openTwist() {
  twistOpened = false;

  $("finalReveal").classList.add("hidden");
  $("revealBtn").classList.remove("hidden");
  $("twistMessage").textContent = "ĐANG GIẢI MÃ PHẦN THƯỞNG...";

  showScreen("twist");
}

function revealGift() {
  if (twistOpened) return;

  twistOpened = true;

  $("twistMessage").textContent =
    "GIẢI MÃ THÀNH CÔNG! PHÁT HIỆN 01 GÓI DEADLINE.";

  $("finalReveal").classList.remove("hidden");
  $("revealBtn").classList.add("hidden");

  showToast("SURPRISE! 💀");

  $("finalReveal").scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

$("startBtn").addEventListener("click", () => {
  resetGame();
  currentQuestion = 0;
  renderQuestion();
  showScreen("quiz");
});

$("nextBtn").addEventListener("click", () => {
  if (!hasAnswered) return;

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    showResult();
  }
});

$("twistBtn").addEventListener("click", openTwist);

$("revealBtn").addEventListener("click", revealGift);

$("replayBtn").addEventListener("click", () => {
  resetGame();
  showScreen("intro");
});

showScreen("intro");

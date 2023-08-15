
let timer;
let isTimerRunning = false;
let minutes = 25;
let seconds = 0;


const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');


startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);
resetBtn.addEventListener('click', resetTimer);


function startTimer() {
    if (!isTimerRunning) {
        timer = setInterval(updateTimer, 1000);
        isTimerRunning = true;
    }
}


function stopTimer() {
    if (isTimerRunning) {
        clearInterval(timer);
        isTimerRunning = false;
    }
}


function resetTimer() {
    stopTimer();
    minutes = 25;
    seconds = 0;
    updateDisplay();
}


function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            stopTimer();

        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateDisplay();
}


function updateDisplay() {
    minutesDisplay.textContent = minutes < 10 ? '0' + minutes : minutes;
    secondsDisplay.textContent = seconds < 10 ? '0' + seconds : seconds;
}


updateDisplay();



const taskList = document.getElementById('task-list');
const addTaskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');


addTaskForm.addEventListener('submit', addTask);


function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText !== '') {
        const li = document.createElement('li');
        li.textContent = taskText;
        taskList.appendChild(li);
        taskInput.value = '';
    }
}


const statistics = document.getElementById('statistics');
let completedTasks = 0;
let totalWorkTime = 0;


function updateStatistics() {
    statistics.innerHTML = `
    <p>Tamamlanan Görev Sayısı: ${completedTasks}</p>
    <p>Toplam Çalışma Süresi: ${totalWorkTime} dakika</p>
  `;
}


function onPomodoroCompleted() {
    completedTasks++;
    totalWorkTime += 25;
    updateStatistics();
}

// ...


updateDisplay();
updateStatistics();
// ...


const workDuration = 25;
const shortBreakDuration = 5;
const longBreakDuration = 15;
let currentCycle = 1;
let totalCycles = 4; // Toplam döngü sayısı (ayarlanabilir).
let currentTimerType = 'work'; // Başlangıçta çalışma süresi ile başlayacak.

// Pomodoro zamanlayıcı başlatma fonksiyonu
function startTimer() {
    if (!isTimerRunning) {
        timer = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        toggleTimerButtons(false); // Zamanlayıcı çalışırken butonları devre dışı bırakın.
    }
}

// Pomodoro zamanlayıcısını sıfırlama fonksiyonu
function resetTimer() {
    stopTimer();
    minutes = workDuration;
    seconds = 0;
    currentCycle = 1;
    currentTimerType = 'work';
    updateDisplay();
    toggleTimerButtons(true); // Zamanlayıcı sıfırlandığında butonları etkinleştirin.
}

// Pomodoro zamanlayıcı güncelleme fonksiyonu
function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            stopTimer();
            if (currentCycle < totalCycles) {
                // Çalışma süresi tamamlandı, mola süresine geçiş yap.
                if (currentTimerType === 'work') {
                    currentCycle++;
                    if (currentCycle % 4 === 0) {
                        // Her 4 döngüde bir uzun mola süresi.
                        minutes = longBreakDuration;
                        currentTimerType = 'longBreak';
                    } else {
                        minutes = shortBreakDuration;
                        currentTimerType = 'shortBreak';
                    }
                } else {
                    // Mola süresi tamamlandı, çalışma süresine geçiş yap.
                    minutes = workDuration;
                    currentTimerType = 'work';
                }
                onPomodoroCompleted();
                startTimer();
            } else {
                // Toplam döngü sayısına ulaşıldı, tüm pomodoro tamamlandı.
                onAllPomodorosCompleted();
            }
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateDisplay();
}

// Pomodoro zamanlayıcısını güncellemek için butonları etkinleştirme / devre dışı bırakma fonksiyonu
function toggleTimerButtons(enable) {
    startBtn.disabled = !enable;
    stopBtn.disabled = enable;
    resetBtn.disabled = !enable;
}

// Tüm pomodoro tamamlandığında yapılacak işlemler
function onAllPomodorosCompleted() {
    // Örnek: Tüm pomodoro tamamlandığında kullanıcıya tebrik mesajı gösterin.
    alert('Tebrikler! Tüm pomodoro döngüleri tamamlandı.');
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...

// İstatistikler için grafik gösterimi özelliği
const statisticsChart = document.getElementById('statistics-chart').getContext('2d');
const chartOptions = {
    type: 'bar',
    data: {
        labels: ['Tamamlanan Görevler', 'Toplam Çalışma Süresi'],
        datasets: [{
            label: 'İstatistikler',
            backgroundColor: ['#007BFF', '#FFC107'],
            borderColor: '#fff',
            data: [completedTasks, totalWorkTime],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                stepSize: 1,
            },
            x: {
                grid: {
                    display: false,
                }
            }
        }
    }
};
const statisticsBarChart = new Chart(statisticsChart, chartOptions);

// Geri bildirim sağlama özelliği
function giveFeedback() {
    // Örnek: Çalışma süresi tamamlandığında kullanıcıya geri bildirim mesajı gösterin.
    alert('Harika iş! Bir pomodoro döngüsünü tamamladınız. Biraz mola vermek için hazır mısınız?');
}

// Pomodoro zamanlayıcı tamamlandığında yapılacak işlemler
function onPomodoroCompleted() {
    completedTasks++;
    totalWorkTime += workDuration; // Pomodoro döngüsü çalışma süresi kadar ekle.
    updateStatistics();
    statisticsBarChart.data.datasets[0].data = [completedTasks, totalWorkTime];
    statisticsBarChart.update();
    giveFeedback(); // Pomodoro tamamlandığında geri bildirim sağlayın.
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...


// Pomodoro zamanlayıcı başlatma fonksiyonu (5. güne taşındı)
function startTimer() {
    if (!isTimerRunning) {
        timer = setInterval(updateTimer, 1000);
        isTimerRunning = true;
        toggleTimerButtons(false); // Zamanlayıcı çalışırken butonları devre dışı bırakın.
    }
}

// Pomodoro zamanlayıcısını sıfırlama fonksiyonu (5. güne taşındı)
function resetTimer() {
    stopTimer();
    minutes = workDuration;
    seconds = 0;
    currentCycle = 1;
    currentTimerType = 'work';
    updateDisplay();
    toggleTimerButtons(true); // Zamanlayıcı sıfırlandığında butonları etkinleştirin.
}

// Pomodoro zamanlayıcı güncelleme fonksiyonu (5. güne taşındı)
function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            stopTimer();
            if (currentCycle < totalCycles) {
                // Çalışma süresi tamamlandı, mola süresine geçiş yap.
                if (currentTimerType === 'work') {
                    currentCycle++;
                    if (currentCycle % 4 === 0) {
                        // Her 4 döngüde bir uzun mola süresi.
                        minutes = longBreakDuration;
                        currentTimerType = 'longBreak';
                    } else {
                        minutes = shortBreakDuration;
                        currentTimerType = 'shortBreak';
                    }
                } else {
                    // Mola süresi tamamlandı, çalışma süresine geçiş yap.
                    minutes = workDuration;
                    currentTimerType = 'work';
                }
                onPomodoroCompleted();
                startTimer();
            } else {
                // Toplam döngü sayısına ulaşıldı, tüm pomodoro tamamlandı.
                onAllPomodorosCompleted();
            }
        } else {
            minutes--;
            seconds = 59;
        }
    } else {
        seconds--;
    }
    updateDisplay();
}

// Pomodoro zamanlayıcısını güncellemek için butonları etkinleştirme / devre dışı bırakma fonksiyonu (5. güne taşındı)
function toggleTimerButtons(enable) {
    startBtn.disabled = !enable;
    stopBtn.disabled = enable;
    resetBtn.disabled = !enable;
}

// Geri bildirim sağlama özelliği (3. güne eklendi)
function giveFeedback() {
    if (currentTimerType === 'work') {
        // Örnek: Çalışma süresi tamamlandığında kullanıcıya geri bildirim mesajı gösterin.
        alert('Harika iş! Bir pomodoro döngüsünü tamamladınız. Biraz mola vermek için hazır mısınız?');
    } else {
        // Örnek: Mola süresi tamamlandığında kullanıcıya geri bildirim mesajı gösterin.
        alert('Mola süresi tamamlandı. Şimdi bir sonraki çalışma süresine başlayın!');
    }
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...



// Geri bildirim sağlama işlevi (4. güne taşındı)
function giveFeedback() {
    if (currentTimerType === 'work') {
        alert('Harika iş! Bir pomodoro döngüsünü tamamladınız. Biraz mola vermek için hazır mısınız?');
    } else {
        alert('Mola süresi tamamlandı. Şimdi bir sonraki çalışma süresine başlayın!');
    }
}

// Pomodoro zamanlayıcı tamamlandığında yapılacak işlemler
function onPomodoroCompleted() {
    completedTasks++;
    totalWorkTime += workDuration;
    updateStatistics();
    statisticsBarChart.data.datasets[0].data = [completedTasks, totalWorkTime];
    statisticsBarChart.update();
    giveFeedback(); // Pomodoro tamamlandığında geri bildirim sağlayın.
}

// Tüm pomodoro döngüleri tamamlandığında yapılacak işlemler
function onAllPomodorosCompleted() {
    alert('Tebrikler! Tüm pomodoro döngülerini başarıyla tamamladınız.');
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...

// Pomodoro zamanlayıcı için güncellenmiş değişkenler (3. güne taşındı, tekrar hatırlatma amaçlı)
// ...



// Pomodoro zamanlayıcı başlatma fonksiyonu (3. güne taşındı)
function startTimer() {
    if (!isTimerRunning) {
        timerInterval = setInterval(updateTimer, 1000); // setInterval sonucunu timerInterval değişkenine atayın.
        isTimerRunning = true;
        toggleTimerButtons(false); // Zamanlayıcı çalışırken butonları devre dışı bırakın.
    }
}

// Pomodoro zamanlayıcısını durdurma fonksiyonu (5. güne taşındı)
function stopTimer() {
    clearInterval(timerInterval); // setInterval'i durdurun.
    isTimerRunning = false;
    toggleTimerButtons(true); // Zamanlayıcı durduğunda butonları etkinleştirin.
}

// Pomodoro zamanlayıcısını sıfırlama fonksiyonu (3. güne taşındı)
function resetTimer() {
    stopTimer();
    minutes = workDuration;
    seconds = 0;
    currentCycle = 1;
    currentTimerType = 'work';
    updateDisplay();
    toggleTimerButtons(true); // Zamanlayıcı sıfırlandığında butonları etkinleştirin.
}

// Pomodoro zamanlayıcısını güncellemek için butonları etkinleştirme / devre dışı bırakma fonksiyonu (3. güne taşındı)
// ...

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...



const registerLink = document.getElementById('register-link');

loginForm.addEventListener('submit', loginUser);
registerLink.addEventListener('click', showRegisterForm);

function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Burada kullanıcı adı ve şifre kontrolü yapabilir ve giriş işlemlerini gerçekleştirebilirsiniz.
    // Örnek olarak, kullanıcı adı ve şifrenin doğruluğunu bir şekilde kontrol edebilir ve giriş işlemlerini yapabilirsiniz.
}

function showRegisterForm(e) {
    e.preventDefault();
    // Kayıt olma formunu göstermek için gerekli işlemleri burada yapabilirsiniz.
    // Örnek olarak, kayıt olma formunu göstermek için yeni bir HTML içeriği ekleyebilir veya yeni bir sayfaya yönlendirebilirsiniz.
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...
// ...



registerForm.addEventListener('submit', registerUser);

function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;




    // Kayıt işlemi tamamlandıktan sonra kullanıcıyı ana sayfaya yönlendirebilirsiniz.
    window.location.href = 'index.html'; // Ana sayfaya yönlendirme işlemi.
}

// ...

// Sayfa yüklendiğinde başlangıç ​​durumunu güncelleme
updateDisplay();
updateStatistics();
// ...


loginButton.addEventListener('click', redirectToLoginPage);

function redirectToLoginPage() {
    window.location.href = 'login.html'; // Yeni sayfaya yönlendirme işlemi.
}


function startTimer() {
    if (!isTimerRunning) {
        timerInterval = setInterval(updateTimer, 1000); // setInterval sonucunu timerInterval değişkenine atayın.
        isTimerRunning = true;
        toggleTimerButtons(false); // Zamanlayıcı çalışırken butonları devre dışı bırakın.
    }
}


function stopTimer() {
    clearInterval(timerInterval); // setInterval'i durdurun.
    isTimerRunning = false;
    toggleTimerButtons(true); // Zamanlayıcı durduğunda butonları etkinleştirin.
}


function resetTimer() {
    stopTimer();
    // Diğer sıfırlama işlemleri (dakika, saniye, vs. gibi)
    // ...
    updateDisplay();
    toggleTimerButtons(true); // Zamanlayıcı sıfırlandığında butonları etkinleştirin.
}


updateDisplay();
updateStatistics();

// ...


function checkUserLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // Kullanıcı giriş yapmışsa, pomodoro zamanlayıcısını gösterin.
        showPomodoroTimer();
    } else {
        // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendirin.
        redirectToLoginPage();
    }
}


function showPomodoroTimer() {
    const loginButton = document.getElementById('login-button');
    loginButton.style.display = 'none'; // Giriş butonunu gizleyin.

    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
    <!-- Pomodoro zamanlayıcı için HTML içeriğini buraya ekleyin -->
    <!-- Örneğin: Çalışma, mola süreleri ve butonlar -->
  `;
}


// ...



loginButton.addEventListener('click', redirectToLoginPage);

function redirectToLoginPage() {
    window.location.href = 'login.html'; // Yeni sayfaya yönlendirme işlemi.
}


function checkUserLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
        // Kullanıcı giriş yapmışsa, pomodoro zamanlayıcısını gösterin.
        showPomodoroTimer();
    } else {
        // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendirin.
        redirectToLoginPage();
    }
}


function loginUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Burada kullanıcı adı ve şifre kontrolü yapabilir ve giriş işlemlerini gerçekleştirebilirsiniz.
    // Örneğin, kullanıcı adı ve şifrenin doğruluğunu kontrol edin.
    // Örnek olarak, bir veritabanında kayıtlı kullanıcı bilgilerini kontrol edebilirsiniz.
    // Şimdilik sadece örnek olarak kullanıcı adı "admin" ve şifre "1234" ile giriş yaptığını varsayalım.
    if (username === 'admin' && password === '1234') {
        // Kullanıcı giriş işlemi başarılı.
        // Kullanıcı adını localStorage'ye kaydedin.
        localStorage.setItem('loggedInUser', username);

        // Kullanıcı giriş yaptıktan sonra pomodoro zamanlayıcısını gösterin.
        showPomodoroTimer();
    } else {
        // Kullanıcı giriş işlemi başarısız.
        alert('Kullanıcı adı veya şifre yanlış.');
    }
}


function showPomodoroTimer() {
    const loginButton = document.getElementById('login-button');
    loginButton.style.display = 'none'; // Giriş butonunu gizleyin.

    const mainContent = document.querySelector('main');
    mainContent.innerHTML = `
    <!-- Pomodoro zamanlayıcı için HTML içeriğini buraya ekleyin -->
    <!-- Örneğin: Çalışma, mola süreleri ve butonlar -->
  `;
}

// ...


updateDisplay();
updateStatistics();



const loginButton = document.getElementById('login-button');

loginButton.addEventListener('click', redirectToLoginPage);

function redirectToLoginPage() {
    window.location.href = 'login.html'; // Yeni sayfaya yönlendirme işlemi.
}

// ...
// ...


const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', registerUser);

function registerUser(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Burada kullanıcının girdiği bilgileri bir veritabanında kaydedebilirsiniz.
    // Örneğin, kullanıcı adı, e-posta ve şifreyi bir veritabanına ekleyebilirsiniz.
    // Şimdilik bu bilgileri sadece örnek olarak konsola yazdırıyoruz.
    console.log('Kullanıcı Adı:', username);
    console.log('E-posta:', email);
    console.log('Şifre:', password);

    // Kullanıcı kayıt işlemi tamamlandığında giriş sayfasına yönlendirin.
    redirectToLoginPage();
}

// ...
// ...


function checkUserLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {

        showPomodoroTimer();
    } else {

        redirectToLoginPage();
    }
}


function showPomodoroTimer() {
    const loginButton = document.getElementById('login-button');
    loginButton.style.display = 'none'; // Giriş butonunu gizleyin.

    const pomodoroTimer = document.getElementById('pomodoro-timer');
    pomodoroTimer.style.display = 'block'; // Pomodoro zamanlayıcısını gösterin.

    // Pomodoro zamanlayıcısı için gerekli HTML içeriğini buraya ekleyebilirsiniz.
    // Örneğin, çalışma, mola süreleri ve butonlar ekleyebilirsiniz.


    pomodoroTimer.innerHTML = `
      <div class="timer-container">
        <h2>Çalışma Süresi</h2>
        <input type="number" id="work-duration" value="25" min="1" max="60">
        <button id="start-button" onclick="startTimer()">Başlat</button>
        <button id="stop-button" onclick="stopTimer()">Durdur</button>
      </div>
    `;
}


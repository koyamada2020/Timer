// 最大6桁の数値を格納する時間文字列
let timerText = '';

let hourStr;
let minuteStr;
let secondStr;

let timerId;

let startFlag = false;

const COOKIE_KEY_H = 'CKTH';
const COOKIE_KEY_M = 'CKTM';
const COOKIE_KEY_S = 'CKTS';

// https://ja.javascript.info/cookie#ref-880
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function inputNumber(el) {
    const num = el.textContent;
    // 数値が6桁になるまで結合する
    if (timerText.length < 6) {
        timerText += num;
    }
    displayTimerText();
}

function displayTimerText() {
    // Cookie に保存されていればその値を利用する
    hourStr = getCookie(COOKIE_KEY_H);
    minuteStr = getCookie(COOKIE_KEY_M);
    secondStr = getCookie(COOKIE_KEY_S);

    // 0埋め
    const sixNum = ('000000' + timerText).slice(-6);

    // 2桁ごと時間を分割して代入 "123456" = "12" "34" "56"
    hourStr = hourStr || sixNum.substr(0, 2);
    minuteStr = minuteStr || sixNum.substr(2, 2);
    secondStr = secondStr || sixNum.substr(4, 2);

    // 時間を表示する要素を取得
    const hourEl = document.getElementById('hour');
    const minuteEl = document.getElementById('minute');
    const secondEl = document.getElementById('second');

    // 画面に表示する時間を代入
    hourEl.textContent = hourStr;
    minuteEl.textContent = minuteStr;
    secondEl.textContent = secondStr;
}

function pauseTimer() {
    if (startFlag) {
        startFlag = false;

        // タイマーを停止
        clearInterval(timerId);

        // ポーズボタンを非表示
        const pauseEl = document.getElementById('pause');
        pauseEl.style.display = 'none';
        // スタートボタンのstyle属性を削除してボタンを表示
        const startEl = document.getElementById('start');
        startEl.removeAttribute('style');   
    }
}

function startTimer() {
    // 時間を表示する要素を取得
    const hourEl = document.getElementById('hour');
    const minuteEl = document.getElementById('minute');
    const secondEl = document.getElementById('second');

    // 表示時間をint型に変換して代入
    const hours = parseInt(hourEl.textContent);
    const minutes = parseInt(minuteEl.textContent);
    const seconds = parseInt(secondEl.textContent);

    let totalSeconds = (hours * 60 * 60) + (minutes * 60) + seconds;

    if (!startFlag && totalSeconds > 0) {
        startFlag = true;

        // スタートボタンを非表示
        const startEl = document.getElementById('start');
        startEl.style.display = 'none';
        // ポーズボタンのstyle属性を削除してボタンを表示
        const pauseEl = document.getElementById('pause');
        pauseEl.removeAttribute('style');
        
        // -1秒ごとに画面に表示
        timerId = setInterval(() => {
            // 初期入力値をリセット
            timerText = '';
            // 毎秒マイナスする
            totalSeconds--;
            // トータル秒数を3600で割って時間を求める
            let h = Math.floor(totalSeconds / (60 * 60));
            // 割った余りを60で割って分を求める
            let m = Math.floor((totalSeconds % (60 * 60)) / 60);
            // トータル秒数を60で割って秒を求める
            let s = totalSeconds % 60;
    
            // 値が1ケタの場合2ケタに0埋め
            if (h < 10) {
                h = '0' + h;
            }
            if (m < 10) {
                m = '0' + m;
            }
            if (s < 10) {
                s = '0' + s;
            }

            // 画面に表示する時間を代入
            hourEl.textContent = h;
            minuteEl.textContent = m;
            secondEl.textContent = s;
    
            // cookieに現在の時間を代入
            document.cookie = `${COOKIE_KEY_H}=${h}`;
            document.cookie = `${COOKIE_KEY_M}=${m}`;
            document.cookie = `${COOKIE_KEY_S}=${s}`;

            // 0秒になったら停止
            if (totalSeconds <= 0) {
                totalSeconds = 0;
                startFlag = false;
                
                // ポーズボタンを非表示
                const pauseEl = document.getElementById('pause');
                pauseEl.style.display = 'none';
                // スタートボタンのstyle属性を削除してボタンを表示
                const startEl = document.getElementById('start');
                startEl.removeAttribute('style');   

                document.cookie = `${COOKIE_KEY_H}=`;
                document.cookie = `${COOKIE_KEY_M}=`;
                document.cookie = `${COOKIE_KEY_S}=`;

                timerText = '';

                displayTimerText();

                clearInterval(timerId);
            }
            
            console.log('hour=',h,'minute=',m,'second=',s);
        }, 1000);
    }
}

function resetTimer() {
    timerText = '';
    document.cookie = `${COOKIE_KEY_H}=`;
    document.cookie = `${COOKIE_KEY_M}=`;
    document.cookie = `${COOKIE_KEY_S}=`;
    clearInterval(timerId);
    displayTimerText();
}

function init() {
    // イベントリスナーの登録
    document.getElementById('start').addEventListener('click', startTimer, false);
    document.getElementById('pause').addEventListener('click', pauseTimer, false);
    document.getElementById('reset').addEventListener('click', resetTimer, false);
    displayTimerText()
}
window.onload = init;
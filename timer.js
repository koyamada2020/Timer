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
    // 0埋め
    const sixNum = ('000000' + timerText).slice(-6);

    // 2桁ごと時間を分割して代入 "123456" = "12" "34" "56"
    hourStr = sixNum.substr(0, 2);
    minuteStr = sixNum.substr(2, 2);
    secondStr = sixNum.substr(4, 2);

    // 時間を表示する要素を取得
    const hourEl = document.getElementById('hour');
    const minuteEl = document.getElementById('minute');
    const secondEl = document.getElementById('second');

    // 画面に表示する時間を代入
    hourEl.textContent = hourStr;
    minuteEl.textContent = minuteStr;
    secondEl.textContent = secondStr;

    console.log('hour=',hourStr,'minute=',minuteStr,'second=',secondStr);
}

function pauseTimer() {
    if (startFlag) {
        const pauseElm = document.getElementById('pause');
        pauseElm.id = 'start';
        // 再生ボタンに画像を切り替え
        pauseElm.className = 'far fa-play-circle fa-5x list-inline-item';
        // クリックイベントを削除
        pauseElm.removeEventListener('click', pauseTimer, false);
        // クリックイベントを付与
        pauseElm.addEventListener('click', startTimer, false);

        // タイマーを停止
        clearInterval(timerId);
        startFlag = false;
        
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

        const startElm = document.getElementById('start');
        startElm.id = 'pause';
        // 一時停止ボタンに画像を切り替え
        startElm.className = 'far fa-pause-circle fa-5x list-inline-item';
        // クリックイベントを削除
        startElm.removeEventListener('click', startTimer, false);
        // クリックイベントを付与
        startElm.addEventListener('click', pauseTimer, false);
        

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
    
            // 0秒になったら停止
            if (totalSeconds <= 0) {
                clearInterval(timerId);
                totalSeconds = 0;
                startFlag = false;
                
                const pauseElm = document.getElementById('pause');
                pauseElm.id = 'start';
                // 再生ボタンに画像を切り替え
                pauseElm.className = 'far fa-play-circle fa-5x list-inline-item';
                // クリックイベントを削除
                pauseElm.removeEventListener('click', pauseTimer, false);
                // クリックイベントを付与
                pauseElm.addEventListener('click', startTimer, false);
        
            }

            document.cookie = `${COOKIE_KEY_H}=${h}`;
            document.cookie = `${COOKIE_KEY_M}=${m}`;
            document.cookie = `${COOKIE_KEY_S}=${s}`;
            console.log(document.cookie);
            console.log('hour=',h,'minute=',m,'second=',s);
        }, 1000);
    }

}

function resetTimer() {
    timerText = '';
    clearInterval(timerId);
    displayTimerText();
}

function init() {
    // イベントリスナーの登録
    document.getElementById('start').addEventListener('click', startTimer, false);
    document.getElementById('reset').addEventListener('click', resetTimer, false);
}
window.onload = init;
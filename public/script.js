// Ebenin Amı Sound
sound = document.createElement("audio");
sound.src = 'https://raw.githubusercontent.com/doctorosman/arbaold/master/audio/ebeninami.mp3';
sound.setAttribute("preload", "auto");
sound.setAttribute("controls", "none");
sound.style.display = "none";
document.body.appendChild(this.sound);

const socket = io();

// Elementler
let messages = document.getElementById('messages');
let form = document.getElementById('form');
let input = document.getElementById('input');
let button = document.getElementById('enter');
let username = prompt('Kullanıcı adı:');
let online = document.getElementById('online');

// Kullanıcı Girişi Kontrolü
if (username == 'admin') {
    alert('bi sen zekisin yarram');
    socket.emit('gir', {
        misafir: true
    });
}else if (username != null && username.trim() != '') {
    socket.emit('gir', {
        username: username.trim(),
        misafir: false
    });
}else {
    socket.emit('gir', {
        misafir: true
    });
}

// Ana Fonksiyonlar
const enter = (e) => {
    if (e.key == 'Enter' || e.type == 'click') {
        if (input.value) {
            if (username != null && username.trim() != '' && username != 'admin') {            
                const date = new Date();
                let time = formatTime(date.getHours()) + '.' + formatTime(date.getMinutes());
                
                if (username == '  admin') {
                    if (input.value.startsWith('/sustur')) {
                        let susturulacak = input.value.slice(8);
                        socket.emit('sustur', susturulacak);
                    }else if (input.value.startsWith('/sil')){
                        let n = (input.value.slice(5) == '') ? '1' : input.value.slice(5)
                        socket.emit('sil', n);
                    }else if (input.value == '/clear'){
                        socket.emit('clear');
                    }else if (input.value == '/fuck') {
                        socket.emit('fuck');
                    }else if (input.value == '/ebe') {
                        socket.emit('ebe');
                    }else if (input.value == '/help') {
                        let item = document.createElement('li');
                        let help = '<b>/sustur [oyuncu]</b> - Oyuncuyu susturur.<br>' +
                            '<b>/sil [sondan önceki x. mesaj]</b>' + ' - Sondan önceki x. mesajı siler.<br>' +
                            '<b>/clear</b>' + ' - Tüm sohbeti temizler.<br>' +
                            '<b>/fuck</b>' + ' - Orta parmak yollar.<br>' +
                            '<b>/ebe</b>' + ' - :)';
                        item.innerHTML = 'YARDIM<br>' + help + '<i>' + time + '</i>';

                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    }else {
                        socket.emit('mesaj', {
                            username: cleanText(username.trim()),
                            msg: cleanText(input.value.trim()),
                            time: time
                        });
                    }
                }else {
                    socket.emit('mesaj', {
                        username: cleanText(username.trim()),
                        msg: cleanText(input.value.trim()),
                        time: time
                    });
                }
                input.value = '';   
            }else {
                alert('Kullanıcı adı girmek için sayfayı yenileyin.');
            }
            socket.emit('not typing', username.trim());
        }
    }else if (e.key == 'Backspace') {
        socket.emit('not typing', username.trim());
    }else {
        socket.emit('typing', username.trim());
    }
};

// Yardımcı Fonksiyonlar
const formatTime = (time) => {
    if (time.toString().length == 1)
        return '0' + time;
    else
        return time;
};

const cleanText = (text) => {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    
    return text.replace(/[&<>"']/g, m => { return map[m] });
};

// Listenerlar
input.addEventListener('keyup', enter);
button.addEventListener('click', enter);

// Eventlar
socket.on('mesaj', data => {
    let item = document.createElement('li');

    if (data.username == 'admin') {
        item.innerHTML = '<b id="admin">' + data.username + '</b>:&nbsp;' + data.msg + '<i>' + data.time + '</i>';
    }else {
        item.innerHTML = '<b>' + data.username + '</b>:&nbsp;' + data.msg + '<i>' + data.time + '</i>';
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('sustur', susturulacak => {
    let item = document.createElement('li');
    item.setAttribute('id', 'bilgi');

    item.innerHTML = '--- ' + susturulacak + ' kullanıcısı admin tarafından susturuldu ---';

    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);

    if (username == susturulacak) {
        alert('admin tarafından susturuldunuz sg piç');
        input.setAttribute('disabled', 'true');
    }
});

socket.on('gir', data => {
    let u = false;

    if (data.users.length != 0) {
        online.innerHTML = '<span id="list">' + data.users.length + ' online' + '</span>';
        document.getElementById('list').addEventListener('click', () => {
            alert('Online kullanıcılar (' + data.users.length + '): ' + data.users);
        });
        u = true;
    }

    if (data.guests != 0) {
        if (u) {
            online.innerHTML += ', ' + data.guests + ' misafir';
            document.getElementById('list').addEventListener('click', () => {
                alert('Online kullanıcılar (' + data.users.length + '): ' + data.users);
            });
        }else
            online.innerHTML = data.guests + ' misafir';
    }

    if (!data.misafir){
        let item = document.createElement('li');
        item.setAttribute('id', 'bilgi');
        item.innerHTML = '<b>' + data.username + '</b> bağlandı';
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.on('sil', n => {
    document.querySelector('li:nth-last-child(' + n + ')').innerHTML = '<span id="bilgi">(bu mesaj silindi.)<span>';
});

socket.on('clear', () => {
    document.querySelectorAll('li').forEach((item) => {
        item.remove();
    });
    let item = document.createElement('li');
    item.setAttribute('id', 'bilgi');
    item.innerHTML = 'Sohbet admin tarafından temizlendi.';
    messages.appendChild(item);
});

socket.on('fuck', () => {
    let item = document.createElement('li');                     
    item.innerHTML = '<b id="admin">admin</b>:&nbsp;' + '<img width="215" height="291" src="https://www.pngitem.com/pimgs/m/329-3299225_middle-finger-with-arm-png-transparent-png.png">';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('ebe', () => sound.play());

socket.on('çık', data => {
    let u = false;

    if (data.users.length != 0) {
        online.innerHTML = '<span id="list">' + data.users.length + ' online' + '</span>';
        document.getElementById('list').addEventListener('click', () => {
            alert('Online kullanıcılar (' + data.users.length + '): ' + data.users);
        });
        u = true;
    }

    if (data.guests != 0) {
        if (u) {
            online.innerHTML += ', ' + data.guests + ' misafir';
            document.getElementById('list').addEventListener('click', () => {
                alert('Online kullanıcılar (' + data.users.length + '): ' + data.users);
            });
        }else
            online.innerHTML = data.guests + ' misafir';
    }

    if (!data.misafir){
        let item = document.createElement('li');
        item.setAttribute('id', 'bilgi');
        item.innerHTML = '<b>' + data.username + '</b> çıkış yaptı';
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.on('typing', (username) => {
    let e = document.querySelector('[data-username="' + username + '"]');
    
    if (e == null) {
        let item = document.createElement('li');
        item.setAttribute('id', 'bilgi');
        item.setAttribute('class', 'typing');
        item.setAttribute('data-username', username);
    
        item.innerHTML = username + ' yazıyor';
    
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.on('not typing', (username) => {
    let e = document.querySelector('[data-username="' + username + '"]');

    if (e != null) {
        e.remove();
    }
});
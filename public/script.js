// Ebenin Amı Sound
sound = document.createElement("audio");
sound.src = 'https://raw.githubusercontent.com/doctorosman/arbaold/master/audio/ebeninami.mp3';
sound.setAttribute("preload", "auto");
sound.setAttribute("controls", "none");
sound.style.display = "none";
document.body.appendChild(this.sound);

const socket = io();

// Banlılar
const banlilar = [
    'artunç',
    'artunc'
];

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
}else if (banlilar.includes(username)) {
    alert('BANLANDINIZ.\nBanınızın kalkması için admin\'e yalvarabilirsiniz:\n /yalvar');
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
            if (username != null && username.trim() != '' && username != 'admin' && !banlilar.includes(username)) {            
                const date = new Date();
                let time = formatTime(date.getHours()) + '.' + formatTime(date.getMinutes());
                
                if (input.value == '/31') {
                    socket.emit('bilgi', '<b>' + username + '</b> 31 çekmeye başladı.');
                }else if (input.value.startsWith('/fısılda')){
                    const array = input.value.split(' ');
                    array.shift();
                    const fisildanacak = array[0];
                    array.shift();

                    socket.emit('fısılda', {
                        username: username,
                        fisildanacak: fisildanacak,
                        msg: array.join(' '),
                        time: time
                    });
                }else if (input.value == '/ebe') {
                    socket.emit('ebe');
                }else if (username == '  admin') {
                    if (input.value.startsWith('/sustur')) {
                        const susturulacak = input.value.slice(8);
                        socket.emit('sustur', susturulacak);
                    }else if (input.value.startsWith('/sil')){
                        let n = (input.value.slice(5) == '') ? '1' : input.value.slice(5)
                        socket.emit('sil', n);
                    }else if (input.value == '/clear'){
                        socket.emit('clear');
                    }else if (input.value == '/fuck') {
                        socket.emit('fuck');
                    }else if (input.value.startsWith('/bilgi')) {
                        socket.emit('bilgi', input.value.slice(7));
                    }else if (input.value.startsWith('/duyuru')) {
                        socket.emit('duyuru', input.value.slice(8));
                    }else if (input.value == '/help') {
                        let item = document.createElement('li');
                        let help = '<b>/sustur [kullanıcı]</b> - Kullanıcıyı susturur.<br>' +
                            '<b>/sil [sondan önceki x. mesaj]</b>' + ' - Sondan önceki x. mesajı siler.<br>' +
                            '<b>/a [href] {yazı}</b>' + ' - Link gönderir.<br>' +
                            '<b>/clear</b>' + ' - Tüm sohbeti temizler.<br>' +
                            '<b>/bilgi</b>' + ' - Bilgi mesajı gönderir.<br>' +
                            '<b>/duyuru</b>' + ' - Herkese duyuru yapar.<br>' +
                            '<b>/fuck</b>' + ' - Orta parmak yollar.<br>' +
                            '<b>/ebe</b>' + ' - :)';
                        item.innerHTML = '<h4>ADMİN KOMUTLARI</h4>' + help + '<i>' + time + '</i>';

                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    }else if (input.value.startsWith('/a')) {
                        const array = input.value.split(' ');
                        array.shift();
                        const href = array[0];
                        if (array.length == 1)
                            array.push(array[0]);
                        array.shift();
                        socket.emit('mesaj', {
                            username: cleanText(username.trim()),
                            msg: '<a href="' + href + '">' + array.join(' ') + '</a>',
                            time: time
                        });
                    }else {
                        socket.emit('mesaj', {
                            username: cleanText(username.trim()),
                            msg: cleanText(input.value.trim()),
                            time: time
                        });
                    }
                }else {
                    if (input.value.trim().startsWith('/help')) {
                        const message = '<b>/fısılda [kullanıcı] [mesaj]</b> - İstediğiniz bir kullanıcıya sadece onun görebileceği bir mesaj gönderir.<br>' +
                            '<b>/renkli [renk] [mesaj]</b> - Renkli mesaj gönderir. (VIP)<br>' +
                            '<b>/isim [renk]</b> - İsim renginizi değiştirir. (VIP)<br>' +
                            '<b>/31</b> - Yapmakta olduğunuz şeyi herkese bildirir.<br>' +
                            '<b>/ebe</b> - :)';
                        let item = document.createElement('li');
                        item.innerHTML = '<h4>KOMUTLAR</h4>' + message + '<i>' + time + '</i>';
    
                        messages.appendChild(item);
                        window.scrollTo(0, document.body.scrollHeight);
                    }else {
                        socket.emit('mesaj', {
                            username: cleanText(username.trim()),
                            msg: cleanText(input.value.trim()),
                            time: time
                        });
                    }
                }
                input.value = '';   
            }else if (banlilar.includes(username)) {
                if (input.value == '/yalvar') {
                    socket.emit('bilgi', '<b>' + username + '</b> banının kalkması için admine yalvarıyor.');       
                }else {
                    alert('Banlı olduğunuz için konuşamazsınız. Sadece yalvarabilirsiniz:\n/yalvar');
                }
            }else {
                alert('Kullanıcı adı girmek için sayfayı yenileyin.');
            }
            socket.emit('not typing', username.trim());
        }
    }else if (e.key == 'Backspace') {
        socket.emit('not typing', username.trim());
    }else {
        if (username != null)
            socket.emit('typing', username.trim());
    }
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

socket.on('bilgi', msg => {
    console.log('a');
    let item = document.createElement('li');
    item.setAttribute('id', 'bilgi');

    item.innerHTML = '--- ' + msg + ' ---';

    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('gir', data => {
    let u = false;

    if (data.users.length != 0) {
        online.innerHTML = '<span id="list">' + data.users.length + ' online' + '</span>';
        document.getElementById('list').addEventListener('click', () => {
            alert('Online kullanıcılar (' + data.users.length + '): ' + data.users.join(', '));
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
        if (data.username == 'admin')
            item.innerHTML = '<b>admin hazretleri teşrif etti</b>';
        else
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
    item.innerHTML = '<b id="admin">admin</b>:&nbsp;' + '<img width="215" height="291" src="fuck.png">';
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('ebe', () => sound.play());

socket.on('çık', data => {
    let u = false;

    if (data.users.length != 0) {
        online.innerHTML = '<span id="list">' + data.users.length + ' online' + '</span>';
        document.getElementById('list').addEventListener('click', () => {
            alert('Online kullanıcılar (' + data.users.length + '): ' + data.users.join(', '));
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
    
        if (username == 'admin')
            item.innerHTML = '<b>admin hazretleri yazıyor</b>';
        else
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

socket.on('fısılda', data => {
    if (data.username == username) {
        let item = document.createElement('li');
        item.setAttribute('class', 'fisilda');
        
        item.innerHTML = '<b>' + data.fisildanacak + '</b> kullanıcısına fısıldadınız:<br>&emsp;' + data.msg + '<i>' + data.time + '</i>';
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }else if (data.fisildanacak == username) {
        let item = document.createElement('li');
        item.setAttribute('class', 'fisilda');
        
        item.innerHTML = '<b>' + data.username + '</b> kullanıcısı size fısıldadı:<br>&emsp;' + data.msg + '<i>' + data.time + '</i>';
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.on('duyuru', msg => {
    alert('DUYURU: ' + msg);
});
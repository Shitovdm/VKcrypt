

class DOWobjectsActions{
    
    constructor(){
        console.log("Инициализация расширения...");
        this.sendBTN = null;
        this.eventListenerFlag = false;
        this.messageCounter = 0;
    }
    
    parseSendElement(){
        var location = window.location.href; 
        if(location.split("?")[0] === "https://vk.com/im"){ //  Если эта страница с диалогаями.
            console.log("Удаление кнопки отправки сообщения...");
            this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
            this.sendBTN = this.container.children[6];
            console.log(this.container.children[6]);
            this.container.removeChild(this.container.children[6]); //  Удаление кнопки отправки.
       }     
    }
    
    createElement(_Crypt, sendBTN){
        var location = window.location.href; 
        if(location.split("?")[0] === "https://vk.com/im"){ //  Если эта страница с диалогаями.
            //  Создаем новый объект, который встанет на место старого.
            var cryptButton = document.createElement("button");
            cryptButton.setAttribute("class","crypt-btn");
            cryptButton.setAttribute("id","encrypt");
            cryptButton.setAttribute("title","Отправить зашифрованное сообщение");
            this.container.appendChild(cryptButton); 
        
            var encryptBtn = document.getElementById("encrypt");
            encryptBtn.onclick = function(){    //  Обработчик нажатия на кнопку кодирования и отправки.
                _Crypt.encryptMessage(sendBTN);
            };   
        }
          
    }
    
    /*
     * Обрабатывает последнее сообщение.
     * @returns {undefined}
     */
    eventListener(){
        console.log("Обработка последнего сообщения...");
        
        if(!this.eventListenerFlag){
            this.eventListenerFlag = true;
            var _Decrypt = new Decrypt;
            
            
            var createElement = this.createElement.bind(this);
            
            
            
            window.setInterval(function(){     //  Событие на обновление последнего сообщения.

                var location = window.location.href; 
                if((location.split("?")[0] === "https://vk.com/im") && (location.indexOf("sel") !== -1)){ //  Если эта страница с диалогаями.
                    
                    //  Обработка кнопки шифрования и отправки.
                    
                    console.log("На странице с диалогами! Location: ", location);
                    this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
                    
                    if(this.container.children[6] !== undefined){
                        this.sendBTN = this.container.children[6];  //  Запоминаем элемент каоторый позволяет отправлять сообщения.
                        console.log("Удаление кнопки отправки сообщения...");
                        this.container.removeChild(this.container.children[6]); //  Удаление кнопки отправки.
                        
                        console.log();
                        //  Создание новой кнопки шифрования.
                        
                        var _Crypt = new Crypt();
                        createElement(_Crypt, this.sendBTN);

                    }
                    
                    //  Обработка сообщений.
                    
                    var __allMessages = document.getElementsByClassName("im-mess--text");   //  Все сообщения.
                    
                    if(this.messageCounter !== __allMessages.length){   //  Если замечено изменение количество сообщений.
                        
                        this.messageCounter = __allMessages.length ;    //  Запоминаем общее количество сообщений.

                        if(__allMessages[this.messageCounter - 1].innerHTML !== this.lastMessage){  //  Если последнее сообщение изменилось.
                            
                            this.lastMessage = __allMessages[__allMessages.length - 1].innerHTML;   //  Запоминаем последнее сообщение.
                            console.log("Зафиксировано изменение...", this.lastMessage.split("<")[0]);

                            _Decrypt.decryptSomeMessage();  //  Декодируем сообщение.

                        }else{

                        }
                    }else{

                    }
                    
                }

            }, 1000);
            
        }
    }
}


class Parse{
    
    emojiCheck(){
    
    }
    
    
}


class Crypt{
    
    encryptMessage(sendBTN){
        
        var _Decrypt = new Decrypt;
        
        var textfield = document.getElementsByClassName("im_editable");
        var sourceText = textfield[0].innerHTML;
        if(sourceText !== ""){
            var encoded = this.encryptAlgorithm(sourceText);      //  Кодировка сообщения.
            textfield[0].innerHTML = encoded;                     //  Вставка текста сообщения в текстфилд.
            this.simulateClick(sendBTN);                          //  Отправка сообщения.
            _Decrypt.decryptSomeMessage();                        //  Расшифруем последнее отправленное сообщение.
        }else{
            console.log("Поле ввода текста пустое!");
        }
    }
    
    encryptAlgorithm(__source){
        
        var _Base64 = new Base64();

        var Salt = "aEzAkM";
        var literal = "/0x";

        // Encoding: 
        var MessLen = __source.length,
            SaltLen = Salt.length;

        var FirstHalfMess = __source.substring(0, MessLen / 2), // Первая часть сообщения
            SecondHalfMess = __source.substring(MessLen / 2, MessLen), // Вторая часть сообщения

            _1_3_Salt = Salt.substring(0, SaltLen/3), // 1/3 соли
            _2_3_Salt = Salt.substring(SaltLen/3, SaltLen); // 2/3 соли

        var EncFirstHalfMess = _Base64.encode64(FirstHalfMess), // Первая кодированная часть сообщения
            RevEncFirstHalfMess = EncFirstHalfMess.split("").reverse().join(""), // Перевернутая первая часть сообщения
            RevEncFirstHalfMessLen = "" + RevEncFirstHalfMess.length, // Длина перевернутой кодированной первой части сообщения

            EncSecHalfMess = _Base64.encode64(SecondHalfMess), // Вторая кодированная часть сообщения
            RevEncSecHalfMess = EncSecHalfMess.split("").reverse().join(""), // Перевернутая вторая часть сообщения
            RevEncSecHalfMessLen = "" + RevEncSecHalfMess.length, // Длина перевернутой кодированной второй части сообщения

            Enc_1_3_Salt = _Base64.encode64(_1_3_Salt), // Кодированная 1/3 соли 
            _1_3_EncSaltLen = "" + Enc_1_3_Salt.length, // Длина кодированной 1/3 соли

            Enc_2_3_Salt = _Base64.encode64(_2_3_Salt), // Кодированные 2/3 соли 
            _2_3_EncSaltLen = "" + Enc_2_3_Salt.length; // Длина кодированной 2/3 соли

        var output = 
                literal + 
                Enc_1_3_Salt + 
                RevEncFirstHalfMess +
                RevEncSecHalfMess + 
                Enc_2_3_Salt + literal + 
                RevEncSecHalfMessLen + literal +
                RevEncFirstHalfMessLen + literal + 
                _2_3_EncSaltLen + literal + 
                _1_3_EncSaltLen + literal;

        return output;
    }
    
    encryptAddSault(__source){
        var _encoded = __source;
        
        return _encoded;
    }
    
    
    simulateClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var canceled = !obj.dispatchEvent(evt);
    }
    
}


class Decrypt{
    
    constructor(){
        
    };
    
    decryptAllMessage(){
        
        console.log("Приступаю к расшифровке...");
        
        var __allMessages = document.getElementsByClassName("im-mess--text");
        for(var i = 0; i < __allMessages.length; i++){
            //console.log("Source message text: ", __allMessages[i].innerHTML);
            var decryptMsg = this.decryptAlgorithm(__allMessages[i].innerHTML);
            if(decryptMsg !== false){   //  Декодирует сообщение.
                __allMessages[i].innerHTML = decryptMsg;
            }else{  //  Сообщение не является закодированым.
                //console.log("Сообщение '" , __allMessages[i].innerHTML , "' не является закодированым!");
            }
            
        }
        
        
    }
    
    decryptSomeMessage(){
        var context = this;
        setTimeout(function(){
            var __allMessages = document.getElementsByClassName("im-mess--text");
            var messagesCount = __allMessages.length;
            console.log("Расшифровать последнее сообщение: ", __allMessages[__allMessages.length - 1].innerHTML);
            var sourceText = __allMessages[__allMessages.length - 1].innerHTML;
            var mediaTag = sourceText.split("<")[1];
            var decodeText = context.decryptAlgorithm(sourceText.split("<")[0]);
            if(decodeText !== false){   //  Если декодирование дало положительный результат.
                console.log("Сообщение успешно раскодировано! Decoder return:", decodeText);
                __allMessages[__allMessages.length - 1].innerHTML = decodeText + "<" + mediaTag;
            }else{
                console.log("Сообщение находится в незакодированном виде! Decoder return:", decodeText);
            }
            
        }, 0);
    }
    
    
    decryptAlgorithm(__source){
        
        var _Base64 = new Base64();
        
        var receiverSalt = "aEzAkM"; // Соль и литерал - такие же, как и у отправителя
        var receiverLiteral = "/0x";
        
        var messageParts = __source.split(receiverLiteral);

        var _1_3_EncSaltLength = messageParts[5];       // Длина кодированной 1/3 соли
        var _2_3_EncSaltLength = messageParts[4];       // Длина кодированной 2/3 соли
        var encFirstHalfMessLength = messageParts[3];   // Длина кодированной первой половины сообщения
        var encSecHalfMessLength =  messageParts[2];    // Длина кодированной второй половины сообщения
        var message =  messageParts[1];                 // Само сообщение

        // Обрезаем с конца строки кодированные 2/3 соли
        message = message.substring(0, message.length - _2_3_EncSaltLength);
        // Обрезаем с начала строки кодированные 1/3 соли
        message = message.substring(_1_3_EncSaltLength, message.length);

        // Выделяем первую часть сообщения
        var firstHalf = message.substring(0, encFirstHalfMessLength);

        // Выделяем вторую часть сообщения
        var secondHalf = message.substring(encFirstHalfMessLength, message.length);

        // Декодим части сообщения
        firstHalf = firstHalf.split("").reverse().join("");
        firstHalf = _Base64.decode64(firstHalf);

        secondHalf = secondHalf.split("").reverse().join("");
        secondHalf = _Base64.decode64(secondHalf);

        // Формируем выход 
        var receiverOutput = firstHalf + secondHalf;
        console.log(receiverOutput);
        
        return receiverOutput;
    }
    
    
}


class Base64{
    
    constructor(){
        
        this.keyStr = "ABCDEFGHIJKLMNOP" +
                      "QRSTUVWXYZabcdef" +
                      "ghijklmnopqrstuv" +
                      "wxyz0123456789+/" +
                      "=";
    }
    
    encode64(input) {
        input = escape(input);
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
    }
    
    decode64(input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
            /*
            console.log("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
            */
            return false;
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
            enc1 = this.keyStr.indexOf(input.charAt(i++));
            enc2 = this.keyStr.indexOf(input.charAt(i++));
            enc3 = this.keyStr.indexOf(input.charAt(i++));
            enc4 = this.keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output = output + String.fromCharCode(chr3);
            }

            chr1 = chr2 = chr3 = "";
            enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return unescape(output);
    }
    
}


window.onload = function(){
    var _DOWobjectsActions = new DOWobjectsActions();
    var _Crypt = new Crypt();
    var _Decrypt = new Decrypt;
    
    _DOWobjectsActions.parseSendElement();
    _DOWobjectsActions.eventListener();                     //  Обработчик обновления последнего сообщения.
    var sendBtnMemory = _DOWobjectsActions.sendBTN;
    _DOWobjectsActions.createElement(_Crypt, sendBtnMemory);
    
    
    //_Decrypt.decryptAllMessage();                           //  Декодирует все сообщенгия из переписки.
    
};


function onhashchange(){
    console.log("GHBDTN");
}


class DOWobjectsActions{
    
    constructor(){
        console.log("Инициализация расширения...");
        this.sendBTN = null;
    }
    
    parseSendElement(){
        this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
        this.sendBTN = this.container.children[6];
        console.log(this.container.children[6]);
        this.container.removeChild(this.container.children[6]); //  Удаление кнопки отправки.
    }
    
    createElement(_Crypt, sendBTN){
        //  Создаем новый объект, который встанет на место старого.
        var cryptButton = document.createElement("button");
        cryptButton.setAttribute("class","crypt-btn");
        cryptButton.setAttribute("id","encrypt");
        cryptButton.setAttribute("title","Отправить зашифрованное сообщение");
        this.container.appendChild(cryptButton); 
        
        var encryptBtn = document.getElementById("encrypt");
        encryptBtn.onclick = function(){    //  Обработчик нажатия на кнопку кодирования и отправки.
            console.log(sendBTN);
            _Crypt.encryptMessage(sendBTN);
        };     
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
        
        console.log(__source);

        var _encoded = _Base64.encode64(__source);
        
        console.log(_encoded);
        
        console.log(_Base64.decode64(_encoded));
        
        return _encoded;
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
            console.log("Расшифровываем последнее сообщение...");
            var __allMessages = document.getElementsByClassName("im-mess--text");
            var messagesCount = __allMessages.length;
            console.log("Расшифровать последнее сообщение: ", __allMessages[__allMessages.length - 1].innerHTML);
            var sourceText = __allMessages[__allMessages.length - 1].innerHTML;
            var mediaTag = sourceText.split("<")[1];
            var decodeText = context.decryptAlgorithm(sourceText.split("<")[0]);
            //console.log(this);
            __allMessages[__allMessages.length - 1].innerHTML = decodeText + "<" + mediaTag;
        }, 500);
    }
    
    
    decryptAlgorithm(__source){
        
        var _Base64 = new Base64();
        
        var __decode = _Base64.decode64(__source);
        
        return __decode;
    }
    
    splitTags(){
        
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
    var sendBtnMemory = _DOWobjectsActions.sendBTN;
    console.log(sendBtnMemory);
    _DOWobjectsActions.createElement(_Crypt, sendBtnMemory);
    
    
    _Decrypt.decryptAllMessage();
    
};
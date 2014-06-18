
/**
 * Класс определяет методы взаимодействий с DOM.
 * @type type
 */
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
    
    simulateClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var canceled = !obj.dispatchEvent(evt);
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


/**
 * Класс содержит 2 метода, которые позволяют кодировать и декодировать строки в Base64.
 * @type type
 */
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
    //var _DOWobjectsActions = new DOWobjectsActions();
    //var _Crypt = new Crypt();
    //var _Decrypt = new Decrypt;
    
    //_DOWobjectsActions.parseSendElement();
    //_DOWobjectsActions.eventListener();                     //  Обработчик обновления последнего сообщения.
    //var sendBtnMemory = _DOWobjectsActions.sendBTN;
    //_DOWobjectsActions.createElement(_Crypt, sendBtnMemory);
    
    
    chrome.storage.local.get(function(storage){
        console.log(storage);
    });
    
    
    //_Decrypt.decryptAllMessage();                           //  Декодирует все сообщенгия из переписки.
    
    console.log(window.location.href);

    
    var __Listeners = new Listeners();
    __Listeners.daemonListener();
    
    
    
    
};



class Listeners{
    
    constructor(){
        this.updateTime = 1000;
        this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
        this.sendBTN = this.container.children[6];  //  Элемент отправки сообщения.
        this.messageCounter = 0;
        this.lastMessage = "";
    }
    
    /*
     * Метод обрабатывает новые сообщения.
     * @returns {undefined}
     */
    
    messageListener(){
        //console.log("Listen new message.");
        //console.log("Working with local storage.");
        //  Обработка сообщений.
                    
        var __allMessages = document.getElementsByClassName("im-mess--text");   //  Все сообщения.

        if(this.messageCounter !== __allMessages.length){   //  Если замечено изменение количество сообщений.

            this.messageCounter = __allMessages.length ;    //  Запоминаем общее количество сообщений.

            if(__allMessages[this.messageCounter - 1].innerHTML !== this.lastMessage){  //  Если последнее сообщение изменилось.
                var currentMessage = __allMessages[__allMessages.length - 1].innerHTML;
                this.lastMessage = currentMessage;   //  Запоминаем последнее сообщение.
                //console.log("Зафиксировано изменение...", this.lastMessage.split("<")[0]);
                
                var userFullName = document.getElementsByClassName("_im_page_peer_name")[0].text;     
                var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                
                var keyGeneration = new KeyGeneration;
                
                //  Определяем принятое сообщения.
                switch (currentMessage.split("<")[0]){
                    //  Команда начала создания первичных открытых ключей.
                    case "[" + userFullName.split(" ")[0] + "]: Предлагаю Вам перейти к защищенной беседе. ":
                        
                        console.log("Создание пары первичных ключей и отправка их собеседнику.");
                        //  Создание пары первичных ключей и отправка их собеседнику.
                        var publicKeys = keyGeneration.createFirstPublicKey();
                        var encodePublicKeys = keyGeneration.encodePublicKeys(publicKeys);
                        
                        console.log("Создана пара первичных ключей :  p = ", publicKeys.p , " = " , encodePublicKeys.p, "  g = ", publicKeys.g , " = " , encodePublicKeys.g);
                        
                        //  Записать ключи в локальное хранилище.
                        var LocalStorage = new LocalStorageActions;
                        
                        //  Необходимо обеспечить последовательное выполнение записи этих значений через обещания.
                        let promise = new Promise(function (resolve, reject) {
                            LocalStorage.changeProperty("cryptState", "pending", userID);
                            setTimeout(function () {
                                resolve();
                            }, 500);
                        });
                        
                        //  Последовательное выполнение изменения значений в локальном хранилище.
                        promise
                            .then(
                                function(){
                                    LocalStorage.changeProperty("p", encodePublicKeys.p, userID);
                                    return new Promise(function(resolve, reject){
                                        setTimeout(function () {
                                            resolve();
                                        }, 500);
                                    });    
                                })
                            .then(function(){
                                    LocalStorage.changeProperty("g", encodePublicKeys.g, userID); 
                                    return new Promise(function(resolve, reject){
                                        setTimeout(function () {
                                            resolve();
                                        }, 500);
                                    });   
                                })
                            .then(function(){
                                    console.log("Пара первичных ключей записана в локальное хранилище.");
                                })
                            .catch(error => console.error(error));
                        
                        
                        //  Передача ключей собеседнику.(код выполняется перед записью ключей в локальное хранилище.)
                        var senderName = document.getElementsByClassName("top_profile_img")[0].getAttribute("alt");  //  Имя отправителя.
                        var messageContent = "[" + senderName + "]: Принимаю Ваше предложение. <br> Первичные открытые ключи шифрования: <br>" + encodePublicKeys.p + "<br>" + encodePublicKeys.g + "<br>";
                        var notificationsAndActions = new NotificationsAndActions;
                        notificationsAndActions.sendServiceMessage(messageContent);
                        console.log("Собеседнику отправлено уведомление с вложенными ключами.");
                        break;
                        
                    //  Команда приема открытого ключа собеседника.
                    case "[" + userFullName.split(" ")[0] + "]: Принимаю Ваше предложение. ":
                        
                        var p = currentMessage.split("<br>")[2];
                        var g = currentMessage.split("<br>")[3];
                        console.log("Приняты первичные ключи шифрования : p = ", p, " g = ", g);
                        //  Если ключи еще не записаны в локальном хранилище или они не совпалают с записаными.
                        
                        
                        //  Генерация секретного ключа.
                        
                        
                        
                        
                        
                        break;
                }
                //_Decrypt.decryptSomeMessage();  //  Декодируем сообщение.
                
                setTimeout(function(){
                    chrome.storage.local.get(function(storage){
                        console.log(storage);
                    });
                },4000);
                
            }else{

            }
        }else{

        }
        
        
        
        
        //  Начало алгоритма обмена секретными ключами.
        
        
    }
    
    /*
     * Метод определяет действия на странице диалогов.
     * Управляет отображением кнопки шифрования и показом и отправков уведомлений.
     * @returns {Generator}
     */
    
    conversationListener(){
        //  Создание чербокса.
        this.container = document.getElementsByClassName("im-page--title-wrapper")["0"];
        var stateCheckbox = document.createElement("div");
        stateCheckbox.setAttribute("class","encrypt-checkbox-field");
        stateCheckbox.setAttribute("title","Включить/Отключить шифрование");
        this.container.appendChild(stateCheckbox); 

        var inputTag = document.createElement("input");
        inputTag.setAttribute("class","encrypt-chechbox");
        inputTag.setAttribute("id","encrypt-state");
        inputTag.setAttribute("type","checkbox");
        stateCheckbox.appendChild(inputTag);

        var labelTag = document.createElement("label");
        labelTag.setAttribute("class","encrypt-label");
        labelTag.setAttribute("for","encrypt-state");
        stateCheckbox.appendChild(labelTag);
        
        //  Определение состояния шифрования и цвета чекбокса шифрования.
        chrome.storage.local.get(function(storage){ //  Определяем состояние шифрования.
            var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
            var conversations = storage['conversations'] || null;

            if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                var id = conversations[userID] || null;

                switch (id.cryptState){
                    case "pending": //  Ожидается подтверждение собеседника.
                        var label = document.getElementsByClassName("encrypt-label")[0];
                        label.classList.toggle("crypt-pending");
                        document.getElementsByClassName("encrypt-chechbox")[0].checked = true;
                        break;

                    case "established": //  Соединение установлено.
                        document.getElementsByClassName("encrypt-chechbox")[0].checked = true;
                        break;

                    case "error":   //  Соединение разорвано собеседником.

                        break;
                    
                    default :
                        break;
                } 
            }else{
                console.log("Conversation not found in local storage. Create note...");
                //  Создание записи в локальном хранилище информации о данном диалоге.
                var userName = document.getElementsByClassName("_im_page_peer_name")[0].text;
                //  Формирование объекта.
                var newUser = {
                    id: userID,
                    userName: userName,
                    cryptState: "inactive",
                    secretSalt: null,
                    secretKey: null,
                    p: null,
                    g: null
                };
                //  Помещаем в хранилище.
                var localStorage = new LocalStorageActions; //  Создание экземпляра класса для работы с лдокальным хранилищем.
                localStorage.addConversation(newUser);
            }
        });
        
        //  Обработчик события включения и отключения шифрования.
        var interlocutorNotify = this.interlocutorNotify.bind(this);    
        inputTag.onchange = function(){
            if(inputTag.checked){   //  Если чекбокс включен.
                console.log("Включение шифрования.");
                var label = document.getElementsByClassName("encrypt-label")[0].classList.toggle("crypt-pending");
                //  Добавление записи в локальное хранилище о создании шифрованого диалога с конкретным пользователем.
                //var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                var userName = document.getElementsByClassName("_im_page_peer_name")[0].text;
                //  Формирование объекта.
                var newUser = {
                    id: userID,
                    userName: userName,
                    cryptState: "pending",
                    secretSalt: null,
                    secretKey: null,
                    p: null,
                    g: null
                };
                //  Добавление объекта в локальное хранилище.
                var localStorage = new LocalStorageActions; //  Создание экземпляра класса для работы с лдокальным хранилищем.
                localStorage.addConversation(newUser);
                
                //  Отправляем оповещение пользователю о начала зашифрованого общения.
                interlocutorNotify();
                //  Начало обмена секретными ключами с пользователем.

            }else{  //  Если чекбокс выключен.
                console.log("Отключение шифрования...");
                var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                var LocalStorage = new LocalStorageActions;
                LocalStorage.removeConversation(userID);    //  Удаляем информацию об этом диалоге в локальном хранилище.
            }
        }; 
   }
    
    
    /*
     *  Метод отправляет уведомление собеседнику о начале зашифрованой беседы.
     */ 
    interlocutorNotify(){
        var senderInfo = document.getElementsByClassName("top_profile_img")[0];
        var sender = senderInfo.getAttribute("alt");  //  Имя отправителя.
        var notification = "[" + sender + "]: Предлагаю Вам перейти к защищенной беседе. <br> Для начала включите шифрование.";  //  Текст сообщения.
        
        var _DOWobjectsActions = new DOWobjectsActions(); //  Создаем экземпляр класса работы с DOM.
        
        var textbox = document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];    //  Текстовое поле ввода сообщения.
        _DOWobjectsActions.simulateClick(textbox);  //  Моделируем клик по полю ввода сообщения.
        textbox.innerHTML = notification;   //  Помещаем текст сообщения в поле ввода.
        
        //  Заменяем элемент отправки голосового сообщения элементом отправки текстового сообщения.
        var sendButton = document.getElementsByClassName("im-chat-input--send")[0];
        sendButton.className = "im-send-btn im-chat-input--send _im_send im-send-btn_send";
        sendButton.setAttribute("aria-label", "Send");
        sendButton.setAttribute("data-tttype", "1");
        
        _DOWobjectsActions.simulateClick(sendButton);   //  Моделируем клик по элементу отправки сообщения.
        
        
        //  Показываем уведомление отправителю, о том что сообщение отправлено и программа ждет ответа собеседника.
        //  *Если собеседник ответит данными первичного открытого ключа то начинаем шифрование.

        var sendButton = document.getElementsByClassName("im-page--fixer")[0];     //  Элемент .im-page--fixer ._im_typer_c находится всегда внизу страницы.
        
        sendButton.classList.add("notify-bg");
        sendButton.innerHTML = 
                '<div class="notify-auto-crypt">'
                    +'Собеседнику отправлено уведомление. Зашифрованная передача данных начнется автоматически после включения шифрования собеседником.'
                +'</div>'
                + '<div class="hide-auto-crypt-notify">'
                    +'&#10006;'
                +'</div>';
        var hideNotify = document.getElementsByClassName("hide-auto-crypt-notify")[0];  //  Элемент скрытия уведомления.
        
        hideNotify.onclick = function(){    //  Обработчик скрытия окна уведомления.
            var sendButton = document.getElementsByClassName("im-page--fixer")[0];
            sendButton.classList.remove("notify-bg");
            sendButton.innerHTML = "";
        };
        
    }
    
    /**
     * Общий демон, слушает все события.
     * @returns {undefined}
     */
    
    daemonListener(){
        var conversationListener = this.conversationListener.bind(this);
        var messageListener = this.messageListener.bind(this);
        
        window.setInterval(function(){
            
            
            if((window.location.href.split("?")[0] === "https://vk.com/im") && (window.location.href.indexOf("sel") !== -1)){ //  Если эта страница с диалогаями.
                
                
                if(document.getElementById("encrypt-state") === null){  //  Если чекбокс еще не был создан.
                    //  Создание чекбокса шифрования.
                    conversationListener();  //  Управляет отображением кнопки шифрования и показом и отправков уведомлений.
                }
                
                messageListener();  //  Проверяем наличие новых сообщений.
            }
            
                

            
            
        }, this.updateTime);
    }
    
}


class NotificationsAndActions{
    
    /**
     * Метод отправляет служебное сообщение собеседнику.
     * @returns {undefined}
     */
    sendServiceMessage(content){
        var _DOWobjectsActions = new DOWobjectsActions(); //  Создаем экземпляр класса работы с DOM.
        
        var textbox = document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];    //  Текстовое поле ввода сообщения.
        _DOWobjectsActions.simulateClick(textbox);  //  Моделируем клик по полю ввода сообщения.
        textbox.innerHTML = content;   //  Помещаем текст сообщения в поле ввода.
        
        //  Заменяем элемент отправки голосового сообщения элементом отправки текстового сообщения.
        var sendButton = document.getElementsByClassName("im-chat-input--send")[0];
        sendButton.className = "im-send-btn im-chat-input--send _im_send im-send-btn_send";
        sendButton.setAttribute("aria-label", "Send");
        sendButton.setAttribute("data-tttype", "1");
        
        _DOWobjectsActions.simulateClick(sendButton);   //  Моделируем клик по элементу отправки сообщения.
    }
    
}


class LocalStorageActions{
    set(object){
        chrome.storage.local.set(object, function() {
            //console.log(object + ' Value saved!');
            
        });
    }
    
    get(object, callback){
        chrome.storage.local.get([object], callback);
        
    }
    
    remove(object){
        chrome.storage.local.remove([object], function() {
            //console.log('Object removed!');
        });
    }
    
    /**
     * Метод добавляет информацию о новом диалоге в локальное хранилище.
     * @param {type} newUser
     * @returns {undefined}
     */
    addConversation(newUser){
        var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
        
        var complement = this.complement.bind(this);    //  Метод добавления объекта.
        this.get('conversations', function (value) {    //  Читаем значение из локального хранилища.
            complement(value['conversations'], userID, newUser);    //  Добавляем новый объект.
        });
    }
    
    
    /*
     *  Метод добавляет данные в объект в локальном хранилище.
     */
    complement(object, key, data){
        var newObject = {}; //  Создание нового объекта.
        for(var currentKey in object){  //  Добавление всех ранее записаных объектов.
            newObject[currentKey] = object[currentKey];
        }
        newObject[key] = data;  //  Добавление нового объекта.
        
        this.set({'conversations': newObject});            //  Записываем в локальное хранилище.
        console.log("Был вызван метод добавления нового диалога в локальное хранилище...");
        //return newObject;
    }
    
    
    /*
     *  Метод удаляет запись о диалоге из локального хранилища при отключении шифрования.
     */
    removeConversation(userID){
        var set = this.set.bind(this);
        chrome.storage.local.get(function(storage){
            var conversations = storage['conversations'] || null;
            //console.log(conversations);
            if(conversations[userID]){
                //console.log(conversations[userID]);
                var newConversations = {};
                for(var key in conversations){
                    if (conversations.hasOwnProperty(key) && key !== userID){
                        newConversations[key] = conversations[key];
                    }
                }
                set({'conversations': newConversations});
                console.log("Conversation ", userID, " removed!");
            }
        });
    }
    
    
    /*
     * Метод изменяет текущее состояние шифрования и записывает его в локальное хранилище.
     * @param {type} newState
     * @param {type} userID
     * @returns {undefined}
     */
    changeProperty(propName, newState, userID){
        var set = this.set.bind(this);
        chrome.storage.local.get(function(storage){
            var conversations = storage['conversations'] || null;
            if(conversations[userID]){
                var newConversations = {};
                for(var key in conversations){
                    if (conversations.hasOwnProperty(key)){
                        if(key === userID){
                            var newUser = {};
                            var convProps = conversations[key];
                            for(var prop in convProps){
                                if(convProps.hasOwnProperty(prop)){
                                    if(prop === propName){    
                                        newUser[prop] = newState;
                                    }else{
                                        newUser[prop] = convProps[prop];
                                    }
                                } 
                            }
                            newConversations[key] = newUser;
                        }else{
                           newConversations[key] = conversations[key]; 
                        }
                    }
                }
                set({'conversations': newConversations});
            }
        });
    }
    
    /**
     * Метод проверяет присутствуют ли ключи в локальном хранилище.
     * @returns {undefined}
     */
    issetSecretKeys(){
        
    }
    
    /**
     * Метод проверяет, не совпадают ли принятые ключи с теми, что записаны в локальном хранилище.
     * @returns {undefined}
     */
    coincidenceKeys(){
        
    }
    
}


 /*
 *  Класс отвечает за генерацию и обмен ключами.
 */
class KeyGeneration{
    
    
    /**
     * Метод генерирует пару случайных простых чисел, удовлетворяющих алгоритму Диффи-Хелмана.
     * @returns {KeyGeneration.createFirstPublicKey.injectAnonym$5}
     */
    createFirstPublicKey(){
        
        var numberOperations = new operationsOnNumbers;
        
        var complete = false,   // Флаг показывает, что найдена подходящая под условия Хеллмана пара (p - g)
            limit = 1000;       // Предел для простых чисел

        var primesFor_p = numberOperations.primeNumbersFor_p(limit), // Массивы чисел, подходящих под условия Хеллмана, из которых выбираются p и g
            primesFor_g = numberOperations.primeNumbersFor_g(limit); 

        var p = null, // Сами числа p и g
            g = null;
            
        // Поиск пары (p - g)
        while( complete === false ) {
            var randomPrime = this.generateRandomNumber(primesFor_p);
            var randomNumber = this.generateRandomNumber(primesFor_g);

            if( randomNumber !== randomPrime && numberOperations.isPrimitiveRoot(randomNumber, randomPrime)) {
                complete = true; // Пара (p - g) найдена - завершаем поиск
                p = randomPrime;
                g = randomNumber;
            }
        }

        return {
            p: p,
            g: g
        };
    }
    
    /**
     * Метод кодирует пару первичных открытых ключей.
     * @param {type} keys
     * @returns {KeyGeneration.encodePublicKeys.injectAnonym$6}
     */
    encodePublicKeys(keys){
        var _Base64 = new Base64();
        return {
            p: "nj1RQzoNjM0U7qP" + _Base64.encode64((keys.p)**3),
            g: "g3FeqVt9NjTTw0Q" + _Base64.encode64((keys.g)**3)
        };
    }
    
    
    /*
     * Метод генерации рандомного числа из primes (для p и g отдельно).
     * @param {type} primesArray
     * @returns {unresolved}
     */
    generateRandomNumber(primesArray){
         // Генерация рандомного индекса путем выбора разрядов из float, возвращенного из Math.random().
        var rand = Math.random();
        if(`${rand}`.split("")[4] === '0') { 
            var twoDigitNumber = `${rand}`.split("")[6];
        } else {
            var twoDigitNumber = `${rand}`.split("")[4] + `${rand}`.split("")[6];
        }

        // Сгенерированное число - индекс лежит в пределе [0, 99], а элементов в массивах primesFor_p или primesFor_g может быть меньше.
        // Поэтому выбор числа по рандомному индексу производится из массива, который в K раз больше primesFor_p или primesFor_g.
        var K = Math.ceil(100 / (primesArray.length));
        var tempArray = [];
        for( var i = 0; i < K; i++) {
            for( var j = 0; j < primesArray.length; j++ ) {
                tempArray.push(primesArray[j]);
            }
        }
        return tempArray[twoDigitNumber];
    }
    
}

class operationsOnNumbers{
    
    /**
     * Метод нахождения простых чисел до указанного предела.
     * @param {type} number
     * @returns {Boolean}
     */
    isPrime(number) {
        for (var i = 2; i < number; i++) {
            if (number % i === 0) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Метод нахождения чисел, подходящих под условия Хеллмана для p
     * @param {type} limit
     * @returns {Array|operationsOnNumbers.primeNumbersFor_p.primeNumbersFor_p}
     */
    primeNumbersFor_p(limit) { 
        var primeNumbersFor_p = [];
        for(var i = 15; i < limit; i++) {
            if(this.isPrime(i) && (this.isPrime((i-1)/2)) ) {
                primeNumbersFor_p.push(i);
            }
        }
        return primeNumbersFor_p;
    }
    
    /**
     * Метод нахождения чисел, подходящих под условия Хеллмана для g.
     * @param {type} limit
     * @returns {Array|operationsOnNumbers.primeNumbersFor_g.primeNumbersFor_g}
     */
    primeNumbersFor_g(limit) { 
        var primeNumbersFor_g = [];
        for(var i = 15; i < limit; i++) {
            if(this.isPrime(i)) {
                primeNumbersFor_g.push(i);
            }
        }
        return primeNumbersFor_g;
    }
    
    /**
     * Метод проверки соответствия первообазного корня g числу p.
     * @param {type} number
     * @param {type} mod_base
     * @returns {Boolean}
     */
    isPrimitiveRoot(number, mod_base) {
        var power_limit = 1000;
        for(var i = 1; i < (mod_base); i++) {
            for(var j = 0; j < power_limit; j++) {
                if( ((number**j) % mod_base) === i ) {
                    if( i === (mod_base - 1) ) {
                        return true;
                    }
                    break;
                } else {
                    if( j === power_limit - 1 ) {
                        return false;
                    }
                }
            }
        }
    }
    
    
}
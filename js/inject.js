

window.onload = function(){
    
    //  Вывод содержимого локального хранилища.
    chrome.storage.local.get(function(storage){
        console.log(storage);
    });
    
    
    //  Если в текстовом поле уже присутствует текст, сразу показываем кнопку шифрования и отправки.
    if(document.getElementsByClassName("im-chat-input--text")[0].innerHTML !== ""){
        console.log("Текстовое поле не пустое!");
    }else{
        console.log("Текстовое поле пустое!");
    }
    
    
    var __Listeners = new Listeners();
    var _DOMobjectsActions = new DOMobjectsActions;     //  Экземпляр класса работы с DOM страницы.
    
    
    //  Этот код перенести в демона, так как состояние шифрования и локация может быть изменена без перезагрузки страницы.
    if((window.location.href.split("?")[0] === "https://vk.com/im") && (window.location.href.indexOf("sel") !== -1)){ //  Если эта страница с диалогаями.    
        chrome.storage.local.get(function(storage){ //  Определяем состояние шифрования.
            var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
            var conversations = storage['conversations'] || null;

            if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                var id = conversations[userID] || null;

                if(id.cryptState === "established"){
                     //  Запуск отбработкика отправленных сообщений.
                     _DOMobjectsActions.textFieltChangeListener();   //  Запускаем обработкик отправки и шифрования написанных сообщений.
                }
                
            }
        }); 
    }

   
    
    //  Запуск главного демона, обрабатывающего принятые сообщения, отправленные сообщения и .
    __Listeners.daemonListener();

};



/**
 * Класс определяет методы взаимодействий с DOM.
 * @type type
 */
class DOMobjectsActions{
    
    /**
     * Конструктор.
     * @returns {DOMobjectsActions}
     */
    constructor(){
        this.container = null;              //  Родитель элементов отправки сообщений.
        this.textFieldContent = null;       //  Содержимое текстового поля ввода сообщения.
        this.defaultSendButton = null;      //  Элемент дефолтной кнопки отправки сообщения.        
        this.sendBTN = null;
        this.messageCounter = 0;
    }
    
    /**
     * Метод находит элемент кнопки отправки сообщения.
     * @returns {undefined}
     */
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
    
    /**
     * Метод возвращает дефолтную кнопку отправки сообщения.
     * @returns {undefined}
     */
    showDefaultButton(){
        console.log("Поле ввода текста опустошено!");
        console.log(document.getElementById("encrypt"));
        //  Показываем кнопку отправки голосового сообщения.
        document.getElementsByClassName("im-send-btn_send")[0].style.display = "block";  //  Скрываем дефолтную кнопку отправки сообщения.
        //  Удаляем фейковую кнопку.
        if(document.getElementById("encrypt") !== null){
            document.getElementById("encrypt").remove();
        }
    }
    
    /**
     * Метод скрывает дефолтную кнопку отправки сообщения.
     * @returns {undefined}
     */
    hideDefaultSendButton(){
        if(this.defaultSendButton){ //  Если присутствует дефолтная кнопка отправки сообщения.
            this.defaultSendButton.style.display = "none";  //  Скрываем дефолтную кнопку отправки сообщения.
        }
    }
    
    /**
     * Метод создает новую кнопку отправки сообщения и вешает на нее обработчик события шифрования и отправки.
     * @returns {undefined}
     */
    createFakeSendButton(){
        console.log("Создаем фейковую кнопку.");
        //  Создаем новую кнопку, которая будет внешне идентична оригиналу, но иметь отличный функционал.
        var cryptButton = document.createElement("button");
        cryptButton.setAttribute("class","crypt-btn");
        cryptButton.setAttribute("id","encrypt");
        cryptButton.setAttribute("title","Отправить зашифрованное сообщение");
        this.container.appendChild(cryptButton); 

        var encryptBtn = document.getElementById("encrypt");        //  Элемент кнопки.
        
        var simulateClick = this.simulateClick.bind(this);          //  Метод эмуляции клика.
        
        var _CryptingMessages = new CryptingMessages;               //  Класс шифрования сообщений.
        
        //var cryptingMessages = _CryptingMessages.encryptMessage.bind(this);            //  Метод кодрования исходного сообщения.
        
        encryptBtn.onclick = function(){    //  Обработчик нажатия на кнопку кодирования и отправки.
            console.log("Click on fake button...");
            
            //  Выполняем шифрование сообщения и замену исходного сообщения в поле ввода.
            _CryptingMessages.encryptMessage();     //  Шифрование сообщения.
            //  Ожидание необходимо для того, чтобы браузер успел вытащить ключ из локального хранилища.
            setTimeout(function(){
                //  Удаляем фейковую кнопку.
                document.getElementById("encrypt").remove();
                //  Отправляем сообщение, эмулируя клик.

                var sendButton = document.getElementsByClassName("im-chat-input--send")[0];
                simulateClick(sendButton);   //  Моделируем клик по элементу отправки сообщения.
            },150);
            
        };
          
    }
    
    /**
     * Метод управляет кнопкой отправки сообщения(скрывает/показывает дефолную/фейковую кнопку отправки сообщения).
     * @returns {undefined}
     */
    textFieltChangeListener(){
        
        var hideDefaultSendButton = this.hideDefaultSendButton.bind(this);
        var createFakeSendButton = this.createFakeSendButton.bind(this);
        var showDefaultButton = this.showDefaultButton.bind(this);
        var setInnersVars = this.setInnersVars.bind(this);
        
        console.log("При изменении содержимого поля ввода текста.");
        document.getElementsByClassName("im-chat-input--text")[0].addEventListener("DOMSubtreeModified", function() {   //  При изменении содержимого поля ввода текста.
            //  Устанавливаем значение переменных содержащих элементы DOM.
            setInnersVars();

            //  Скрываем дефолтную кнопку отправки текстового сообщения.
            hideDefaultSendButton();

            if(document.getElementsByClassName("im-chat-input--text")[0].innerHTML !== ""){        //  Если содержимое поля ввода не пустое.
                var cryptBTN = document.getElementsByClassName("crypt-btn")[0];     //  Элемент фейковой кнопки.
                if(cryptBTN === undefined){     //  Если фейковая кнопка еще не была создана.
                    createFakeSendButton();     //  Создаем фейковую кнопку.
                    console.log("Создаем фейковую кнопку!");
                }else{
                    console.log("Фейковая кнопка уже создана!");
                }
            }else{  //  Если поле ввода текста опустошено. Показываем кнопку отправки голосового сообщения.
                showDefaultButton();
                console.log("Показываем кнопку отправки голосового сообщения.");
            }

        });
        
    }
    
    /**
     * Метод сбратывает до дефолтных параметров.
     * @returns {undefined}
     */
    setInnersVars(){
        this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
        this.textFieldContent = document.getElementsByClassName("im-chat-input--text")[0].innerHTML;
        this.defaultSendButton = document.getElementsByClassName("im-send-btn_send")[0];
    } 
    
    /**
     * Метод эмулирует клик по элементу.
     * @param {type} obj
     * @returns {undefined}
     */
    simulateClick(obj) {
        var evt = document.createEvent("MouseEvents");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        var canceled = !obj.dispatchEvent(evt);
    }
    
    /**
     * Метод работае с визуальным переключателем шифрования.
     * @param {type} state
     * @returns {undefined}
     */
    changeCryptState(state){
        var label = document.getElementsByClassName("encrypt-label")[0];
        label.classList.toggle("crypt-" + state);
        document.getElementsByClassName("encrypt-chechbox")[0].checked = true;
        console.log("Вкл/Выкл шифрования.");
    }
    
}


class Parse{
    
    /**
     * Метод транслирует все смайлики в текстовое представление.
     * @returns {undefined}
     */
    emojiCheck(){
    
    }
    
    
}


class CryptingMessages{
    
    /**
     * Метод шифрует одно сообщение.
     * @returns {undefined}
     */
    encryptMessage(){
        
        //var _Decrypt = new Decrypt;
        
        var textfield = document.getElementsByClassName("im_editable");
        var sourceText = textfield[0].innerHTML;
        if(sourceText !== ""){
            
            var SecretKey = "";
            var encryptAlgorithm = this.encryptAlgorithm; 
           
            let promise = new Promise(function (resolve, reject) {
                //  Достаем из оркального хранилища секретный ключ.
                chrome.storage.local.get(function(storage){
                    var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                    var conversations = storage['conversations'] || null;
                    if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                        var id = conversations[userID] || null;
                        SecretKey = id.secretToken;
                        console.log("Секретный ключ получен - ", SecretKey);
                    }
                });
                setTimeout(function () {
                    resolve();
                }, 100);
            });

            promise
                .then(
                    function () {
                        var encoded = encryptAlgorithm(sourceText, SecretKey);      //  Кодировка сообщения.
                        textfield[0].innerHTML = encoded;                           //  Вставка текста сообщения в текстфилд.
                        
                        //this.simulateClick(sendBTN);                              //  Отправка сообщения.
                        //_Decrypt.decryptLastMessage();                            //  Расшифруем последнее отправленное сообщение.
                    })
                .catch(error => console.error(error));
           
            
        }else{
            console.log("Поле ввода текста пустое!");
        }
    }
    
    /**
     * Метод кодирует произвольный текст.
     * @param {type} __source
     * @param {type} SecretKey
     * @returns {String|CryptingMessages.encryptAlgorithm.RevEncFirstHalfMess|CryptingMessages.encryptAlgorithm.Enc_1_3_Salt|CryptingMessages.encryptAlgorithm.Enc_2_3_Salt|CryptingMessages.encryptAlgorithm.RevEncSecHalfMess}
     */
    encryptAlgorithm(__source, SecretKey){
        
        var _Base64 = new Base64();

        //var SecretKey = "cecf88db41531add5d0cefaa83fedb38";
        var literal = "/0xBB/0x3C";

        // Encoding: 
        var MessLen = __source.length,
            SaltLen = SecretKey.length;

        var FirstHalfMess = __source.substring(0, MessLen / 2), // Первая часть сообщения
            SecondHalfMess = __source.substring(MessLen / 2, MessLen), // Вторая часть сообщения

            _1_3_Salt = SecretKey.substring(0, SaltLen/3), // 1/3 соли
            _2_3_Salt = SecretKey.substring(SaltLen/3, SaltLen); // 2/3 соли

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
    
    
    
    
    
    /**
     * Метод добавления соли к кодированому сообщению.
     * @param {type} __source
     * @returns {CryptingMessages.encryptAddSault._encoded}
     */
    encryptAddSault(__source){
        var _encoded = __source;
        
        return _encoded;
    }
    
    
}


/**
 * Класс реализует методы дешифровки сообщений.
 * @type type
 */
class DecryptingMessages{
    
    /**
     * Метод расшифровывает ранее написанные сообщения, должен вызываться при загрузке страницы.
     * @returns {undefined}
     */
    decryptAllMessage(){
        var __allMessages = document.getElementsByClassName("im-mess--text");
        for(var i = 0; i < __allMessages.length; i++){
            //console.log("Source message text: ", __allMessages[i].innerHTML);
            var decryptMsg = this.decryptAlgorithm(__allMessages[i].innerHTML);
            if(decryptMsg !== false){   //  Декодирует сообщение.
                __allMessages[i].innerHTML = decryptMsg;
            }else{  //  Сообщение не является закодированым.
                
            }
        }
    }
    
    
    /**
     * Метод расшифровывает последнее сообщение.
     * @returns {undefined}
     */
    decryptLastMessage(){
        var context = this;
        setTimeout(function(){
            var __allMessages = document.getElementsByClassName("im-mess--text");
            var lastMessage = __allMessages.length - 1;
            console.log("Расшифровать последнее сообщение: ", __allMessages[lastMessage].innerHTML);

            var sourceText = __allMessages[lastMessage].innerHTML;
            var mediaTag = sourceText.split("<")[1];

            var decodeText = context.decryptAlgorithm(sourceText.split("<")[0]);
            if(decodeText !== false){   //  Если декодирование дало положительный результат.
                //console.log("Сообщение успешно раскодировано! Результат:", decodeText);
                //  Заменяем текст в контейнере раскодированным сообщением.
                __allMessages[lastMessage].innerHTML = decodeText + "<" + mediaTag;                
            }else{
                //console.log("Сообщение находится в незакодированном виде! Результат:", sourceText);
            }
            
        }, 0);
    }
    
    /**
     * Метод декодирует несколько последних сообщений.
     * Метод необходим для раскодирования сообщений, полученных при отправке нового сообщения(одновременно, или с небольшим отстованием по времени).
     * Метод вызывается в основном демоне.
     * @returns {undefined}
     */
    decryptSomeMessages(){
        var amountMassages = 4;
        var context = this;
        //  Контейнер со всеми сообщениями.
        var __allMessages = document.getElementsByClassName("im-mess--text");
        //  Перебираем несколько последних сообщений.
        for(var i = __allMessages.length - 1; i > __allMessages.length - amountMassages; i--){
            var sourceText = __allMessages[i].innerHTML;
            var mediaTag = sourceText.split("<")[1];
            
            var decodeText = context.decryptAlgorithm(sourceText.split("<")[0]);
            if(decodeText !== false){   //  Если декодирование дало положительный результат.
                //console.log("Сообщение успешно раскодировано! Результат:", decodeText);
                //  Заменяем текст в контейнере раскодированным сообщением.
                __allMessages[i].innerHTML = decodeText + "<" + mediaTag;                
            }else{
                //console.log("Сообщение находится в незакодированном виде! Результат:", sourceText);
            }
        }
    }
    
    
    /**
     * Алгоритм расшифровки сообщения.
     * @param {type} __source
     * @returns {DecryptingMessages.decryptAlgorithm.secondHalf|DecryptingMessages.decryptAlgorithm.firstHalf}
     */
    decryptAlgorithm(__source){
        var _Base64 = new Base64();
        
        var receiverSalt = "cecf88db41531add5d0cefaa83fedb38"; // Соль и литерал - такие же, как и у отправителя
        var receiverLiteral = "/0xBB/0x3C";
        
        var errorCheck = __source.split(receiverLiteral) || null;
        if(errorCheck.length !== 1){
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

            return receiverOutput;
            
        }else{
            //  Сообщение находится в незакодированном виде!
            return false;
        } 
    }
    
}


/*
 * Класс содержит методы обработки входящих служебных и обычных сообщений.
 * @type class
 */
class MainActions{
    
    constructor() {
        this.senderName = document.getElementsByClassName("top_profile_img")[0].getAttribute("alt");    //  Имя отправителя.
        this.userFullName = document.getElementsByClassName("_im_page_peer_name")[0].text;              //  Полное имя собеседника.
        this.userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1]; //  ID пользователя в системе VK.

        this._DOMobjectsActions = new DOMobjectsActions();                  //  Класса работы с DOM.
        this.keyGeneration = new KeyGeneration;                             //  Класс операций с ключами.
        this.LocalStorage = new LocalStorageActions;                        //  Класс операций с локальным хранилищем.
        this.NotificationsAndMessaging = new NotificationsAndMessaging;     //  Класс реализующий функционал отправки сообщений.  
    }
    
    
    /*
     * Метод определяет алгоритм действий при получении приглашения создания защищенного соединения.
     * @returns {undefined}
     */
    invitation(currentMessage) {
        
        var keyGeneration = this.keyGeneration;
        var LocalStorage = this.LocalStorage;
        var NotificationsAndMessaging = this.NotificationsAndMessaging;
        var senderName = this.senderName;
        var userID = this.userID;
        
        //  Изменяем состояние чекбокса.
        console.log("Поиск бага...Метка 1");
        this._DOMobjectsActions.changeCryptState("pending");
        //  Создание пары первичных ключей и отправка их собеседнику.
        var publicKeys = this.keyGeneration.createFirstPublicKey();
        var encodePublicKeys = this.keyGeneration.encodePublicKeys(publicKeys);
        var a = 0;
        //  Записать ключи в локальное хранилище.
        //  Необходимо обеспечить последовательное выполнение записи этих значений через обещания.
        let promise = new Promise(function (resolve, reject) {
            LocalStorage.changeProperty("cryptState", "pending", userID);
            setTimeout(function () {
                resolve();
            }, 100);
        });

        //  Последовательное выполнение изменения значений в локальном хранилище.
        promise
            .then(
                function () { //  Запись p в локальное хранилище.
                    LocalStorage.changeProperty("p", encodePublicKeys.p, userID);
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve();
                        }, 100);
                    });
                })
            .then(function () {   //  Запись g в локальное хранилище.
                LocalStorage.changeProperty("g", encodePublicKeys.g, userID);
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 100);
                });
            })
            .then(function () {   //  Генерация a.
                //  Генерация секретного ключа пользователя.
                a = keyGeneration.generateSecretKey();
                //  Запись секретного ключа в локальное хранилище.
                LocalStorage.changeProperty("secretKey", a, userID);
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve();
                    }, 100);
                });
            })
            .then(function () {   //  Расчет открытого ключа A.
                //  Декодирование первичных ключей p и g.
                var openedKeys = keyGeneration.decodePublicKeys(encodePublicKeys.p, encodePublicKeys.g);
                //  Расчет открытого ключа B.
                var A = bigInt(openedKeys.g).pow(a).mod(openedKeys.p).toString();
                //  Кодирование открытого клюяа для передачи собеседнику.
                var encodeOpenedKey = keyGeneration.encodeOpenedKey(A);
                //  Передача ключей собеседнику.(код выполняется перед записью ключей в локальное хранилище.)
                var messageContent = "[" + senderName + "]: Принимаю Ваше предложение. <br> Первичные открытые ключи шифрования: <br>" + encodePublicKeys.p + "<br>" + encodePublicKeys.g;
                messageContent += "<br>Открытый ключ шифрования:<br>" + encodeOpenedKey + "<br>Ожидаю открытый ключ собеседника.";
                NotificationsAndMessaging.sendServiceMessage(messageContent); //  Отправка уведомления собеседнику.
            })
            .catch(error => console.error(error));
    
    }
    
    
    /*
     * Метод определяет порядок формирования ключей при принятом первичном ключе.
     * @param {type} currentMessage
     * @returns {undefined}
     */
    acceptance(currentMessage){
        
        var _DOMobjectsActions = this._DOMobjectsActions;
        var keyGeneration = this.keyGeneration;
        var LocalStorage = this.LocalStorage;
        var NotificationsAndMessaging = this.NotificationsAndMessaging;
        var senderName = this.senderName;
        var userID = this.userID;
        
        var p = currentMessage.split("<br>")[2];
        var tempg = currentMessage.split("<br>")[3];
        var g = tempg.split("<")[0];
        var b = 0;
        //  Запись первичных секретных ключей в локальное хранилище.
        let secondPhasePromise = new Promise(function (resolve, reject) {
            LocalStorage.changeProperty("p", p, userID);
            setTimeout(function () {
                resolve();
            }, 100);
        });

        //  Последовательное выполнение изменения значений в локальном хранилище.
        secondPhasePromise
            .then(function(){   //  Записывает g в локальное хранилище.
                    LocalStorage.changeProperty("g", g, userID); 
                    return new Promise(function(resolve, reject){
                        setTimeout(function () {
                            resolve();
                        }, 100);
                    });   
                })
            .then(function(){   //  Создание секретного ключа b.
                    //console.log("Пара первичных ключей записана в локальное хранилище.");
                    //  Генерация секретного ключа пользователя.
                    b = keyGeneration.generateSecretKey();
                    //  Запись секретного ключа в локальное хранилище.
                    LocalStorage.changeProperty("secretKey", b, userID); 
                    return new Promise(function(resolve, reject){
                        setTimeout(function () {
                            resolve();
                        }, 100);
                    }); 
                })
            .then(function(){
                    //  Декодирует первичные открытые ключи.
                    var openedKeys = keyGeneration.decodePublicKeys(p, g);
                    //  Расчет открытого ключа B.
                    var B = bigInt(openedKeys.g).pow(b).mod(openedKeys.p).toString();
                    //  Кодирование открытого клюяа для передачи собеседнику.
                    var encodeOpenedKey = keyGeneration.encodeOpenedKey(B);
                    //  Передача расчитанного открытого ключа собеседнику.
                    var messageContent = "[" + senderName + "]: Открытый ключ шифрования: <br>" + encodeOpenedKey;
                    NotificationsAndMessaging.sendServiceMessage(messageContent); //  Отправка уведомления собеседнику.  
                })
            .then(function(){   //  Расчет секретного ключа S2.
                    var A = currentMessage.split("<br>")[5];
                    //  Декодирование приняиого открытого ключа A.
                    A = keyGeneration.decodeOpenedKey(A);
                    //  Декодирование первичных ключей g и p.
                    var openedKeys = keyGeneration.decodePublicKeys(p, g);
                    //  Расчет S2.
                    var S2 = bigInt(A).pow(b).mod(openedKeys.p).toString();
                    //  Хешируем секретный ключ.
                    var secretKey_hash = md5(parseInt(S2) + 120497);
                    //  Записываем хеш секретного ключа в локальное хранилище.
                    LocalStorage.changeProperty("secretToken", secretKey_hash, userID);
                    return new Promise(function(resolve, reject){
                        setTimeout(function () {
                            resolve();
                        }, 100);
                    }); 
                })
            .then(function(){   //  Расчет секретного ключа S2.
                    //  Устанавливаем состояние соединения в established.
                    LocalStorage.changeProperty("cryptState", "established", userID);
                    //  Изменяем состояние чекбокса.
                    console.log("Поиск бага...Метка 2");
                    _DOMobjectsActions.changeCryptState("established");
                    //  Очищаем окно с уведомлением.
                    NotificationsAndMessaging.clearNotifyField();
                })
            .catch(error => console.error(error));
    }
    
    
    /*
     * Метод обрабатывает команду, приема открытого ключа от собеседника. Вычисляет секретный ключ.
     * @param {type} currentMessage
     * @returns {undefined}
     */
    keysReception(currentMessage){
        
        var _DOMobjectsActions = this._DOMobjectsActions;
        var keyGeneration = this.keyGeneration;
        var LocalStorage = this.LocalStorage;
        var NotificationsAndMessaging = this.NotificationsAndMessaging;
        var senderName = this.senderName;
        var userID = this.userID;
        
        //  Считывание p и a из локального хранилища.
        chrome.storage.local.get(function (storage) {
            var conversations = storage['conversations'] || null;
            if (conversations[userID]) {
                for (var key in conversations) {
                    if (conversations.hasOwnProperty(key) && key === userID) {
                        var convProps = conversations[key];
                        var B = currentMessage.split("<br>")[1];
                        B = B.split("<div")[0];
                        var p = convProps["p"];
                        var g = convProps["g"];
                        var a = convProps["secretKey"];
                        //  Декодирование приняиого открытого ключа B.
                        B = keyGeneration.decodeOpenedKey(B);
                        //  Декодирование p.
                        var openedKeys = keyGeneration.decodePublicKeys(p, g);
                        //  Расчитывает ключ S.
                        var S1 = bigInt(B).pow(a).mod(openedKeys.p).toString();
                        //  Хешируем секретный ключ.
                        var secretKey_hash = md5(parseInt(S1) + 120497);
                        //  Последовательно изменяем значения в локальном хранилище.
                        //  Записывает S в локальное хранилище.
                        let forthPhasePromise = new Promise(function (resolve, reject) {
                            //  Записываем хеш секретного ключа в локальное хранилище.
                            LocalStorage.changeProperty("secretToken", secretKey_hash, userID);
                            setTimeout(function () {
                                resolve();
                            }, 100);
                        });

                        //  Последовательное выполнение изменения значений в локальном хранилище.
                        forthPhasePromise
                            .then(function(){   //  Записывает g в локальное хранилище.
                                    //  Устанавливаем состояние соединения в established.
                                    LocalStorage.changeProperty("cryptState", "established", userID);
                                })
                            .then(function(){   //  Создание секретного ключа b.
                                    //  Отправляем собеседнику уведомление о том, что шифрование включено.
                                    var messageContent = "[" + senderName + "]: Защищённая передача данных установлена!<br>";
                                    messageContent += "ВНИМАНИЕ!<br>";
                                    messageContent += "Отключив шифрование, вы навсегда потеряете возможность расшифровать сообщения, отправленные в зашифрованном виде!<br>";
                                    NotificationsAndMessaging.sendServiceMessage(messageContent); //  Отправка уведомления собеседнику.
                                    //console.log("Собеседнику отправлено уведомление о том, что защищённая передача данных установлена.");
                                    //  Изменяем состояние чекбокса.
                                    console.log("Поиск бага...Метка 3");
                                    _DOMobjectsActions.changeCryptState("established");
                                    console.log("Шифрование успешно включено!");
                                })
                            .catch(error => console.error(error));
                    }
                }
            }
        });
    }
    
    
    /*
     * Метод разрывает защищенное соединение, удаляя запись о диалоги из локального хранилища.
     * @returns {undefined}
     */
    breakConnection(){
        //  Удаляем диалог из локального хранилища.
        this.LocalStorage.removeConversation(this.userID);    //  Удаляем информацию об этом диалоге в локальном хранилище.
        //  Устанавливаем чекбокс в неактивное положение.
        var label = document.getElementsByClassName("encrypt-label")[0];
        label.classList.toggle("crypt-inactive");
        document.getElementsByClassName("encrypt-chechbox")[0].checked = false;
    }
    
    
    /*
     * Метод вызывается при успешном соединении.
     * @returns {undefined}
     */
    successfulConnection(){
        console.log("Шифрование успешно включено!");
    }
    
    
    /*
     * Метод обрабатывает все сообщения кроме служебных.
     * @param {type} __allMessages
     * @param {type} currentMessage
     * @returns {undefined}
     */
    otherMessages(){
        var __allMessages = document.getElementsByClassName("im-mess--text");                       //  Все сообщения.
        
        var _DOMobjectsActions = this._DOMobjectsActions;
        var keyGeneration = this.keyGeneration;
        var LocalStorage = this.LocalStorage;
        var NotificationsAndMessaging = this.NotificationsAndMessaging;
        var senderName = this.senderName;
        var userID = this.userID;
        
        var messageContent = __allMessages[__allMessages.length - 1].innerHTML.split("<div")[0];

        //  Если это не сообщение подтверждения установки шифрования или его окончания или в сообщении нет "]:".
        if( ((messageContent.split("]:")[1]) === undefined) ||  
            (   ((messageContent.split("]:")[1]).split("<br>")[0] !== " Предлагаю Вам перейти к защищенной беседе. ") &&
                ((messageContent.split("]:")[1]).split("<br>")[0] !== " Принимаю Ваше предложение. ") &&
                ((messageContent.split("]:")[1]).split("<br>")[0] !== " Открытый ключ шифрования: ") &&
                ((messageContent.split("]:")[1]).split("<br>")[0] !== " Защищённая передача данных установлена!") &&
                ((messageContent.split("]:")[1]).split("<br>")[0] !== " Разрываю защищенное соединение!"))  ){


            //  Если состояние шифрования имеет статус established.
            chrome.storage.local.get(function(storage){
                var conversations = storage['conversations'] || null;
                if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                    var id = conversations[userID] || null;
                    if(id.cryptState === "established"){
                        //  Декодировка сообщения.
                        var _DecryptingMessages = new DecryptingMessages;
                        //_DecryptingMessages.decryptLastMessage();
                        _DecryptingMessages.decryptSomeMessages();  //  Декодируем несколько последних сообщений.
                        //__allMessages[__allMessages.length - 1].innerHTML = messageContent + " encrypted message_";
                        
                        
                        //  Замена декодированным сообщением.
                        
                        
                        
                        
                    }
                }
            });
        }
    }
    
}


/*
 * Класс содержит методы демонов, реагирующих на определенные действия.
 * @type class
 */
class Listeners{
    
    constructor(){
        this.updateTime = 500;
        this.container = document.getElementsByClassName("im-chat-input--txt-wrap")["0"];    //  Родитель элементов отправки сообщений.
        this.sendBTN = this.container.children[6];  //  Элемент отправки сообщения.
        this.messageCounter = 0;
        this.lastMessage = "";
        this.userFullName = null;
        this.userName = null;
        
        this.onLoadDecryptFlag = false;
        this.onLoadDecryptLastUserID = null;
    }
    
    /*
     * Метод обрабатывает новые сообщения.
     * @returns {undefined}
     */
    messageListener(){
        //  Обработка сообщений.       
        var __allMessages = document.getElementsByClassName("im-mess--text");                       //  Все сообщения.
        if(this.messageCounter !== __allMessages.length){                                           //  Если замечено изменение количество сообщений.
            this.messageCounter = __allMessages.length ;                                            //  Запоминаем общее количество сообщений.
            if(__allMessages[this.messageCounter - 1].innerHTML !== this.lastMessage){              //  Если последнее сообщение изменилось.             
                var userFullName = document.getElementsByClassName("_im_page_peer_name")[0].text;   //  Полное имя собеседника.
                this.userName = userFullName.split(" ")[0];
                this.lastMessage = __allMessages[__allMessages.length - 1].innerHTML;;              //  Содержание текущего обрабатываемого сообщения.
                
                var mainActions = new MainActions;      //  Класс, контролирующий все основные.
                
                //  Определяем принятое сообщения и вызываем метод, обрабатывающий данное сообщение.
                switch (this.lastMessage.split("<")[0]){
                    //  Команда начала создания первичных открытых ключей.
                    case "[" + this.userName + "]: Предлагаю Вам перейти к защищенной беседе. ":
                        mainActions.invitation(this.lastMessage);
                        break;
                        
                    //  Команда приема открытого ключа собеседника.
                    case "[" + this.userName + "]: Принимаю Ваше предложение. ":
                        mainActions.acceptance(this.lastMessage);
                        break;
                        
                    case "[" + this.userName + "]: Открытый ключ шифрования: ":
                        mainActions.keysReception(this.lastMessage);
                        break;
                    
                    //  Инициатору шифрованной беседы.
                    case "[" + this.userName + "]: Защищённая передача данных установлена!":
                        mainActions.successfulConnection();
                        break;
                    
                    //  Если собеседник закрыл защищенный канал связи.
                    case "[" + this.userName + "]: Разрываю защищенное соединение!":
                        mainActions.breakConnection();
                        break;
                    

                }   
            }
        }
    }
    
    
    
    /*
     * Метод определяет действия на странице диалогов.
     * Управляет отображением кнопки шифрования и показом и отправков уведомлений.
     * @returns {Generator}
     */
    onOpenDialogListener(){
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
        
        var _DOMobjectsActions = new DOMobjectsActions(); //  Создаем экземпляр класса работы с DOM.
        console.log("Определение состояния шифрования");
        //  Определение состояния шифрования и цвета чекбокса шифрования.
        chrome.storage.local.get(function(storage){ //  Определяем состояние шифрования.
            var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
            var conversations = storage['conversations'] || null;

            if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                var id = conversations[userID] || null;

                switch (id.cryptState){
                    case "pending": //  Ожидается подтверждение собеседника.
                        console.log("Поиск бага...Метка 4");
                        _DOMobjectsActions.changeCryptState("pending");
                        break;
                        
                    case "established": //  Соединение установлено.
                        console.log("Поиск бага...Метка 5");
                        _DOMobjectsActions.changeCryptState("established");
                        break;

                    case "error":   //  Соединение разорвано собеседником.
                        console.log("Поиск бага...Метка 6");
                        _DOMobjectsActions.changeCryptState("error");
                        break;
                    
                    default :
                        break;
                } 
            }else{
                console.log("Диалог не найден в локальном хранилище!");
                console.log("Создание записи с информацией о диалоге...");
                //  Создание записи в локальном хранилище информации о данном диалоге.
                var userName = document.getElementsByClassName("_im_page_peer_name")[0].text;
                //  Формирование объекта.
                var newUser = {
                    id: userID,
                    userName: userName,
                    cryptState: "inactive",
                    secretToken: null,
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
        var notificationsAndMessaging = new NotificationsAndMessaging;

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
                    secretToken: null,
                    secretKey: null,
                    p: null,
                    g: null
                };
                //  Добавление объекта в локальное хранилище.
                var localStorage = new LocalStorageActions; //  Создание экземпляра класса для работы с лдокальным хранилищем.
                localStorage.addConversation(newUser);
                
                //  Отправляем оповещение пользователю о начала зашифрованого общения.
                notificationsAndMessaging.interlocutorNotify(); 
                //  Начало обмена секретными ключами с пользователем.

            }else{  //  Если чекбокс выключен.
                console.log("Отключение шифрования...");
                var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                var LocalStorage = new LocalStorageActions;
                LocalStorage.removeConversation(userID);    //  Удаляем информацию об этом диалоге в локальном хранилище.
                
                //  Посылаем уведомление собеседнику о завершении шифрованного соединения.
                var senderName = document.getElementsByClassName("top_profile_img")[0].getAttribute("alt");  //  Имя отправителя.
                var messageContent = "[" + senderName + "]: Разрываю защищенное соединение!";
                notificationsAndMessaging.sendServiceMessage(messageContent); //  Отправка уведомления собеседнику.
            }
        }; 
   }
    
    
    /**
     * Общий демон, слушает все события.
     * @returns {undefined}
     */
    daemonListener(){
        var onOpenDialogListener = this.onOpenDialogListener.bind(this);
        var messageListener = this.messageListener.bind(this);
        var onLoadPageDecryptAllMsg = this.onLoadPageDecryptAllMsg.bind(this);
        var _DecryptingMessages = new DecryptingMessages;
        var _MainActions = new MainActions;
        var context = this;
        window.setInterval(function(){
            
            if((window.location.href.split("?")[0] === "https://vk.com/im") && (window.location.href.indexOf("sel") !== -1)){ //  Если эта страница с диалогаями.
                
                //  Управление визуальными объектами.
                if(document.getElementById("encrypt-state") === null){  //  Если чекбокс еще не был создан.
                    //  Создание чекбокса шифрования.
                    onOpenDialogListener();  //  Управляет отображением кнопки шифрования и показом и отправков уведомлений.
                }
                
                onLoadPageDecryptAllMsg();  //  Метод дешифрует все сообщения при открытии страницы с диалогом.
                
                messageListener();          //  Метод проверяет наличие новых сообщений, служебные обрабатывает, обычные дешифрует.
                
                _MainActions.otherMessages();   //  
                
            }else{
                context.onLoadDecryptLastUserID = null;
                //console.log("Пользователь ушел со страницы с диалогом.");
            }

        }, this.updateTime);
    }
    
    /**
     * Метод расшифровки ранее принятых и отправленных сообщений.
     * @returns {undefined}
     */
    onLoadPageDecryptAllMsg(){
        
        var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
        
        if(this.onLoadDecryptLastUserID !== userID){
            //  Записываем идентификатор пользователя. Данное действие необходимо для того, чтобы предотвратить цикличную расшифровку уже расшифрованных сообщений.
            this.onLoadDecryptLastUserID = userID;

            //  Расшифровываем все сообщения.
            chrome.storage.local.get(function(storage){ //  Определяем состояние шифрования.
                //var userID = window.location.href.split("?sel=")[1] || window.location.href.split("&sel=")[1];
                var conversations = storage['conversations'] || null;
                if(conversations !== null && conversations[userID]){ //  Если диалог существует в локальном хранилище.
                    var id = conversations[userID] || null;
                    if(id.cryptState === "established"){
                        //  Расшифровка ранее принятых и написанных сообщений.
                        //console.log("Расшифровываем все сообщения.");
                        var _DecryptingMessages = new DecryptingMessages;
                        _DecryptingMessages.decryptAllMessage();
                    }
                }
            });
        }else{
            //  Сообщения в этом диалоге уже расшифрованы!
            //console.log("Сообщения в этом диалоге уже расшифрованы!");
        }
        
    }
    
}


/*
 * Класс определяет методы обмена служебными сообщениями.
 * @type class
 */
class NotificationsAndMessaging{
    
    /*
     * Метод отправляет служебное сообщение собеседнику.
     * @param {type} content
     * @returns {undefined}
     */
    sendServiceMessage(content){
        var _DOMobjectsActions = new DOMobjectsActions(); //  Создаем экземпляр класса работы с DOM.
        
        var textbox = document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];    //  Текстовое поле ввода сообщения.
        _DOMobjectsActions.simulateClick(textbox);  //  Моделируем клик по полю ввода сообщения.
        textbox.innerHTML = content;   //  Помещаем текст сообщения в поле ввода.
        
        //  Заменяем элемент отправки голосового сообщения элементом отправки текстового сообщения.
        var sendButton = document.getElementsByClassName("im-chat-input--send")[0];
        sendButton.className = "im-send-btn im-chat-input--send _im_send im-send-btn_send";
        sendButton.setAttribute("aria-label", "Send");
        sendButton.setAttribute("data-tttype", "1");
        
        _DOMobjectsActions.simulateClick(sendButton);   //  Моделируем клик по элементу отправки сообщения.
    }
    
    
    /*
     * Метод отправляет уведомление собеседнику о начале зашифрованой беседы.
     * @returns {undefined}
     */
    interlocutorNotify(){
        var senderInfo = document.getElementsByClassName("top_profile_img")[0];
        var sender = senderInfo.getAttribute("alt");  //  Имя отправителя.
        var notification = "[" + sender + "]: Предлагаю Вам перейти к защищенной беседе. <br> Для начала включите шифрование.";  //  Текст сообщения.
        
        var _DOMobjectsActions = new DOMobjectsActions(); //  Создаем экземпляр класса работы с DOM.
        
        var textbox = document.getElementsByClassName("im_editable im-chat-input--text _im_text")[0];    //  Текстовое поле ввода сообщения.
        _DOMobjectsActions.simulateClick(textbox);  //  Моделируем клик по полю ввода сообщения.
        textbox.innerHTML = notification;   //  Помещаем текст сообщения в поле ввода.
        
        //  Заменяем элемент отправки голосового сообщения элементом отправки текстового сообщения.
        var sendButton = document.getElementsByClassName("im-chat-input--send")[0];
        sendButton.className = "im-send-btn im-chat-input--send _im_send im-send-btn_send";
        sendButton.setAttribute("aria-label", "Send");
        sendButton.setAttribute("data-tttype", "1");
        
        _DOMobjectsActions.simulateClick(sendButton);   //  Моделируем клик по элементу отправки сообщения.
        
        
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
    
    
    
     /*
     * Метод очищает поле с уведомлением.
     * @returns {undefined}
     */
    clearNotifyField(){
        var sendButton = document.getElementsByClassName("im-page--fixer")[0];     //  Элемент .im-page--fixer ._im_typer_c находится всегда внизу страницы.
        sendButton.classList.remove("notify-bg");
        sendButton.innerHTML = "";
    }
     
}


/*
 * Класс содержит набор методов для работы с локальным хранилищем.
 * @type class
 */
class LocalStorageActions{
    
    /*
     * Метод устанавливает значение в локальном хранилище.
     * @param {type} object
     * @returns {undefined}
     */
    set(object){
        chrome.storage.local.set(object, function() {
            //console.log(object + ' Value saved!');  
        });
    }
    
    
    /*
     * Метод получает значение из локального хранилища.
     * @param {type} object
     * @param {type} callback
     * @returns {undefined}
     */
    get(object, callback){
        chrome.storage.local.get([object], callback);
    }
    
    
    /*
     * Метод удаляет объект из локального хранилища.
     * @param {type} object
     * @returns {undefined}
     */
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
    }
    
    
    /*
     *  Метод удаляет запись о диалоге из локального хранилища при отключении шифрования.
     */
    removeConversation(userID){
        //console.log("Удаление записи о диалоге из локального хранилища.");
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
                setTimeout(function(){
                    set({'conversations': newConversations});
                    console.log("Conversation ", userID, " removed!");
                }, 100);
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

}


/*
 * Класс содержит набор методы для генерации, кодирования и декодирования различных ключей.
 * @type class
 */
class KeyGeneration{
    
    /**
     * Метод генерирует пару случайных простых чисел, удовлетворяющих алгоритму Диффи-Хелмана.
     * @returns {KeyGeneration.createFirstPublicKey.injectAnonym$5}
     */
    createFirstPublicKey(){
        
        var numberOperations = new OperationsOnNumbers;
        
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
            p: "nj1RQzoNjM0U7qP" + _Base64.encode64((keys.p)**4),
            g: "g3FeqVt9NjTTw0Q" + _Base64.encode64((keys.g)**4)
        };
    }
    
    
    /*
     * Метод декодирует пару первичных открытых ключей.
     * @param {type} p
     * @param {type} g
     * @returns {KeyGeneration.decodePublicKeys.injectAnonym$7}
     */
    decodePublicKeys(p, g){
        var _Base64 = new Base64();
        return {
            p: Math.pow(_Base64.decode64(p.substr(15, p.length)), 0.25),
            g: Math.pow(_Base64.decode64(g.substr(15, g.length)), 0.25)
        };
    }
    
    
    /*
     * Метод кодирует открытый ключ для передачи собеседнику.
     * @param {type} openedKey
     * @returns {Number}
     */
    encodeOpenedKey(openedKey){
        var _Base64 = new Base64();
        openedKey = parseInt(openedKey) + 4;
        return "q63jlFTRnN1KLOXFWDE75RQMO" + _Base64.encode64((openedKey)**5);
    }
    
    
    /*
     * Метод декодирует открытый ключ для передачи собеседнику.
     * @param {type} openedKey
     * @returns {Number}
     */
    decodeOpenedKey(openedKey){
        var _Base64 = new Base64();
        var splited = openedKey.substr(25, openedKey.length);
        var decoded = _Base64.decode64(splited);
        var power = Math.pow(decoded, 0.20);
        return (Math.round(power) - 4);
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
    
    
    /*
     * Метод генерации случайного числа в диапазоне от 0 до 999.
     * @returns {String}
     */
    generateSecretKey() {
        var rand = Math.random();
        var variable = null;

        if (`${rand}`.split("")[2] === '0') {
            if (`${rand}`.split("")[6] === '0') {
                variable = `${rand}`.split("")[3];
            } else {
                variable = `${rand}`.split("")[6] + `${rand}`.split("")[3];
            }
        } else {
            variable = `${rand}`.split("")[2] + `${rand}`.split("")[6] + `${rand}`.split("")[3];
        }
        return variable;
    }
    
}


/*
 * Класс определяет набор методов для работы с простыми числами.
 * @type class
 */
class OperationsOnNumbers{
    
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
     * @returns {Array|OperationsOnNumbers.primeNumbersFor_p.primeNumbersFor_p}
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
     * @returns {Array|OperationsOnNumbers.primeNumbersFor_g.primeNumbersFor_g}
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


/*
 * Класс содержит 2 метода, которые позволяют кодировать и декодировать строки в Base64.
 * @type class
 */
class Base64{
    
    constructor(){
        
        this.keyStr = "ABCDEFGHIJKLMNOP" +
                      "QRSTUVWXYZabcdef" +
                      "ghijklmnopqrstuv" +
                      "wxyz0123456789+/" +
                      "=";
    }
    
    
    /*
     * Метод кодирование входящей строки в base64.
     * @param {type} input
     * @returns {String}
     */
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
    
    
    /*
     * Метод декодирования из base64.
     * @param {type} input
     * @returns {Boolean}
     */
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
# VKcrypt
**Описание скоро будет заполнено**

Шифровальщик личных диалогов в сервисе vk.com.

<h3>Принцип работы</h3>  

Принцип работы шифровальщика основан на end-to-end шифровании, реализуемое на стороне клиента. Такой подход гарантирует защищенность печедачи данных, так как на сервере vk.com переписка хранится в защифрованном виде. Расшифровать сообщение возможно только при 2-х условиях, первое, у расшифровщика имеется общий ключ шифрования, второе, расшифровщик знает алгоритм шифрования.
**В настоящей публичной версии проекта используется только пример алгоритма шифрования(для дальнейшей работы необходимо изменить алгоритм исходя из личных предпочтений)**

<h3>Начало работы</h3>  

1. Первым делом необходимо произвести установку расширения у обоих собеседников.

<h3>Подключение расширения</h3>  

1. Загрузите проект полностью, нажав на кнопку "Clone or download".
2. В браузере Chrome перейдите в раздела "Расширения". Настройка и управление->Дополнительные инструменты->Расширения.
3. Включите режим разработчика, установив галочку в поле "Режим разработчика".
4. Нажмите на кнопку "Загрузить распакованное расширение.." и выберите корневую папку со скаченным проектом (при необходимости разархивируйте скаченный проект).
5. Перейдите на страницу любого предмета на Маркете.
  
### Пример работы

![screen](https://raw.githubusercontent.com/Shitovdm/VKcrypt/master/service/img/screen/decrypted.png)  
  
![screen](https://raw.githubusercontent.com/Shitovdm/VKcrypt/master/service/img/screen/encrypted.png)    

**Я специально не стал загружать расширение в магазин Chrome, чтобы вы могли убедиться в его безопасности. Поэтому при перезагрузке браузера, Chrome будет вам постоянно напоминать о включенном режиме разработчика.**
  
**Не скачивайте подобное расширение из подозрительных истоников или тчательно проверяйте его исходный код**

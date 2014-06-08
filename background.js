
/**
 * Формирует каркас блока, добавляемого на страницу.
 * @returns {undefined}
 */
function pasteContent(){    //  &#8381;
    $(".exchange-link").addClass("workspaceBlock");    // Помечаем блок, в который в дальнейшем будм помещать контент.
    //  Создаем блок ссылки обмена.
    var exchange_link_Content = $(".exchange-link").html(); //  Запоминает собержимое блока, который переопределим в дальнейшем.
    var exchange_link_Block = document.createElement("div");    //  Создаем новый блок.
    exchange_link_Block.setAttribute("class", "exchange-link"); //  Добавляем оригинальный класс.
    exchange_link_Block.innerHTML = exchange_link_Content;  //  Наполняем содержимым.
    $(".item-page-left").append(exchange_link_Block);   //  Помещаем в конец родительского блока.
    
    //  Создаем два блока, один для контента, второй для прелоадера.
    var preloaderBlock = document.createElement("div");
    var injectBlock = document.createElement("div");
    preloaderBlock.setAttribute("class", "preloaderBlock");
    injectBlock.setAttribute("class", "injectBlock");
    $(".workspaceBlock").html(preloaderBlock);
    $(".workspaceBlock").append(injectBlock);
    //$(".workspaceBlock").removeClass("exchange-link");
    $(".preloaderBlock").html('<div class="banter-loader"><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div><div class="banter-loader__box"></div></div>'); 
            
    //  Внедряем свой блок.
    $(".injectBlock").html(""+  
        "<div class='subBlock' id='lowest_price' title='Самая низка цена на предмет на торговой площадке Steam'>"+
            "<small class='priceTitle'>Текущая цена:</small>"+
            "<div class='clear'></div>"+
            "<b></b>"+
        "</div>"+
        "<div class='subBlock' id='median_price' title='Средняя цена на предмет за последнии сутки на торговой площаде Steam'>"+
            "<small class='priceTitle'>Средняя цена:</small>"+
            "<div class='clear'></div>"+
            "<b></b>"+
        "</div>"+
        "<div class='clear'></div>"+
        "<div class='subBlock' id='volume' title='Количество проданных предметов за последнии 24 часа на торговой площадке Steam'>"+
            "<small class='priceTitle'>Объем за 24 часа:</small>"+
            "<div class='clear'></div>"+
            "<b></b>"+
        "</div>"+
        "<div class='subBlock' id='difference' title='Разница между самой низкой на данный момент ценой, и средней ценой за сутки на торговой площадке Steam'>"+
            "<small class='priceTitle'>Текущая - средняя:</small>"+
            "<div class='clear'></div>"+
            "<b></b>"+
        "</div>"+
        "<div class='clear'></div>"+
        "<div class='subBlock' id='percentTMtoSTEAM' title='Процент прибыли/потери при покупке предмета а маркете и его продаже в Steam'>"+
            "<small class='priceTitle'>Маркет &#8658; Стим</small>"+
            "<b></b>"+
        "</div>"+
        "<div class='subBlock' id='percentSTEAMtoTM' title='Процент потери при покупке данного предмета в Steam и продаже его на маркете'>"+
            "<small class='priceTitle'>Стим  &#8658;  Маркет</small>"+
            "<b></b>"+
        "</div>"+
        "<div class='clear'></div>"+
        "<div class='steamLink'><a id='linkSteam' href='#' target='_blank'>Страница предмета в Steam</a></div>");

        $(".injectBlock").hide();
}


/**
 * Выполняется при загрузке страницы, работает с DOM текущей вкладки, вызывает обработчик handler(res,TMPrice,TMOrderPrice).
 * 
 */
$(document).ready(function () {
    $.get(chrome.extension.getURL('js/inject.js'),
        function (data) {
            //  Подключаем стили.
            var preloaderUrl = chrome.extension.getURL("css/inject.css");
            var link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute("type", "text/css");
            link.setAttribute("href", preloaderUrl);
            document.getElementsByTagName("head")[0].appendChild(link);
            //  js.
            var script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.innerHTML = data;
            document.getElementsByTagName("head")[0].appendChild(script);
            document.getElementsByTagName("body")[0].setAttribute("onLoad", "onPageLoad();");
        }
    );
});
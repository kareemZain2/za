$(function (){
    $("#navbarToggle").blur(function(event){
        var screenWidth=window.innerWidth;
        if(screenWidth<768){
            $("#collapsable-nav").collapse('hide');
        }
    });
});
(function (global){
    var dc = {};

    var homeHtml = "snippets/home-snippet.html";

    var allCategoriesHtml = "https://davids-restaurant.herokuapp.com/categories.json";

    var categoriesTitleHtml = "snippets/categories-title-sippet.html";

    var categoryHtml = "snippets/category-snippet.html";

    var insertHtml = function(selector,html){
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoading = function(selector){
        var html = "<div class='text-center'>";
        html += "<img src='images/ajax-loader.gif'></div>";
        insertHtml(selector,html);
    };

    var insertProperty = function(string,propName,propValue){
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace,"g"),propValue);
        return string;
    }

    document.addEventListener("DOMContentLoaded",function(event){
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(homeHtml,function(responseText){
            document.querySelector("#main-content").innerHTML = responseText;
        },false);

        dc.loadMenuCategories = function(){
            showLoading("#main-content");
            $ajaxUtils.sendGetRequest(allCategoriesHtml,buildAndShowCategoriesHtml);
        };
        function buildAndShowCategoriesHtml(categories){
            $ajaxUtils.sendGetRequest(categoriesTitleHtml,function(categoriesTitleHtml){
                $ajaxUtils.sendGetRequest(categoryHtml,function(categoryHtml){
                    var categoriesviewHtml = buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
                    insertHtml("#main-content",categoriesviewHtml);
                },false);
            },false);
        };
        
        function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml){
            var finalHtml = categoriesTitleHtml;
            finalHtml += "<section class='row'>";
            for(var i = 0;i < categories.length;i++){
                var html = categoryHtml;
                var name = "" + categories[i].name;
                var short_name = categories[i].short_name;
                html = insertProperty(html,"name",name);
                html = insertProperty(html,"short_name",short_name);
                finalHtml += html;
            }
            finalHtml += "</section>";
            return finalHtml;
        };
    });
    global.$dc = dc;
})(window);
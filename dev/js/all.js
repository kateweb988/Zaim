window.addEventListener("DOMContentLoaded", function () {
  [].forEach.call(document.querySelectorAll('.tel'), function (input) {
    var keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      var pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      var matrix = "+7 (___) ___ ____",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        new_value = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a
        });
      i = new_value.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i)
      }
      var reg = matrix.substr(0, this.value.length).replace(/_+/g,
        function (a) {
          return "\\d{1," + a.length + "}"
        }).replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
      if (event.type == "blur" && this.value.length < 5) this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

});
document.addEventListener("DOMContentLoaded", () => {
  (function ($) {
    var elActive = '';
    $.fn.selectCF = function (options) {

      // option
      var settings = $.extend({
        color: "#888888", // color
        backgroundColor: "#FFFFFF", // background
        change: function () { }, // event change
      }, options);

      return this.each(function () {

        var selectParent = $(this);
        list = [],
          html = '';

        //parameter CSS
        var width = $(selectParent).width();

        $(selectParent).hide();
        if ($(selectParent).children('option').length == 0) { return; }
        $(selectParent).children('option').each(function () {
          if ($(this).is(':selected')) { s = 1; title = $(this).text(); } else { s = 0; }
          list.push({
            value: $(this).attr('value'),
            text: $(this).text(),
            selected: s,
          })
        })

        // style
        var style = " background: " + settings.backgroundColor + "; color: " + settings.color + " ";

        html += "<ul class='selectCF'>";
        html += "<li>";
        html += "<span class='arrowCF ion-chevron-right' style='" + style + "'></span>";
        html += "<span class='titleCF' style='" + style + "; width:" + width + "px'>" + title + "</span>";
        html += "<span class='searchCF' style='" + style + "; width:" + width + "px'><input style='color:" + settings.color + "' /></span>";
        html += "<ul>";
        $.each(list, function (k, v) {
          s = (v.selected == 1) ? "selected" : "";
          html += "<li value=" + v.value + " class='" + s + "'>" + v.text + "</li>";
        })
        html += "</ul>";
        html += "</li>";
        html += "</ul>";
        $(selectParent).after(html);
        var customSelect = $(this).next('ul.selectCF'); // add Html
        var seachEl = $(this).next('ul.selectCF').children('li').children('.searchCF');
        var seachElOption = $(this).next('ul.selectCF').children('li').children('ul').children('li');
        var seachElInput = $(this).next('ul.selectCF').children('li').children('.searchCF').children('input');

        // handle active select
        $(customSelect).unbind('click').bind('click', function (e) {
          e.stopPropagation();
          if ($(this).hasClass('onCF')) {
            elActive = '';
            $(this).removeClass('onCF');
            $(this).removeClass('searchActive'); $(seachElInput).val('');
            $(seachElOption).show();
          } else {
            if (elActive != '') {
              $(elActive).removeClass('onCF');
              $(elActive).removeClass('searchActive'); $(seachElInput).val('');
              $(seachElOption).show();
            }
            elActive = $(this);
            $(this).addClass('onCF');
            $(seachEl).children('input').focus();
          }
        })

        // handle choose option
        var optionSelect = $(customSelect).children('li').children('ul').children('li');
        $(optionSelect).bind('click', function (e) {
          var value = $(this).attr('value');
          if ($(this).hasClass('selected')) {
            //
          } else {
            $(optionSelect).removeClass('selected');
            $(this).addClass('selected');
            $(customSelect).children('li').children('.titleCF').html($(this).html());
            $(selectParent).val(value);
            settings.change.call(selectParent); // call event change
          }
        })

        // handle search 
        $(seachEl).children('input').bind('keyup', function (e) {
          var value = $(this).val();
          if (value) {
            $(customSelect).addClass('searchActive');
            $(seachElOption).each(function () {
              if ($(this).text().search(new RegExp(value, "i")) < 0) {
                // not item
                $(this).fadeOut();
              } else {
                // have item
                $(this).fadeIn();
              }
            })
          } else {
            $(customSelect).removeClass('searchActive');
            $(seachElOption).fadeIn();
          }
        })

      });
    };
    $(document).click(function () {
      if (elActive != '') {
        $(elActive).removeClass('onCF');
        $(elActive).removeClass('searchActive');
      }
    })
  }(jQuery));

  $(function () {
    var event_change = $('#event-change');
    $(".select").selectCF({
      change: function () {
        var value = $(this).val();
        var text = $(this).children('option:selected').html();
        console.log(value + ' : ' + text);
        event_change.html(value + ' : ' + text);
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  var accordeonButtons = document.getElementsByClassName("accordeon__button");

  //пишем событие при клике на кнопки - вызов функции toggle
  for (var i = 0; i < accordeonButtons.length; i++) {
    var accordeonButton = accordeonButtons[i];

    accordeonButton.addEventListener("click", toggleItems, false);
  }

  //пишем функцию
  function toggleItems() {

    // переменная кнопки(актульная) с классом
    var itemClass = this.className;

    // добавляем всем кнопкам класс close
    for (var i = 0; i < accordeonButtons.length; i++) {
      accordeonButtons[i].className = "accordeon__button closed";
    }

    // закрываем все открытые панели с текстом
    var pannels = document.getElementsByClassName("accordeon__panel");
    for (var z = 0; z < pannels.length; z++) {
      pannels[z].style.maxHeight = 0;
    }

    // проверка. если кнопка имеет класс close при нажатии
    // к актуальной(нажатой) кнопке добававляем активный класс
    // а панели - которая находится рядом задаем высоту
    if (itemClass == "accordeon__button closed") {
      this.className = "accordeon__button active";
      var panel = this.nextElementSibling;
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

  }
});
document.addEventListener('DOMContentLoaded', function () {
  $('.articmodal-close').click(function (e) {
    $.arcticmodal('close');

  });
  $('.a1').click(function (e) {
    e.preventDefault();
    $('#popup-call').arcticmodal({
    });
  });
  $('.a2').click(function (e) {
    e.preventDefault();
    $('#popup-call2').arcticmodal({
    });
  });
  $('.a3, .nav__city').click(function (e) {
    e.preventDefault();
    $('#popup-call3').arcticmodal({
    });
  });
  $('.calc__order').click(function (e) {
    e.preventDefault();
    $('#popup-call4').arcticmodal({
    });
  });
});
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth <= 1199) {
    let menuItems = document.querySelectorAll(".menu a");

    menuItems.forEach(item => {
      item.addEventListener("click", function (event) {
        let submenu = this.nextElementSibling;

        if (submenu && (submenu.tagName === "UL" || submenu.classList.contains("menu__wrap"))) {
          event.preventDefault();

          if (!submenu.classList.contains("submenu-active")) {
            submenu.classList.add("submenu-active");
            this.classList.add("active");

            let parentMenu = this.closest("ul") || this.closest(".menu__wrap");
            parentMenu.classList.add("submenu-active");
            parentMenu.querySelectorAll(":scope > li > a").forEach(link => {
              if (link !== this) {
                link.classList.add("hidden");
              }
            });

            submenu.querySelectorAll(".back").forEach(btn => btn.remove());
            let backButton = document.createElement("div");
            backButton.classList.add("back");
            backButton.textContent = "Назад";
            submenu.prepend(backButton);

            backButton.addEventListener("click", function (event) {
              event.stopPropagation();
              submenu.classList.remove("submenu-active");
              submenu.querySelectorAll(".submenu-active").forEach(sub => sub.classList.remove("submenu-active"));
              submenu.querySelectorAll(".active").forEach(activeItem => activeItem.classList.remove("active"));
              item.classList.remove("active");

              if (parentMenu.classList.contains("menu__wrap")) {
                parentMenu.classList.remove("submenu-active");
              }
              parentMenu.querySelectorAll(":scope > li > a").forEach(link => {
                link.classList.remove("hidden");
              });
              backButton.remove();
            });
          }
        }
      });
    });
  }

  document.querySelectorAll(".menu ul ul, .menu__wrap").forEach(submenu => {
    submenu.classList.add("nested-menu");
  });
});
$(document).ready(function () {
  // Наведение на меню первого уровня
  $('.menuu li').on('mouseenter', function () {
    const myvar = this.id;

    // Скрыть все вторые уровни
    $('.mydiv').removeClass('flex').addClass('hidden');

    // Сброс активных всегда
    $('.menuu li').removeClass('active');

    if (myvar) {
      // Показать нужный второй уровень
      $('#div' + myvar).removeClass('hidden').addClass('flex');

      // Активировать пункт первого уровня
      $(this).addClass('active');

      // Добавляем shadow и скрываем nav__bottom
      if (!$('.more__block:hover').length && !$(this).is(':last-child')) {
        $('.nav').addClass('shadow');
        $('.nav__bottom').addClass('hidden');
      }
    } else {
      // Если li без id → убрать shadow и показать nav__bottom
      $('.nav').removeClass('shadow');
      $('.nav__bottom').removeClass('hidden');
    }
  });

  // Наведение на пункты второго уровня
  $('.mydiv li[class^="content"]').on('mouseenter', function () {
    const current = $(this);
    const contentClass = this.className.match(/content\d+/)[0];
    const currentWrap = $('#' + contentClass);
    const currentThird = $('#content' + contentClass.substring(7));

    // Убираем active и скрываем чужие блоки
    $('.mydiv li[class^="content"]').each(function () {
      if (this !== current[0]) {
        $(this).removeClass('active');
        const otherClass = this.className.match(/content\d+/)[0];
        $('#' + otherClass).removeClass('flex').addClass('hidden');
        $('#content' + otherClass.substring(7)).removeClass('flex').addClass('hidden');
      }
    });

    // Активируем текущий
    current.addClass('active');
    currentWrap.removeClass('hidden').addClass('flex');
    currentThird.removeClass('hidden').addClass('flex');
  });

  // Сброс активных при уходе мыши с блока nav__center
  $('.nav__center').on('mouseleave', function () {
    $('.menuu li').removeClass('active');
    $('.mydiv').removeClass('flex').addClass('hidden');
    $('.menu__wrap').removeClass('flex').addClass('hidden');
    $('.nav').removeClass('shadow');
    $('.nav__bottom').removeClass('hidden');
    $('.mydiv li').removeClass('active');
  });

  // Поддержка состояния shadow при уходе мыши с первого уровня
  $('.menuu').on('mouseleave', function () {
    if ($('.menuu li.active[id]').length === 0 && !$('.more__block:hover').length) {
      $('.nav').removeClass('shadow');
      $('.nav__bottom').removeClass('hidden');
    }
  });

  // Убираем shadow при уходе с li с id (если других активных с id нет)
  $('.menuu li[id]').on('mouseleave', function () {
    if ($('.menuu li.active[id]').length === 0 && $(window).scrollTop() === 0) {
      $('.nav').removeClass('shadow');
      $('.nav__bottom').removeClass('hidden');
    }
  });

  // Исключаем появление shadow при наведении на .more__block
  $('.more__block').on('mouseenter', function () {
    $('.nav').removeClass('shadow');
    $('.nav__bottom').removeClass('hidden');
  });

  // Восстановление shadow, если мышь покидает .more__block и есть активные пункты с id
  $('.more__block').on('mouseleave', function () {
    if ($('.menuu li.active[id]').length > 0 || $(window).scrollTop() > 0) {
      $('.nav').addClass('shadow');
      $('.nav__bottom').addClass('hidden');
    }
  });

  // --- Добавляем shadow при скролле ---
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 0) {
      $('.nav').addClass('scroll');
    } else {
      // Убираем только если нет активных li[id]
      if ($('.menuu li.active[id]').length === 0) {
        $('.nav').removeClass('scroll');
      }
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const textWrap = document.getElementById('textWrap');
  const textLink = document.getElementById('textLink');

  textLink.addEventListener('click', function (e) {
    e.preventDefault();
    textWrap.classList.add('expanded'); // раскрываем контент
    textLink.style.display = 'none';     // скрываем кнопку
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $(".youtube-link").grtyoutube({
      autoPlay: true
    });
  });

  (function ($) {

    $.fn.grtyoutube = function (options) {

      return this.each(function () {

        // Get video ID
        var getvideoid = $(this).attr("youtubeid");

        // Default options
        var settings = $.extend({
          videoID: getvideoid,
          autoPlay: true
        }, options);

        // Convert some values
        if (settings.autoPlay === true) { settings.autoPlay = 1 } else { settings.autoPlay = 0 }

        // Initialize on click
        if (getvideoid) {
          $(this).on("click", function () {
            $("body").append('<div class="grtvideo-popup">' +
              '<div class="grtvideo-popup-content">' +
              '<span class="grtvideo-popup-close">&times;</span>' +
              '<iframe class="grtyoutube-iframe" src="https://www.youtube.com/embed/' + settings.videoID + '?rel=0&wmode=transparent&autoplay=' + settings.autoPlay + '&iv_load_policy=3" allowfullscreen frameborder="0"></iframe>' +
              '</div>' +
              '</div>');
          });
        }

        // Close the box on click or escape
        $(this).on('click', function (event) {
          event.preventDefault();
          $(".grtvideo-popup-close, .grtvideo-popup").click(function () {
            $(".grtvideo-popup").remove();
          });
        });

        $(document).keyup(function (event) {
          if (event.keyCode == 27) {
            $(".grtvideo-popup").remove();
          }
        });
      });
    };
  }(jQuery));
});
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn5 = document.querySelector('.menu-btn5');
  const menu5 = document.querySelector('.menu5');
  const menuClose = document.querySelector('.menu5__close');
  const subMenuTitles = menu5.querySelectorAll('.menu5__item > p');

  // Функция обновления класса на body
  function updateBodyBackground() {
    if (menu5.classList.contains('active')) {
      document.body.classList.add('menu-active');
    } else {
      document.body.classList.remove('menu-active');
    }
  }

  // Клик по кнопке открытия меню
  menuBtn5.addEventListener('click', () => {
    menuBtn5.classList.toggle('active');
    menu5.classList.toggle('active');
    updateBodyBackground();
  });

  // Клик по кнопке закрытия меню
  menuClose.addEventListener('click', (e) => {
    e.stopPropagation(); // чтобы клик не всплывал
    menu5.classList.remove('active');
    menuBtn5.classList.remove('active');
    updateBodyBackground();
  });

  // Клик по фону меню (если кликнули именно по menu5)
  menu5.addEventListener('click', (e) => {
    if (e.target === menu5) {
      menu5.classList.remove('active');
      menuBtn5.classList.remove('active');
      updateBodyBackground();
    }
  });

  // Клик по заголовкам подменю (<p>) для открытия/закрытия списка
  subMenuTitles.forEach(title => {
    title.addEventListener('click', (e) => {
      const parentItem = title.parentElement;
      const subList = title.nextElementSibling;

      if (subList && subList.tagName.toLowerCase() === 'ul') {
        subList.classList.toggle('active'); // открываем/закрываем подменю
        parentItem.classList.toggle('active'); // добавляем класс активного элемента
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const menuItems = document.querySelectorAll(".menu5__item > p");

  menuItems.forEach(p => {
    p.addEventListener("click", () => {
      const sublist = p.nextElementSibling; // следующий элемент после <p> (наш <ul>)

      if (sublist) {
        sublist.style.display = sublist.style.display === "block" ? "none" : "block";
        p.classList.toggle("active");
      }
    });
  });
});

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".back").forEach(function (elem) {
    elem.addEventListener("click", function () {
      document.querySelector(".menu5__scroll").style.overflowY = "auto";
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  $(document).ready(function () {
    $('[data-submit]').on('click', function (e) {
      e.preventDefault();
      $(this).parents('form').submit();
    })
    $.validator.addMethod(
      "regex",
      function (value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
      },
      "Please check your input."
    );
    function valEl(el) {

      el.validate({
        rules: {
          tel: {
            required: true,
            regex: '^([\+]+)*[0-9\x20\x28\x29\-]{5,20}$'
          },
          name: {
            required: true
          },
          email: {
            required: true,
            email: true
          }
        },
        messages: {
          tel: {
            required: 'Заполните поле',
            regex: 'Телефон может содержать символы + - ()'
          },
          name: {
            required: 'Заполните поле',
          },
          text: {
            required: 'Заполните поле',
          },
          email: {
            required: 'Заполните поле',
            email: 'Неверный формат E-mail'
          }
        },
        submitHandler: function (form) {
          $('#loader').fadeIn();
          var $form = $(form);
          var $formId = $(form).attr('id');
          switch ($formId) {
            case 'popupResult':
              $.ajax({
                type: 'POST',
                url: $form.attr('action'),
                data: $form.serialize(),
              })
                .always(function (response) {
                  setTimeout(function () {
                    $('#loader').fadeOut();
                  }, 800);
                  setTimeout(function () {
                    $.arcticmodal('close');
                    $('#popup-thank').arcticmodal({});
                    $form.trigger('reset');
                    //строки для остлеживания целей в Я.Метрике и Google Analytics
                  }, 1100);

                });
              break;
          }
          return false;
        }
      })
    }

    $('.js-form').each(function () {
      valEl($(this));
    });
    $('[data-scroll]').on('click', function () {
      $('html, body').animate({
        scrollTop: $($.attr(this, 'data-scroll')).offset().top
      }, 2000);
      event.preventDefault();
    })
  });
});
document.addEventListener('DOMContentLoaded', function () {
  const swiper1 = new Swiper('.swiper1', {
    slidesPerView: 3,
    spaceBetween: 8,
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 8,
        slidesPerView: 3
      }
    }
  });
  const swiper2 = new Swiper('.swiper2', {
    slidesPerView: 4,
    spaceBetween: 8,
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 20,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 8,
        slidesPerView: 4
      }
    }
  });
  const swiper3 = new Swiper('.swiper3', {
    slidesPerView: 2,
    spaceBetween: 10,
    navigation: {
      nextEl: '.swiper-button-next3',
      prevEl: '.swiper-button-prev3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 10,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      992: {
        spaceBetween: 10,
        slidesPerView: 2
      },
      1200: {
        spaceBetween: 10,
        slidesPerView: 2
      }
    }
  });
  const swiper4 = new Swiper('.swiper_item1', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item1',
      prevEl: '.swiper-button-prev_item1',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper5 = new Swiper('.swiper_item2', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item2',
      prevEl: '.swiper-button-prev_item2',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper6 = new Swiper('.swiper_item3', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item3',
      prevEl: '.swiper-button-prev_item3',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper7 = new Swiper('.swiper_item4', {
    slidesPerView: 1,
    spaceBetween: 5,
    navigation: {
      nextEl: '.swiper-button-next_item4',
      prevEl: '.swiper-button-prev_item4',
    },
    breakpoints: {
      // when window width is >= 320px
      320: {
        spaceBetween: 5,
        loop: true,
        slidesPerView: 1
      },
      767: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      992: {
        spaceBetween: 5,
        slidesPerView: 1
      },
      1200: {
        spaceBetween: 5,
        slidesPerView: 1
      }
    }
  });
  const swiper = new Swiper(".swiper_rev", {
    loop: true,
    autoplay: {
      delay: 6000,
      disableOnInteraction: false,
    },
    speed: 600,
    pagination: {
      el: ".swiper-pagination_rev",
      clickable: true,
      bulletClass: "swiper-pagination-bullet-custom",
      bulletActiveClass: "swiper-pagination-bullet-custom--active",
      renderBullet: function (index, className) {
        return `
                   <span class="${className}">
                       ${index + 1}
                       <span class="bullet-progress">
                           <svg viewBox="0 0 50 50">
                               <rect x="2" y="2" width="44" height="44" rx="8" ry="8"/>
                           </svg>
                       </span>
                   </span>`;
      },
      clickable: true
    },
    on: {
      init: function () {
        setTimeout(() => {
          const firstBullet = document.querySelector(".swiper-pagination-bullet-custom--active .bullet-progress rect");
          if (firstBullet) {
            firstBullet.style.transition = "stroke-dashoffset 6s linear";
            firstBullet.style.strokeDashoffset = "0";
          }
        }, 50);
      },
      slideChangeTransitionStart: function () {
        document.querySelectorAll(".bullet-progress rect").forEach(rect => {
          rect.style.transition = "none";
          rect.style.strokeDashoffset = "184";
        });

        setTimeout(() => {
          const activeBullet = document.querySelector(".swiper-pagination-bullet-custom--active .bullet-progress rect");
          if (activeBullet) {
            activeBullet.style.transition = "stroke-dashoffset 6s linear";
            activeBullet.style.strokeDashoffset = "0";
          }
        }, 50);
      }
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll('.new__block');

  sliders.forEach(block => {
    const sliderContainer = block.querySelector('.slider-container');
    const sliderTrack = block.querySelector('.slider-track');
    const sliderThumb = block.querySelector('.slider-thumb');
    const sliderFill = block.querySelector('.slider-fill');
    const sliderValue = block.querySelector('.slider-value');
    const maxValue = parseInt(sliderValue.dataset.max) || 100; // можно задать через data-max

    let isDragging = false;

    function updateSlider(clientX) {
      const rect = sliderTrack.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let percent = Math.max(0, Math.min(offsetX / rect.width, 1));
      let value = Math.round(percent * maxValue);

      sliderThumb.style.left = `${percent * 100}%`;
      sliderFill.style.width = `${percent * 100}%`;

      // сохраняем span
      const span = sliderValue.querySelector('span');
      sliderValue.textContent = value + ' ';
      if (span) sliderValue.appendChild(span);
    }

    sliderThumb.addEventListener('mousedown', (e) => {
      isDragging = true;
      updateSlider(e.clientX);
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) updateSlider(e.clientX);
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // svg
  $(function () {
    jQuery('img.svg').each(function () {
      var $img = jQuery(this);
      var imgID = $img.attr('id');
      var imgClass = $img.attr('class');
      var imgURL = $img.attr('src');

      jQuery.get(imgURL, function (data) {
        // Get the SVG tag, ignore the rest
        var $svg = jQuery(data).find('svg');

        // Add replaced image's ID to the new SVG
        if (typeof imgID !== 'undefined') {
          $svg = $svg.attr('id', imgID);
        }
        // Add replaced image's classes to the new SVG
        if (typeof imgClass !== 'undefined') {
          $svg = $svg.attr('class', imgClass + ' replaced-svg');
        }

        // Remove any invalid XML tags as per http://validator.w3.org
        $svg = $svg.removeAttr('xmlns:a');

        // Check if the viewport is set, else we gonna set it if we can.
        if (!$svg.attr('viewBox') && $svg.attr('height') && $svg.attr('width')) {
          $svg.attr('viewBox', '0 0 ' + $svg.attr('height') + ' ' + $svg.attr('width'))
        }

        // Replace image with new SVG
        $img.replaceWith($svg);

      }, 'xml');

    });
  });
});

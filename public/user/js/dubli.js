(function ($) {
  "use strict";
  /*==================================================================
    [ Show / hide modal search ]*/
  $(".js-show-modal-search").on("click", function () {
    $(".modal-search-header").addClass("show-modal-search");
    $(this).css("opacity", "0");
  });

  $(".js-hide-modal-search").on("click", function () {
    $(".modal-search-header").removeClass("show-modal-search");
    $(".js-show-modal-search").css("opacity", "1");
  });

  $(".container-search-header").on("click", function (e) {
    e.stopPropagation();
  });

  /*==================================================================
        [ Isotope ]*/
  var $topeContainer = $(".isotope-grid");
  var $filter = $(".filter-tope-group");

  // filter items on button click
  $filter.each(function () {
    $filter.on("click", "button", function () {
      var filterValue = $(this).attr("data-filter");
      $topeContainer.isotope({ filter: filterValue });
    });
  });

  // init Isotope
  $(window).on("load", function () {
    var $grid = $topeContainer.each(function () {
      $(this).isotope({
        itemSelector: ".isotope-item",
        layoutMode: "fitRows",
        percentPosition: true,
        animationEngine: "best-available",
        masonry: {
          columnWidth: ".isotope-item",
        },
      });
    });
  });

  var isotopeButton = $(".filter-tope-group button");

  $(isotopeButton).each(function () {
    $(this).on("click", function () {
      for (var i = 0; i < isotopeButton.length; i++) {
        $(isotopeButton[i]).removeClass("how-active1");
      }

      $(this).addClass("how-active1");
    });
  });

  /*==================================================================
        [ Filter / Search product ]*/
  $(".js-show-filter").on("click", function () {
    $(this).toggleClass("show-filter");
    $(".panel-filter").slideToggle(400);

    if ($(".js-show-search").hasClass("show-search")) {
      $(".js-show-search").removeClass("show-search");
      $(".panel-search").slideUp(400);
    }
  });

  $(".js-show-search").on("click", function () {
    $(this).toggleClass("show-search");
    $(".panel-search").slideToggle(400);

    if ($(".js-show-filter").hasClass("show-filter")) {
      $(".js-show-filter").removeClass("show-filter");
      $(".panel-filter").slideUp(400);
    }
  });

  /*==================================================================
        [ Cart ]*/
  $(".js-show-cart").on("click", function () {
    $(".js-panel-cart").addClass("show-header-cart");
  });

  $(".js-hide-cart").on("click", function () {
    $(".js-panel-cart").removeClass("show-header-cart");
  });

  /*==================================================================
        [ Cart ]*/
  $(".js-show-sidebar").on("click", function () {
    $(".js-sidebar").addClass("show-sidebar");
  });

  $(".js-hide-sidebar").on("click", function () {
    $(".js-sidebar").removeClass("show-sidebar");
  });

  /*==================================================================
        [ +/- num product ]*/
  $(".btn-num-product-down").on("click", function () {
    var numProduct = Number($(this).next().val());
    if (numProduct > 1) $(this).next().val(numProduct);
  });

  $(".btn-num-product-up").on("click", function () {
    var numProduct = Number($(this).prev().val());
    $(this).prev().val(numProduct);
  });

  /*==================================================================
        [ Rating ]*/
  $(".wrap-rating").each(function () {
    var item = $(this).find(".item-rating");
    var rated = -1;
    var input = $(this).find("input");
    $(input).val(0);

    $(item).on("mouseenter", function () {
      var index = item.index(this);
      var i = 0;
      for (i = 0; i <= index; i++) {
        $(item[i]).removeClass("zmdi-star-outline");
        $(item[i]).addClass("zmdi-star");
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass("zmdi-star-outline");
        $(item[j]).removeClass("zmdi-star");
      }
    });

    $(item).on("click", function () {
      var index = item.index(this);
      rated = index;
      $(input).val(index + 1);
    });

    $(this).on("mouseleave", function () {
      var i = 0;
      for (i = 0; i <= rated; i++) {
        $(item[i]).removeClass("zmdi-star-outline");
        $(item[i]).addClass("zmdi-star");
      }

      for (var j = i; j < item.length; j++) {
        $(item[j]).addClass("zmdi-star-outline");
        $(item[j]).removeClass("zmdi-star");
      }
    });
  });

  /*==================================================================
        [ Show modal1 ]*/
  $(".js-show-modal1").on("click", function (e) {
    e.preventDefault();

    var productData = $(this).data("product-data");
    let value =
      parseInt(productData.orginalPrice) - parseInt(productData.ourPrice);
    let discount = (value / parseInt(productData.orginalPrice)) * 100;
    discount = discount.toFixed(0);
    $(".js-modal1 .js-name-detail").text(productData.name);
    $(".js-modal1 .productOurPrice").text(productData.ourPrice);
    $(".js-modal1 .productOrginalPrice").text(productData.orginalPrice);
    $(".js-modal1 .productDescription").text(productData.description);
    $(".js-modal1 .discoutPercentage").text(discount);
    var imagesHtml =
      '<div class="wrap-slick3 flex-sb flex-w"><div class="wrap-slick3-dots"></div><div class="wrap-slick3-arrows flex-sb-m flex-w"></div><div class="slick3 gallery-lb productImages">';
    for (var i = 0; i < productData.images.length; i++) {
      imagesHtml +=
        '<div class="item-slick3" data-thumb="/images/productImages/' +
        productData.images[i] +
        '" >';
      imagesHtml += '<div class="wrap-pic-w pos-relative">';
      imagesHtml +=
        '<img src="/images/productImages/' +
        productData.images[i] +
        '" alt="IMG-PRODUCT" id="pImage"/>';
      imagesHtml +=
        '<a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="/images/productImages/' +
        productData.images[i] +
        '" class="MagicZoom" data-options="zoomPosition: inner">';
      imagesHtml += '<i class="fa fa-expand"></i></a></div></div>';
    }
    imagesHtml += " </div></div>";
    // Set the HTML content of the .productImages element to the generated HTML code
    $(".js-modal1 .productImages").html(imagesHtml);
    $(".js-modal1 .productId").text(productData._id);
    $(".js-modal1").addClass("show-modal1").data("product", productData);
    $(".wrap-slick3").each(function () {
      $(this)
        .find(".slick3")
        .slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 6000,
          arrows: true,
          appendArrows: $(this).find(".wrap-slick3-arrows"),
          prevArrow:
            '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
          nextArrow:
            '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
          dots: true,
          appendDots: $(this).find(".wrap-slick3-dots"),
          dotsClass: "slick3-dots",
          customPaging: function (slick, index) {
            var portrait = $(slick.$slides[index]).data("thumb");
            return (
              '<img src=" ' +
              portrait +
              ' "/><div class="slick3-dot-overlay"></div>'
            );
          },
        });
    });
  });

  $(".js-hide-modal1").on("click", function () {
    $(".js-modal1").removeClass("show-modal1");
  });
  /*==================================================================
        [ Show modal1 ]*/
  $(".js-show-modal3").on("click", function (e) {
    e.preventDefault();
    let productData = "gvmjbj";
    $(".js-modal3").addClass("show-modal3").data("product", productData);
    $(".wrap-slick3").each(function () {
      $(this)
        .find(".slick3")
        .slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 6000,
          arrows: true,
          appendArrows: $(this).find(".wrap-slick3-arrows"),
          prevArrow:
            '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
          nextArrow:
            '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
          dots: true,
          appendDots: $(this).find(".wrap-slick3-dots"),
          dotsClass: "slick3-dots",
          customPaging: function (slick, index) {
            var portrait = $(slick.$slides[index]).data("thumb");
            return (
              '<img src=" ' +
              portrait +
              ' "/><div class="slick3-dot-overlay"></div>'
            );
          },
        });
    });
  });

  $(".js-hide-modal3").on("click", function () {
    $(".js-modal3").removeClass("show-modal3");
  });
  /*==================================================================
        [ Show modal4 checkout ]*/
  $(".js-show-modal4").on("click", function (e) {
    e.preventDefault();
    let productData = "gvmjbj";
    $(".js-modal4").addClass("show-modal4").data("product", productData);
    $(".wrap-slick3").each(function () {
      $(this)
        .find(".slick3")
        .slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 6000,
          arrows: true,
          appendArrows: $(this).find(".wrap-slick3-arrows"),
          prevArrow:
            '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
          nextArrow:
            '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
          dots: true,
          appendDots: $(this).find(".wrap-slick3-dots"),
          dotsClass: "slick3-dots",
          customPaging: function (slick, index) {
            var portrait = $(slick.$slides[index]).data("thumb");
            return (
              '<img src=" ' +
              portrait +
              ' "/><div class="slick3-dot-overlay"></div>'
            );
          },
        });
    });
  });

  $(".js-hide-modal4").on("click", function () {
    $(".js-modal4").removeClass("show-modal4");
  }); /*==================================================================
      [ Show modal5 ]*/
  $(".js-show-modal5").on("click", function (e) {
    e.preventDefault();
    let productData = $(this).data("product-data");
    $(".js-modal5").addClass("show-modal5").data("product", productData);
    $(".wrap-slick3").each(function () {
      $(this)
        .find(".slick3")
        .slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
          infinite: true,
          autoplay: false,
          autoplaySpeed: 6000,
          arrows: true,
          appendArrows: $(this).find(".wrap-slick3-arrows"),
          prevArrow:
            '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
          nextArrow:
            '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
          dots: true,
          appendDots: $(this).find(".wrap-slick3-dots"),
          dotsClass: "slick3-dots",
          customPaging: function (slick, index) {
            var portrait = $(slick.$slides[index]).data("thumb");
            return (
              '<img src=" ' +
              portrait +
              ' "/><div class="slick3-dot-overlay"></div>'
            );
          },
        });
    });
  });

  $(".js-hide-modal5").on("click", function () {
    $(".js-modal5").removeClass("show-modal5");
  });
})(jQuery);

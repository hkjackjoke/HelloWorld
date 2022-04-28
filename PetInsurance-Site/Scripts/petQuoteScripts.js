var discountItemsSlider;

(function () {
    window.addEventListener('scroll', PcOnScroll);

    PcOnScroll();

    var frameName = new ds07o6pcmkorn({
        openElementId: "#wr",
        modalID: "modal",
    });
    frameName.init();

    function PcOnScroll() {
        var planBoxes = document.querySelector('.plan-boxes-top');
        var main = document.querySelector('.plan-options-wrap');
        var resize990 = document.querySelector('#resize-990');
        if (planBoxes === null) {
            return;
        }

        var elementPosition = main.getBoundingClientRect().top + (resize990.getBoundingClientRect().width === 0 ? 0 : 130);
        var policyStartPayment = document.querySelector('.policy-start-payment');
        var footerElementPosition = getPosition(policyStartPayment).y;

        var topPlusFloating = (window.pageYOffset || document.scrollTop) - (document.clientTop || 0) + 100;
        var height = planBoxes.clientHeight;
        var planBoxesPlusHeight = height + topPlusFloating + 70;

        if (elementPosition <= 0 && !planBoxes.classList.contains(".fixed")) {
            if (planBoxesPlusHeight >= footerElementPosition && policyStartPayment !== null) {

                hasClass('.plan-boxes-top','absolute') ? null : addClass('.plan-boxes-top','absolute fixed');
                main.classList.add("fixed");
            } else {

                hasClass('.plan-boxes-top','absolute') ? removeClass('.plan-boxes-top','absolute') : null;
                hasClass('.plan-boxes-top', 'fixed') ? null : addClass('.plan-boxes-top', 'fixed');
                main.classList.add("fixed");
            }
        } else {

            hasClass('.plan-boxes-top','fixed') ? removeClass('.plan-boxes-top','fixed') : null;
            hasClass('.plan-boxes-top','absolute') ? removeClass('.plan-boxes-top','absolute') : null;
            main.classList.remove("fixed");
        }
    }
    function hasClass(t, c) {
        return document.querySelector(t).classList.contains(c);
    }
    function removeClass(t, c) {
        const items = document.querySelectorAll(t);
        items.forEach(function (elem) {
            elem.classList.remove(c);
        });
    }
    function addClass(t, c) {
        document.querySelector(t).classList.add(c);
    }
    function getPosition(element) {
        xPosition = 0;
        yPosition = 0;
        while (element) {

            xPosition += (element.offsetLeft - element.clientLeft);
            yPosition += (element.offsetTop - element.clientTop);

            element = element.offsetParent;
        }

        return { x: xPosition, y: yPosition };
    }
})();

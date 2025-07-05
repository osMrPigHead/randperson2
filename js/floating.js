let dragging = false;
let initialMouseX = 0;
let initialMouseY = 0;
let initialWindowX = 0;
let initialWindowY = 0;
let initialWindowWidth = 0;
let initialWindowHeight = 0;
let mouseDownTime = 0;

$(() => {
    $("body").animate({ opacity: 1 }, 200);

    $(document).on("touchstart", (event) => {
        initialMouseX = event.touches[0].screenX;
        initialMouseY = event.touches[0].screenY;
        randperson2.window.getBounds().then(({x, y, width, height}) => {
            initialWindowX = x;
            initialWindowY = y;
            initialWindowWidth = width;
            initialWindowHeight = height;
        });
    });
    $(document).on("touchmove", (event) => {
        randperson2.window.setBounds({
            x: initialWindowX + event.touches[0].screenX - initialMouseX,
            y: initialWindowY + event.touches[0].screenY - initialMouseY,
            width: initialWindowWidth,
            height: initialWindowHeight
        });
    });

    $(document).mousedown((event) => {
        dragging = false;
        initialMouseX = event.screenX;
        initialMouseY = event.screenY;
        mouseDownTime = Date.now();
        randperson2.window.getBounds().then(({x, y, width, height}) => {
            initialWindowX = x;
            initialWindowY = y;
            initialWindowWidth = width;
            initialWindowHeight = height;

            $(document).mousemove((event) => {
                const deltaX = event.screenX - initialMouseX;
                const deltaY = event.screenY - initialMouseY;

                if (!dragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) dragging = true;
                if (dragging) {
                    const newX = initialWindowX + deltaX;
                    const newY = initialWindowY + deltaY;
                    randperson2.window.setBounds({
                        x: newX,
                        y: newY,
                        width: initialWindowWidth,
                        height: initialWindowHeight
                    });
                }
            });
            $(document).mouseup(() => {
                $(document).off("mousemove");
                $(document).off("mouseup");
                if (!dragging && Date.now() - mouseDownTime < 200) {
                    $("body").animate({opacity: 0}, 200, randperson2.show);
                }
            });
        });
    });
});
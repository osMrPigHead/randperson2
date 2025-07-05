const COLORS = [
    "#FFA000",
    "#388E3C",
    "#2196F3",
    "#795548"
];
let colorI = 0;

let number = 1;
let intervalId;
function numberSelect(n) {
    number = n;
    for (let i = 2; i <= n; i++) $(`#number-${i}`)
        .removeClass("btn-outline-success")
        .addClass("btn-success");
    for (let i = n + 1; i <= 6; i++) $(`#number-${i}`)
        .removeClass("btn-success")
        .addClass("btn-outline-success");
}
function generateRandpersonHandler(result) {
    let i = -1;
    function handler() {
        if ((++i) === result.length) i = 0;
        $("#name").text(result[i].name);
        if (result[i].ssr) {
            $("#ssr").removeClass("d-none");
            $("#r").addClass("d-none");
        } else {
            $("#ssr").addClass("d-none");
            $("#r").removeClass("d-none").text(result[i].id);
        }
    }
    handler();
    return handler;
}

$(() => {
    $("body").animate({ opacity: 1 }, 200);

    $("#hide").click(() => {
        $("body").animate({ opacity: 0 }, 200, randperson2.hide);
    });
    $("#exit").click(() => {
        $("body").animate({ opacity: 0 }, 200, randperson2.exit);
    });

    randperson2.getConfig().then((config) => {
        $("#ssr-count").text(config.ssr.max - config.ssr.count);
        if (config.list.length < 5) {
            for (let i = config.list.length + 1; i <= 5; i++)
                $(`#number-${i}`).addClass("disabled");
        }
    });
    $("#start-button").click(() => {
        randperson2.randperson(number).then((result) => {
            if (result === "err") {
                $("#name")
                    .css("color", "#D32F2F")
                    .text("错误");
                $("#ssr").addClass("d-none");
                $("#r").addClass("d-none");
                $("#err").removeClass("d-none");
                return;
            }
            $("#err").addClass("d-none");
            if (colorI === COLORS.length) colorI = 0;
            clearInterval(intervalId);
            intervalId = setInterval(generateRandpersonHandler(result.list), 1000);
            $("#name").css("color", COLORS[colorI++]);
            $("#ssr-count").text(result.ssrCount);
        });
    });

    for (let i = 1; i <= 6; i++) $(`#number-${i}`).click(() => numberSelect(i));

    $("#edit-button").click(() => {
        randperson2.getConfig().then((config) => {
            $("#edit-list").text(JSON.stringify(config.list));
        });
    });
    $("#clear-excluded").click(() => randperson2.clearExcluded());
    $("#edit-save").click(() => {
        randperson2.getConfig().then((config) => {
            config.list = JSON.parse($("#edit-list").val());
            config.saveExcluded = $("#save-excluded").prop("checked");
            randperson2.setConfig(config);
        });
    });

    $("#ssr-button").click(() => {
        randperson2.getConfig().then((config) => {
            $("#probability").val(config.ssr.probability * 100);
            $("#ssr-max").val(config.ssr.max);
            $("#ssr-lift").val(config.ssr.lift);
            $("#ssr-list").text(JSON.stringify(config.ssr.list));
        });
    });
    $("#clear-ssr").click(() => {
        randperson2.getConfig().then((config) => {
            config.ssr.count = 0;
            $("#ssr-count").text(config.ssr.max);
            randperson2.setConfig(config);
        })
    });
    $("#ssr-save").click(() => {
        randperson2.getConfig().then((config) => {
            config.ssr.probability = parseFloat($("#probability").val()) / 100;
            config.ssr.max = parseInt($("#ssr-max").val());
            config.ssr.lift = parseInt($("#ssr-lift").val());
            config.ssr.list = JSON.parse($("#ssr-list").val());
            randperson2.setConfig(config);
        });
    });
});
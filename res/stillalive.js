
const CREDIT_DATA = [		// refer to dev_data/credits.txt
    ">LIST PERSONNEL",
	"",
	"",
	"Всем спасибо",
	"Удачи всем",
	"У вас все получится",
	"Не грустите",
	"Не уважайте",
	"А просто помните",
	"",
	""
];
const CREDIT_CHARACTER_VELOCITY_MS = 68.623562; // 68.623562ms according to Portal's game data..?
let creditCurrentPosition = 0;

const TERMINAL_CURSOR_BLINK_INTERVAL = 300;
let terminalCursorElem = $("<span id='terminal_cursor'>_</span>");
let terminalCreditCursorElem = $("<span id='terminal_cursor_credit'>_</span>");

let gettingfaster = false;

positionTerminalCursor($(".container_lyrics_before_loading>span"));
startBlinkTerminalCursor();
setTimeout(function() {
    for(let i = 0, len = 16; i < len; i++) $(".container_credits").append("<span class='row row" + i + "' ></span>" + (i != len - 1 ? "<br class='force-display'>" : ""));
    terminalCreditCursorElem.appendTo($(".container_credits"));
    startBlinkCreditTerminalCursor();
}, TERMINAL_CURSOR_BLINK_INTERVAL);

$("#stillalive_bgm").on("canplaythrough", function() {
    $(".container_lyrics_before_loading").remove();

    $(".container_lyrics_before_mobile").css("display", "block");
    positionTerminalCursor($(".container_lyrics_before_mobile>span"));
});

$(".container_lyrics_before_mobile>a").click(function() {
    $(".container_lyrics_before_mobile").remove();

    startTypingCurrentLyrics();
    startChangeLyricsContainer();
    $("#stillalive_bgm")[0].play();
    $("#stillalive_bgm")[0].muted = true;

    setTimeout(function() {
        $("#stillalive_bgm")[0].muted = false;
        $("#stillalive_bgm")[0].currentTime = 0;
    }, 6750);
    setTimeout(function() { startTypingCredits(); }, 9000);
});

$("html").click(function(event) {
	let targetTagName = $(event.target)[0].tagName.toLowerCase();

    if(targetTagName !== "a" && targetTagName !== "img") toggleFullscreen();
});

function startTypingCurrentLyrics() {
    $(".container_lyrics.current").children().each(function() {
        if($(this).prop("tagName").toLowerCase() != "br") {
            if($(this).data("start") != undefined &&
                $(this).data("dur") != undefined &&
                $(this).data("text") != undefined) {
                    let that = this;

                    setTimeout(function() {
                        if($(that).data("asciiart") != undefined) changeAsciiArt($(that).data("asciiart"));
                        if($(that).hasClass("play-game")) gettingfaster = true;

                        typeOneByOne($(that),
                                    $(that).data("text"),
                                    parseInt($(that).data("dur")),
                                    $(that).data("append-br"));
                    }, parseInt($(this).data("start")));
            }
        } else if($(this).prop("tagName").toLowerCase() == "br") {
            if($(this).data("show-offset") != undefined) {
                let that = this;
                setTimeout(function() {
                    $(that).css("display", "block");
                    positionTerminalCursor($(that));
                }, parseInt($(this).data("show-offset")));
            }
        }
    });
}

function startTypingCredits() {
    if(creditCurrentPosition < CREDIT_DATA.length) {
        let curCredit = CREDIT_DATA[creditCurrentPosition];

        for(let i = 1, l = 16; i < l; i++) $(".container_credits>span.row" + (i - 1)).text($(".container_credits>span.row" + i).text());

        typeCreditOneByOne(curCredit, CREDIT_CHARACTER_VELOCITY_MS * (curCredit == "" ? 1 : curCredit.length));
        creditCurrentPosition++;
    }
}

function startChangeLyricsContainer() {
    $(".container_lyrics").each(function() {
        if($(this).data("start") != undefined) {
            let that = this;

            setTimeout(function() {
                $(".container_lyrics.current").remove();
                $(that).addClass("current");
                startTypingCurrentLyrics();

                if($(that).hasClass("celebrate_credit")) changeAsciiArtRandomly(5000);
            }, parseInt($(this).data("start")));
        }
    });
}

function typeOneByOne(targetElem, text, duration, shouldAppendBR) {
    let timeoutPerChar = duration / text.length;
    let chars = text.split("");
    let charIdx = 0;

    positionTerminalCursor($(targetElem));

    if(shouldAppendBR) timeoutPerChar = duration / (chars.length + 1);

    for(let i = 0, n = chars.length + (shouldAppendBR ? 1 : 0); i < n; i++) {
        if(chars[i] == " ") chars[i] = "&nbsp;";

        setTimeout(function() {
            if(shouldAppendBR && charIdx == chars.length) {
                let newBR = $("<br class='force-display'>");
                newBR.insertAfter($(targetElem));
                positionTerminalCursor(newBR);
            } else $(targetElem).append(chars[charIdx++]);
        }, timeoutPerChar * i);
    }
}

function typeCreditOneByOne(text, duration) {
    let targetElem = $(".container_credits>span.row15");
    $(targetElem).text("");

    if(text != "") {
        let timeoutPerChar = duration / text.length;
        let chars = text.split("");
        let charIdx = 0;

        positionCreditTerminalCursor($(targetElem));

        for(let i = 0, n = chars.length + 1; i < n; i++) {
            setTimeout(function() {
                $(targetElem).append(chars[charIdx++]);

                if(charIdx == chars.length + 1) startTypingCredits();
            }, timeoutPerChar * i);
        }
    } else setTimeout(startTypingCredits, duration);
}

function positionTerminalCursor(currentLineElem) {
    $("#terminal_cursor").remove();
    terminalCursorElem.insertAfter($(currentLineElem));
}

function positionCreditTerminalCursor(currentLineElem) {
    $("#terminal_cursor_credit").remove();
    terminalCreditCursorElem.insertAfter($(currentLineElem));
}

function startBlinkTerminalCursor() {
    return setInterval(function() {
        if(terminalCursorElem.css("display") == undefined ||
            terminalCursorElem.css("display") == "inline-block")
            terminalCursorElem.css("display", "none");
        else
            terminalCursorElem.css("display", "");
    }, TERMINAL_CURSOR_BLINK_INTERVAL);
}

function startBlinkCreditTerminalCursor() {
    return setInterval(function() {
        if(terminalCreditCursorElem.css("display") == undefined ||
            terminalCreditCursorElem.css("display") == "inline-block")
            terminalCreditCursorElem.css("display", "none");
        else
            terminalCreditCursorElem.css("display", "");
    }, TERMINAL_CURSOR_BLINK_INTERVAL);
}

function changeAsciiArt(aaname) {
    $(".container_asciiart>pre.display").removeClass("display");
    if(aaname != "clear") $(".container_asciiart>pre.asciiart_" + aaname).addClass("display");
}

function changeAsciiArtRandomly(loopdelay) {
    setTimeout(function() {
        let rand = parseInt(Math.random() * $(".container_asciiart>pre").length);
        $(".container_asciiart>pre.display").removeClass("display");
        $($(".container_asciiart>pre").get(rand)).addClass("display");

        if(loopdelay <= 800) $("html, body").addClass("gettingfasterandfaster");
        else if(loopdelay <= 2500) $("html, body").addClass("gettingfaster");

        changeAsciiArtRandomly((loopdelay <= 50 ? 50 : loopdelay - (gettingfaster ? 39 : 0)));
    }, loopdelay);
}

function toggleFullscreen() {
	let element = document.documentElement;
	let isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || false;
	element.requestFullscreen = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || function() { return false; }
	document.exitFullscreen = document.exitFullscreen || document.cancelFullscreen || document.webkitExitFullscreen || document.webkitCancelFullscreen || document.mozCancelFullScreen || document.msExitFullscreen || function() { return false; }
	
	isFullscreen ? document.exitFullscreen() : element.requestFullscreen();
}

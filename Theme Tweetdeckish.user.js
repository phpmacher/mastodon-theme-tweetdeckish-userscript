// ==UserScript==
// @name         Theme Tweetdeckish
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to make the extended view a little more like Tweetdeck
// @author       @phpmacher@sueden.social
// @match        https://sueden.social/*
// @match        https://chaos.social/*
// @match        https://mastodon.social/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    var cssStyles = `

        /* change the global zoom level if necessary */
        body {
            -moz-transform: scale(0.95, 0.95); /* Moz-browsers */
            zoom: 0.95; /* Other non-webkit browsers */
            zoom: 95%; /* Webkit browsers */
        }

        /* on smartphone screens: */
        @media screen and (max-width: 2200px) {
            /* remove logo and complete header */
            .layout-single-column .app-holder, .layout-single-column .app-holder>div {
                min-height: 100%;
            }
            .ui__header__logo, .ui__header {
                display: none !important;
            }
            .tabs-bar__wrapper {
                top: 0px !important;
            }
            .navigation-panel {
                height: 100% !important;
            }
        }

        /* first column smaller */

        .column:first-child,
        .drawer:first-child {
            padding-left: 0px;
        }

        .drawer {
            width: 240px;
        }

        .drawer__inner__mastodon {
            display: none;
        }

        /* every column smaller */

        @media screen and (min-width: 631px) {
            .columns-area .column {
                width: 335px;
                padding: 5px 3px;
            }

            .columns-area--mobile .column {
                width: 100%;
                height: 100%;
                padding: 0;
            }
        }

        /* bigger Icons of each column */

        .column-header__button,
        .detailed-status__button button {
            font-size: 22px !important;
        }

        .column-header__icon {
            margin-right: 5px;
            font-size: 22px;
        }

        .column-header > button {
            padding: 12px 0 12px 6px;
        }

        /* Change the two selection-buttons in notifications-column */

        .notification__filter-bar button,
        .account__section-headline a, .account__section-headline button {
            padding: 8px 0;
            font-size: 14px;
        }

        /* change color of active area in notifications to be more visible */
        .notification__filter-bar button.active,
        .account__section-headline .active {
            color: #ecd0d4;
            background-color: #444b5d;
        }

        /* Layout of each post */

        /* Fonts */
        .status__content {
            font-size: 14px;
            line-height: 19px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Ubuntu,
            "Helvetica Neue", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol", Arial, "ヒラギノ角ゴ Pro W3",
            "Hiragino Kaku Gothic Pro", メイリオ, Meiryo, "ＭＳ Ｐゴシック",
            "MS PGothic";
        }

        .status__content p {
            margin-bottom: 10px;
        }

        /* Avatar round */
        .account__avatar {
            border-radius: 24px;
            width: 52px;
            height: 52px;
            background-size: 52px 52px;
        }

        /* Icons in each post bigger and centered */
        .status__action-bar {
            align-items: center;
            display: flex;
            margin-top: 8px;
            justify-content: space-evenly;
            /* filter: brightness(70%); */
        }

        /* Action-buttons: default */
        .status__action-bar-button.icon-button,
        .status__action-bar__button.icon-button {
            font-size: 20px !important;
        }

        /* dimm inactive buttons */
        .status__action-bar-button.icon-button:not(.active),
        .status__action-bar__button.icon-button:not(.active) {
            filter: brightness(70%);
        }

        /* Action-buttons: active */
        .icon-button.active {
            /*font-size: 24px;*/
            color: #32cd32;
            filter: brightness(2.0);
            filter: invert(13%) sepia(157%) saturate(2878%) hue-rotate(350deg) brightness(195%) contrast(100%);
        }
        .icon-button:active, .icon-button:focus, .icon-button:hover {
            filter: brightness(1.5);
        }

        /* change color of the visibility icons in each post */

        .fa-lock {
            color: #ff7f50;
        }

        .fa-unlock {
            color: #90ee90;
        }

        .fa-globe {
            color: #87cefa;
        }

        .fa-at {
            color: #87cefa;
        }

        /* Layout of Displayname of accounts in each post */
        .status__prepend .status__display-name strong,
        .status__prepend > span {
            font-size: 13px;
        }
        .display-name__account {
            font-size: 12px;
            color: #8899a6;
            line-height: initial;
        }

        /* layout of time in posts */
        .status__info time {
            color: #8899a6;
        }

        /* hide emojis in account names */
        .display-name__html .emojione, .notification__display-name .emojione {
            display: none;
        }

        /* resize emojis in post text */
        .status__content .emojione {
            width: 18px;
            height: 18px;
            padding-left: 4px;
            padding-right: 4px;
        }

        /* layout of text before boosted posts */
        .status__prepend {
            color: #c2cede;
            padding: 4px 0 0 15px;
            font-size: 13px;
            filter: brightness(60%);
        }

        /* Layout of one post */
        .status {
            padding-top: 5px;
        }
        .detailed-status__meta {
            color: #008b8b;
        }
        .detailed-status .status__content {
            font-size: 17px;
            line-height: 22px;
        }
        .detailed-status .fa-globe {
            color: unset;
        }
        .follow_requests-unlocked_explanation, .dismissable-banner, .navigation-panel__logo, .logo-resources {
            display: none;
        }

        /* Displayname in detail-view in right column */
        .detailed-status__display-name {
            margin-bottom: 5px;
        }

        /* highlight focused Posts in right column */
        .focusable .detailed-status {
            background: #313c42;
        }

        /* Layout of hashtags/links */

        /* remove underline at hashtags */
        .landing-page__short-description p a,
        .reply-indicator__content a,
        .rich-formatting a,
        .rich-formatting li a,
        .rich-formatting p a,
        .status__content a {
            text-decoration: none;
        }

        /* add underline at hashtags and links, if hovered over it */
        .landing-page__short-description p a:hover,
        .reply-indicator__content a:hover,
        .rich-formatting a:hover,
        .rich-formatting li a:hover,
        .rich-formatting p a:hover,
        .status__content a:hover {
            text-decoration: underline;
        }

        /* Links / Hashtags */
        .status__content a {
            color: #5f86e2;
        }
        .status__content a.unhandled-link {
            color: #1e90ff;
        }
        .status__content a.mention span {
            text-decoration: none;
        }
        .status__content a.mention span:hover {
            text-decoration: underline;
        }

        /* animation to fade out articles/posts */
        article {
            opacity: 1;
            transition: opacity 300ms;
        }
        /*
        .postFadeOut {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s linear 300ms, opacity 300ms;
        }
        .isHidden {
            display: none;
            opacity: 0;
        }
        */

        /* Layout of CW (Content-Warning) button */
        .status__content__spoiler-link {
            border-radius: 10px;
            padding: 0px 6px;
            margin-top: 5px;
        }

        /* CW: layout description */
        .status__content.status__content--with-action.status__content--with-spoiler
        > p
        > span {
            color: #778899;
        }
        .status__content.status__content--with-action.status__content--with-spoiler
        > p {
            margin-bottom: 5px;
        }
        /* CW: remove button */
        .status__content.status__content--with-spoiler .status__content__spoiler-link {
            display: none !important;
        }

        /* show Threadlink smaller */
        .status__content__read-more-button {
            font-size: unset;
            filter: brightness(0.75);
        }

        /* hide buttons to hide images */
        .spoiler-button {
            display: none !important;
        }

        /* resize columns interactive */
	    .columns-area .column{
            resize: horizontal;
	        max-width: 100% !important;
            flex-shrink: 0;
	    }
        /*
        .column:last-child {
            resize: horizontal !important;
            flex: 1 1 auto !important;
	    }
        */
        .drawer{
            resize: horizontal !important;
        }

        /* change unread messages */
        .notification.unread, .status__wrapper.unread {
            background-color: darkslategrey;
        }

        /* change boosts, that i already liked */
        article:has(div.status__prepend) :has(button.active > i.fa-star) {
            transition: filter 2s ease-in-out 0.5s;
            filter: brightness(80%);
            display: none;
        }

        /* change boosts, that i already boosted */
        article:has(div.status__prepend) :has(button.active > i.fa-retweet) {
            transition: filter 2s ease-in-out 0.5s;
            filter: brightness(83%);
        }

        /* make zoomed images just a little higher */
        .zoomable-image img {
            max-height: 85%;
        }

        /* allow Browser to zoom on pictures */
        .modal-root__modal {
            pointer-events: none;
        }

        /* mark non-german posts */
        article:has(> div > div > div > div.status__content > div:not([lang="de"])) {
            background-color: rgb(40, 60, 70);
            /* border: 2px solid darkcyan;*/
        }
    `;

    function addCss(css) {

        //var cssString = css.replace(/;/g, ' !important;');
        var cssString = css;

        // workaround for various GreaseMonkey engines
        if (typeof GM_addStyle != "undefined") {
            GM_addStyle(cssString);
        } else if (typeof PRO_addStyle != "undefined") {
            PRO_addStyle(cssString);
        } else if (typeof addStyle != "undefined") {
            addStyle(cssString);
        } else {
            var node = document.createElement("style");
            node.type = "text/css";
            node.appendChild(document.createTextNode(cssString));
            var heads = document.getElementsByTagName("head");
            if (heads.length > 0) {
                heads[0].appendChild(node);
            } else {
                // no head yet, stick it whereever
                document.documentElement.appendChild(node);
            }
        }
    }

    addCss(cssStyles);
})();
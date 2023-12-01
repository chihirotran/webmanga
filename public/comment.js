!function(t) {
    var e = {
        init: function(n) {
            return this.each((function() {
                var o = this
                  , a = t(o).empty();
                o.opt = t.extend(!0, {}, t.fn.raty.defaults, n),
                a.data("settings", o.opt),
                o.opt.number = e.between(o.opt.number, 0, 20),
                "/" != o.opt.path.substring(o.opt.path.length - 1, o.opt.path.length) && (o.opt.path += "/"),
                "function" == typeof o.opt.score && (o.opt.score = o.opt.score.call(o)),
                o.opt.score && (o.opt.score = e.between(o.opt.score, 0, o.opt.number));
                for (var i = 1; i <= o.opt.number; i++)
                    t("<img />", {
                        src: o.opt.path + (!o.opt.score || o.opt.score < i ? o.opt.starOff : o.opt.starOn),
                        alt: i,
                        title: i <= o.opt.hints.length && null !== o.opt.hints[i - 1] ? o.opt.hints[i - 1] : i
                    }).appendTo(o),
                    o.opt.space && a.append(i < o.opt.number ? "&#160;" : "");
                o.stars = a.children('img:not(".raty-cancel")'),
                o.score = t("<input />", {
                    type: "hidden",
                    name: o.opt.scoreName
                }).appendTo(o),
                o.opt.score && o.opt.score > 0 && (o.score.val(o.opt.score),
                e.roundStar.call(o, o.opt.score)),
                o.opt.iconRange && e.fill.call(o, o.opt.score),
                e.setTarget.call(o, o.opt.score, o.opt.targetKeep);
                var c = o.opt.space ? 4 : 0;
                o.opt.width || (o.opt.number,
                o.opt.size,
                o.opt.number);
                o.opt.cancel && (o.cancel = t("<img />", {
                    src: o.opt.path + o.opt.cancelOff,
                    alt: "x",
                    title: o.opt.cancelHint,
                    class: "raty-cancel"
                }),
                "left" == o.opt.cancelPlace ? a.prepend("&#160;").prepend(o.cancel) : a.append("&#160;").append(o.cancel),
                o.opt.size),
                o.opt.readOnly ? (e.fixHint.call(o),
                o.cancel && o.cancel.hide()) : (a.css("cursor", "pointer"),
                e.bindAction.call(o))
            }
            ))
        },
        between: function(t, e, n) {
            return Math.min(Math.max(parseFloat(t), e), n)
        },
        bindAction: function() {
            var n = this
              , o = t(n);
            o.mouseleave((function() {
                var t = n.score.val() || void 0;
                e.initialize.call(n, t),
                e.setTarget.call(n, t, n.opt.targetKeep),
                n.opt.mouseover && n.opt.mouseover.call(n, t)
            }
            ));
            var a = n.opt.half ? "mousemove" : "mouseover";
            n.opt.cancel && n.cancel.mouseenter((function() {
                t(this).attr("src", n.opt.path + n.opt.cancelOn),
                n.stars.attr("src", n.opt.path + n.opt.starOff),
                e.setTarget.call(n, null, !0),
                n.opt.mouseover && n.opt.mouseover.call(n, null)
            }
            )).mouseleave((function() {
                t(this).attr("src", n.opt.path + n.opt.cancelOff),
                n.opt.mouseover && n.opt.mouseover.call(n, n.score.val() || null)
            }
            )).click((function(t) {
                n.score.removeAttr("value"),
                n.opt.click && n.opt.click.call(n, null, t)
            }
            )),
            n.stars.bind(a, (function(a) {
                var i = parseInt(this.alt, 10);
                if (n.opt.half) {
                    var c = parseFloat((a.pageX - t(this).offset().left) / n.opt.size)
                      , s = c > .5 ? 1 : .5;
                    i = parseFloat(this.alt) - 1 + s,
                    e.fill.call(n, i),
                    n.opt.precision && (i = i - s + c),
                    e.showHalf.call(n, i)
                } else
                    e.fill.call(n, i);
                o.data("score", i),
                e.setTarget.call(n, i, !0),
                n.opt.mouseover && n.opt.mouseover.call(n, i, a)
            }
            )).click((function(t) {
                n.score.val(n.opt.half || n.opt.precision ? o.data("score") : this.alt),
                n.opt.click && n.opt.click.call(n, n.score.val(), t)
            }
            ))
        },
        cancel: function(n) {
            return t(this).each((function() {
                var o = this;
                if (!0 === t(o).data("readonly"))
                    return this;
                n ? e.click.call(o, null) : e.score.call(o, null),
                o.score.removeAttr("value")
            }
            ))
        },
        click: function(n) {
            return t(this).each((function() {
                if (!0 === t(this).data("readonly"))
                    return this;
                e.initialize.call(this, n),
                this.opt.click ? this.opt.click.call(this, n) : e.error.call(this, 'you must add the "click: function(score, evt) { }" callback.'),
                e.setTarget.call(this, n, !0)
            }
            ))
        },
        error: function(e) {
            t(this).html(e),
            t.error(e)
        },
        fill: function(t) {
            for (var e, n, o, a = this, i = a.stars.length, c = 0, s = 1; s <= i; s++)
                e = a.stars.eq(s - 1),
                a.opt.iconRange && a.opt.iconRange.length > c ? (n = a.opt.iconRange[c],
                o = a.opt.single ? s == t ? n.on || a.opt.starOn : n.off || a.opt.starOff : s <= t ? n.on || a.opt.starOn : n.off || a.opt.starOff,
                s <= n.range && e.attr("src", a.opt.path + o),
                s == n.range && c++) : (o = a.opt.single ? s == t ? a.opt.starOn : a.opt.starOff : s <= t ? a.opt.starOn : a.opt.starOff,
                e.attr("src", a.opt.path + o))
        },
        fixHint: function() {
            var e = t(this)
              , n = parseInt(this.score.val(), 10)
              , o = this.opt.noRatedMsg;
            !isNaN(n) && n > 0 && (o = n <= this.opt.hints.length && null !== this.opt.hints[n - 1] ? this.opt.hints[n - 1] : n),
            e.data("readonly", !0).css("cursor", "default").attr("title", o),
            this.score.attr("readonly", "readonly"),
            this.stars.attr("title", o)
        },
        getScore: function() {
            var e, n = [];
            return t(this).each((function() {
                e = this.score.val(),
                n.push(e ? parseFloat(e) : void 0)
            }
            )),
            n.length > 1 ? n : n[0]
        },
        readOnly: function(n) {
            return this.each((function() {
                var o = t(this);
                if (o.data("readonly") === n)
                    return this;
                this.cancel && (n ? this.cancel.hide() : this.cancel.show()),
                n ? (o.unbind(),
                o.children("img").unbind(),
                e.fixHint.call(this)) : (e.bindAction.call(this),
                e.unfixHint.call(this)),
                o.data("readonly", n)
            }
            ))
        },
        reload: function() {
            return e.set.call(this, {})
        },
        roundStar: function(t) {
            var e = (t - Math.floor(t)).toFixed(2);
            if (e > this.opt.round.down) {
                var n = this.opt.starOn;
                e < this.opt.round.up && this.opt.halfShow ? n = this.opt.starHalf : e < this.opt.round.full && (n = this.opt.starOff),
                this.stars.eq(Math.ceil(t) - 1).attr("src", this.opt.path + n)
            }
        },
        score: function() {
            return arguments.length ? e.setScore.apply(this, arguments) : e.getScore.call(this)
        },
        set: function(e) {
            return this.each((function() {
                var n = t(this)
                  , o = n.data("settings")
                  , a = n.clone().removeAttr("style").insertBefore(n);
                n.remove(),
                a.raty(t.extend(o, e))
            }
            )),
            t(this.selector)
        },
        setScore: function(n) {
            return t(this).each((function() {
                if (!0 === t(this).data("readonly"))
                    return this;
                e.initialize.call(this, n),
                e.setTarget.call(this, n, !0)
            }
            ))
        },
        setTarget: function(n, o) {
            if (this.opt.target) {
                var a = t(this.opt.target);
                0 == a.length && e.error.call(this, "target selector invalid or missing!");
                var i = n;
                i = o && void 0 !== i ? "hint" == this.opt.targetType ? null === i && this.opt.cancel ? this.opt.cancelHint : this.opt.hints[Math.ceil(i - 1)] : this.opt.precision ? parseFloat(i).toFixed(1) : parseInt(i, 10) : this.opt.targetText,
                this.opt.targetFormat.indexOf("{score}") < 0 && e.error.call(this, 'template "{score}" missing!'),
                null !== n && (i = this.opt.targetFormat.toString().replace("{score}", i)),
                a.is(":input") ? a.val(i) : a.html(i)
            }
        },
        showHalf: function(t) {
            var e = (t - Math.floor(t)).toFixed(1);
            e > 0 && e < .6 && this.stars.eq(Math.ceil(t) - 1).attr("src", this.opt.path + this.opt.starHalf)
        },
        initialize: function(t) {
            t = t ? e.between(t, 0, this.opt.number) : 0,
            e.fill.call(this, t),
            t > 0 && (this.opt.halfShow && e.roundStar.call(this, t),
            this.score.val(t))
        },
        unfixHint: function() {
            for (var e = 0; e < this.opt.number; e++)
                this.stars.eq(e).attr("title", e < this.opt.hints.length && null !== this.opt.hints[e] ? this.opt.hints[e] : e);
            t(this).data("readonly", !1).css("cursor", "pointer").removeAttr("title"),
            this.score.attr("readonly", "readonly")
        }
    };
    t.fn.raty = function(n) {
        return e[n] ? e[n].apply(this, Array.prototype.slice.call(arguments, 1)) : "object" != typeof n && n ? void t.error("Method " + n + " does not exist!") : e.init.apply(this, arguments)
    }
    ,
    t.fn.raty.defaults = {
        cancel: !1,
        cancelHint: "cancel this rating!",
        cancelOff: "cancel-off.png",
        cancelOn: "cancel-on.png",
        cancelPlace: "left",
        click: void 0,
        half: !1,
        halfShow: !0,
        hints: ["bad", "poor", "regular", "good", "gorgeous"],
        iconRange: void 0,
        mouseover: void 0,
        noRatedMsg: "not rated yet",
        number: 5,
        path: "img/",
        precision: !1,
        round: {
            down: .25,
            full: .6,
            up: .76
        },
        readOnly: !1,
        score: void 0,
        scoreName: "score",
        single: !1,
        size: 16,
        space: !0,
        starHalf: "star-half.png",
        starOff: "star-off.png",
        starOn: "star-on.png",
        target: void 0,
        targetFormat: "{score}",
        targetKeep: !1,
        targetText: "",
        targetType: "hint"
    }
}(jQuery),
$("body").on("click", ".sort-comments", (function(t) {
    $(".sort-comments .icons").toggleClass("active"),
    loadCommentList(1)
}
)),
$("body").on("click", ".all-comments", (function(t) {
    $(".all-comments .icons").toggleClass("active"),
    loadCommentList(1)
}
)),
$("body").on("click", ".comment-nav li", (function(t) {
    $(".comment-nav li").removeClass("active"),
    $(this).addClass("active"),
    loadCommentList(1)
}
)),
$("body").on("click", ".commentpager ul li a", (function(t) {
    t.preventDefault();
    var e = $(this).attr("href").split("#");
    0 == isNaN(parseInt(e[1])) && parseInt(e[1]) > 0 && loadCommentList(parseInt(e[1]))
}
)),
shortenCommentText(".comment-list .comment-content");
var urlCommentSend = "/Comic/Services/CommentService.asmx/Save"
  , urlCommentList = "/Comic/Services/CommentService.asmx/List"
  , urlCommentDelete = "/Comic/Services/CommentService.asmx/Remove"
  , urlCommentVote = "/Comic/Services/CommentService.asmx/Vote"
  , urlCommentReport = "/Comic/Services/CommentService.asmx/Report"
  , urlCommentAction = "/Comic/Services/CommentService.asmx/Action"
  , formId = "comment_form"
  , commentNameId = "comment_name"
  , commentEmailId = "comment_email"
  , commentContentId = "comment_content"
  , commentMoreId = "comment_more";
function openComment(t) {
    $(t).addClass("hidden"),
    buildForm(0),
    loadMcePlugins((function() {
        initMce("comment_content")
    }
    ))
}
function replyComment(t) {
    buildForm(t),
    loadMcePlugins((function() {
        initMce("comment_content_" + t)
    }
    ))
}
function openCommentAction(t) {
    var e = $("#" + commentMoreId + "_" + t);
    if ($(".comment-more").addClass("hidden"),
    e.removeClass("hidden"),
    !e.hasClass("opened")) {
        var n = {
            comicId: gOpts.comicId,
            commentId: t
        };
        commentAjax(urlCommentAction, "POST", n, (function(n) {
            if (n.success && n.data) {
                var o = parseInt(n.data);
                (1 & o) > 0 && e.append('<li><span onclick="deleteComment(' + t + ', 0)">Xóa</span></li>'),
                (2 & o) > 0 && e.append('<li><span onclick="deleteComment(' + t + ', 1)">Xóa tất cả</span></li>'),
                (4 & o) > 0 && e.append('<li><span onclick="deleteComment(' + t + ', 2)">Xóa tất cả và cấm bình luận</span></li>'),
                (8 & o) > 0 && e.append('<li><span onclick="deleteComment(' + t + ', 3)">Xóa tất cả và khóa tài khoản</span></li>')
            }
            e.addClass("opened")
        }
        ))
    }
}
function buildForm(t) {
    var e = formId
      , n = commentNameId
      , o = commentEmailId
      , a = commentContentId;
    t > 0 && (e += "_" + t,
    n += "_" + t,
    o += "_" + t,
    a += "_" + t);
    var i = $("#" + e);
    if ($("#" + n).length)
        return i.show(),
        void tinyMCE.get(a).focus();
    var c = $('<div class="comment-info"></div>');
    c.append('<input id="' + n + '" class="comment-name form-control" maxlength="50" type="text" placeholder="Họ tên (Bắt buộc)" />'),
    c.append('<input id="' + o + '" class="comment-email form-control" maxlength="100" type="text" placeholder="Email" />'),
    c.append('<button type="submit" class="btn btn-primary" onclick="sendComment(' + t + ');return false;">Gửi</button>'),
    i.append('<textarea id="' + a + '" class="form-control" placeholder="Nội dung bình luận" />'),
    i.append(c);
    var s = ""
      , r = "";
    if (gOpts.fullName && gOpts.fullName.length)
        s = unescape(gOpts.fullName);
    else {
        var l = Get_Cookie("CommentName");
        l && (s = l)
    }
    if (gOpts.email && gOpts.email.length)
        r = unescape(gOpts.email);
    else {
        var m = Get_Cookie("CommentEmail");
        l && (r = unescape(m))
    }
    s.length && (s = $("<div />").html(s).text(),
    $("#" + n).val(s)),
    r.length && (r = $("<div />").html(r).text(),
    $("#" + o).val(r))
}
function initMce(t) {
    tinymce.init({
        forced_root_block: !1,
        force_br_newlines: !0,
        force_p_newlines: !1,
        entity_encoding: "raw",
        selector: "#" + t,
        menubar: !1,
        statusbar: !1,
        plugins: ["autoresize", "emobabysoldier, emoonion, emobafu, emothobua, emothotuzki, emoyoyo, emopanda, emotrollface, emogif", "paste"],
        paste_as_text: !0,
        toolbar: "emotrollface emoonion emobafu emothobua emothotuzki emoyoyo emopanda emobabysoldier emogif",
        setup: function(t) {
            t.on("init", (function() {
                this.getDoc().body.style.fontSize = "16px"
            }
            ))
        },
        height: 100,
        autoresize_min_height: 100,
        autoresize_max_height: 300,
        autoresize_bottom_margin: 0,
        init_instance_callback: function() {
            setTimeout((function() {
                tinymce.execCommand("mceFocus", !1, t)
            }
            ), 500)
        }
    })
}
function loadMcePlugins(t) {
    if ("undefined" == typeof tinymce) {
        var e = document.createElement("script");
        e.type = "text/javascript",
        e.readyState ? e.onreadystatechange = function() {
            "loaded" != e.readyState && "complete" != e.readyState || (e.onreadystatechange = null,
            t())
        }
        : e.onload = function() {
            t()
        }
        ,
        e.src = "//st.ntcdntempv3.com/Data/Sites/1/skins/comic/js/mce/tinymce.min.js";
        var n = document.getElementById("comments-js");
        n.parentNode.insertBefore(e, n)
    } else
        t()
}
var isProcessRunning = !1;
function validateEmail(t) {
    return new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).test(t)
}
function validateName(t) {
    return /^[a-zA-Z\-\s\_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼẾỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/.test(t)
}
function sendComment(t) {
    if (1 != isProcessRunning) {
        isProcessRunning = !0;
        var e = commentNameId
          , n = commentEmailId
          , o = commentContentId;
        t > 0 && (e += "_" + t,
        n += "_" + t,
        o += "_" + t);
        var a = {};
        return a.comicId = gOpts.comicId,
        a.chapterId = gOpts.chapterId,
        a.commentId = t,
        a.fullName = $("#" + e).val(),
        a.email = $("#" + n).val(),
        a.content = tinymce.get(o).getContent(),
        a.token = gOpts.key,
        "" == a.content ? (alert("Vui lòng nhập nội dung."),
        tinymce.execCommand("mceFocus", !1, o),
        void (isProcessRunning = !1)) : "" == a.fullName ? (alert("Vui lòng nhập tên của bạn."),
        $("#" + e).focus(),
        void (isProcessRunning = !1)) : "" != a.fullName && 0 == validateName(a.fullName) ? (alert("Tên không được sử dụng các ký tự đặc biệt."),
        $("#" + e).focus(),
        void (isProcessRunning = !1)) : void commentAjax(urlCommentSend, "POST", a, (function(e) {
            if (e.success) {
                if (t > 0 ? ($("#comment_form_" + t).hide(),
                $(e.data).hide().insertAfter($("#comment_form_" + t)).fadeIn()) : $(e.data).hide().prependTo($(".comment-wrapper .comment-list")).fadeIn(),
                tinymce.get(o).setContent(""),
                gOpts.fullName = a.fullName,
                gOpts.email = a.email,
                "undefined" != typeof Storage && void 0 !== localStorage["user-auth"]) {
                    var n = JSON.parse(localStorage["user-auth"]);
                    n.fullName = gOpts.fullName,
                    n.email = gOpts.email,
                    localStorage["user-auth"] = JSON.stringify(n)
                }
            } else
                e.message && alert(e.message)
        }
        ))
    }
}
function deleteComment(t, e) {
    var n = "Bạn có chắc chắn muốn xóa bình luận?";
    if (1 == e && (n = "Bạn có chắc chắn muốn xóa tất cả bình luận của user?"),
    2 == e && (n = "Bạn có chắc chắn muốn xóa tất cả bình luận và block user?"),
    confirm(n)) {
        var o = {
            comicId: gOpts.comicId,
            commentId: t,
            type: e
        };
        commentAjax(urlCommentDelete, "POST", o, (function(e) {
            $("#comment_" + t).slideUp((function() {
                $(this).remove()
            }
            ))
        }
        ))
    }
}
function voteComment(t, e, n) {
    var o = {
        comicId: gOpts.comicId,
        commentId: t,
        type: e
    };
    commentAjax(urlCommentVote, "POST", o, (function(t) {
        t.success && t.votes && n ? 0 == e ? $(n).find(".vote-down-count").text(t.votes) : 1 == e && $(n).find(".vote-up-count").text(t.votes) : t.message && alert(t.message)
    }
    ))
}
function reportComment(t, e) {
    if (confirm("Bạn có chắc chắn bình luận này vi phạm Tiêu chuẩn cộng đồng?")) {
        var n = {
            comicId: gOpts.comicId,
            commentId: e
        };
        commentAjax(urlCommentReport, "POST", n, (function(e) {
            $(t).removeAttr("onclick").html("Báo vi phạm thành công!")
        }
        ))
    }
}
function loadCommentList(t) {
    var e = 0;
    $(".sort-comments .icons").hasClass("active") && (e = 5);
    var n = gOpts.chapterId;
    $(".comment-nav").length ? "0" == $(".comment-nav li.active").attr("data-type") && (n = -1) : $(".all-comments .icons").hasClass("active") && (n = -1);
    var o = {
        comicId: gOpts.comicId,
        orderBy: e,
        chapterId: n,
        parentId: 0,
        pageNumber: t,
        token: gOpts.key
    };
    commentAjax(urlCommentList, "GET", o, (function(t) {
        if (t.response) {
            $(".comment-wrapper .comment-list").html(t.response);
            var e = 0;
            e = $(".comment-nav").length ? $(".comment-nav").offset().top : $(".comment-list").offset().top,
            $("html, body").animate({
                scrollTop: e - 80
            }, 0, "linear"),
            shortenCommentText(".comment-list .comment-content")
        } else
            $(".comment-wrapper .comment-list").html("");
        var n = "";
        t.pager && (n = t.pager),
        $(".commentpager").length ? $(".commentpager").html(n) : $("#nt_comments").append("<div class='pagination-outter commentpager'>" + n + "</div>"),
        AjaxHelper.changeLevelText()
    }
    ))
}
function commentAjax(t, e, n, o) {
    1 != AjaxHelper.loadWaiting && (AjaxHelper.setLoadWaiting(!0),
    $.ajax({
        type: e,
        url: t,
        data: n,
        success: function(t) {
            void 0 !== o && o(t)
        },
        complete: function(t) {
            AjaxHelper.setLoadWaiting(!1),
            isProcessRunning = !1
        },
        error: function(t, e, n) {
            AjaxHelper.processAjaxError(n)
        }
    }))
}
function shortenCommentText(t, e) {
    $.fn.shorten = function(t) {
        var e = {
            maxHeight: 60,
            ellipsesText: "...",
            moreText: "Xem thêm <i class='fa fa-angle-right'></i>",
            lessText: "<i class='fa fa-angle-left'></i> Thu gọn"
        };
        return t && $.extend(e, t),
        $(document).off("click", ".morelink"),
        $(document).on({
            click: function() {
                var t = $(this);
                return t.hasClass("less") ? (t.removeClass("less"),
                t.html(e.moreText),
                t.prev().addClass("shortened")) : (t.addClass("less"),
                t.html(e.lessText),
                t.prev().removeClass("shortened")),
                !1
            }
        }, ".morelink"),
        this.each((function() {
            var t = $(this);
            t.hasClass("shortened") || t.height() > e.maxHeight && (t.addClass("shortened"),
            $('<a href="#" class="morelink">' + e.moreText + "</a>").insertAfter(t))
        }
        ))
    }
    ;
    var n = 150;
    e && (n = e),
    $(t).shorten({
        maxHeight: n
    })
}

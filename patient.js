/* ═══════════════════════════════════════
   患者档案详情页 · 渲染脚本
   通过 URL 参数 ?id=BSJ-XXX 读取 data.js 渲染
   ═══════════════════════════════════════ */

(function () {
  "use strict";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var main = document.getElementById("detailMain");

  function renderNotFound() {
    main.innerHTML =
      '<div class="not-found">' +
        '<p>🕳️ 查无此人——这位患者可能已经出院了</p>' +
        '<a href="index.html#patients" class="enter-btn">← 返回病友档案</a>' +
      '</div>';
  }

  /* 页面切换过渡（返回总览页时向下滑出） */
  function bindPageTransitions() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (href.indexOf(".html") === -1) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(function () { window.location.href = href; }, 400);
    });
  }

  function renderPatient(p) {
    /* 大头照（或占位） */
    var photo = p.photo
      ? '<img src="' + escapeHtml(p.photo) + '" alt="' + escapeHtml(p.name) + '">'
      : '<span>📋</span><p>照片待补</p>';

    /* 照片墙：有照片显示，没有则占位 */
    var photoWall = "";
    if (p.photos && p.photos.length > 0) {
      photoWall = p.photos.map(function (src, i) {
        return (
          '<div class="dp-slot">' +
            '<img src="' + escapeHtml(src) + '" alt="' + escapeHtml(p.name) + ' 照片 ' + (i + 1) + '">' +
            '<p class="dp-caption">照片 ' + (i + 1) + '</p>' +
          '</div>'
        );
      }).join("");
    } else {
      photoWall =
        '<div class="dp-slot"><div class="dp-ph"><span>📷</span>照片征集中</div><p class="dp-caption">照片位 1</p></div>' +
        '<div class="dp-slot"><div class="dp-ph"><span>📷</span>照片征集中</div><p class="dp-caption">照片位 2</p></div>' +
        '<div class="dp-slot"><div class="dp-ph"><span>📷</span>照片征集中</div><p class="dp-caption">照片位 3</p></div>' +
        '<div class="dp-slot"><div class="dp-ph"><span>📷</span>照片征集中</div><p class="dp-caption">照片位 4</p></div>';
    }

    main.innerHTML =
      '<section class="detail-hero d-in">' +
        '<div class="detail-photo">' + photo + '</div>' +
        '<div class="detail-info">' +
          '<div class="detail-id">档案号：' + escapeHtml(p.id) + '</div>' +
          '<div class="detail-name">' + escapeHtml(p.name) + '</div>' +
          (p.title ? '<div class="detail-title">' + escapeHtml(p.title) + '</div>' : '') +
          '<div class="detail-stamp">已疯</div>' +
        '</div>' +
      '</section>' +

      '<section class="detail-table d-in">' +
        '<h2>病 历 本</h2>' +
        '<table class="pc-table">' +
          '<tr><td class="k">生日</td><td>' + escapeHtml(p.birthday) + '</td></tr>' +
          '<tr><td class="k">MBTI</td><td>' + escapeHtml(p.mbti) + '</td></tr>' +
          '<tr><td class="k">自担</td><td>' + escapeHtml(p.stand) + '</td></tr>' +
          '<tr><td class="k">身份证号</td><td>' + escapeHtml(p.idCard) + '</td></tr>' +
        '</table>' +
      '</section>' +

      '<section class="detail-photos d-in">' +
        '<h2>照 片 墙</h2>' +
        '<p class="sub">这位病友的精彩瞬间</p>' +
        '<div class="detail-photo-wall">' + photoWall + '</div>' +
      '</section>' +

      '<div class="d-in" style="text-align:center; margin-top: 44px;">' +
        '<a href="index.html#patients" class="enter-btn">← 返回病友档案</a>' +
      '</div>';

    /* 内容分块依次浮现：大头照 → 病历本 → 照片墙 → 返回按钮 */
    var blocks = main.querySelectorAll(".d-in");
    blocks.forEach(function (el, i) {
      setTimeout(function () { el.classList.add("d-show"); }, 120 + i * 180);
    });
  }

  /* ─────────── 启动 ─────────── */
  bindPageTransitions();

  var id = new URLSearchParams(location.search).get("id");
  var patient = null;
  if (typeof PATIENTS !== "undefined" && id) {
    for (var i = 0; i < PATIENTS.length; i++) {
      if (PATIENTS[i].id === id) { patient = PATIENTS[i]; break; }
    }
  }

  if (patient) {
    document.title = patient.name + " · 患者档案 · 白沙街疯人院";
    renderPatient(patient);
  } else {
    renderNotFound();
  }
})();

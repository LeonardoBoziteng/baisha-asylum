/* ═══════════════════════════════════════
   白沙街疯人院 · 交互脚本
   1. 渲染病友档案卡（数据来自 data.js）
   2. 留言板（本地保存）
   3. 滚动渐显动画
   ═══════════════════════════════════════ */

(function () {
  "use strict";

  /* ─────────── 1. 病友档案卡 ─────────── */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderPatients() {
    const grid = document.getElementById("patientGrid");
    if (!grid || typeof PATIENTS === "undefined") return;

    grid.innerHTML = PATIENTS.map(function (p, i) {
      const avatar = p.photo
        ? '<img src="' + escapeHtml(p.photo) + '" alt="' + escapeHtml(p.name) + '">'
        : '<span>📋</span><p>照片待补</p>';

      /* 三种档案变体循环：红/蓝/绿，各有不同的边框、胶带、倾斜 */
      const variant = "v" + ((i % 3) + 1);

      return (
        '<a class="patient-link" href="patient.html?id=' + encodeURIComponent(p.id) + '" title="查看 ' + escapeHtml(p.name) + ' 的档案">' +
          '<article class="patient-card reveal ' + variant + '">' +
            '<div class="pc-bar" aria-hidden="true"></div>' +
            '<div class="pc-avatar">' + avatar + '</div>' +
            '<div class="pc-name">' + escapeHtml(p.name) + '</div>' +
            (p.title ? '<div class="pc-title">' + escapeHtml(p.title) + '</div>' : '') +
            '<div class="pc-no">' + escapeHtml(p.id) + '</div>' +
          '</article>' +
        '</a>'
      );
    }).join("");
  }

  /* ─────────── 1.5 背景装饰自动散布 ─────────── */
  function renderDecors() {
    var sets = {
      home: {
        count: 20,
        emojis: ["🩹", "💊", "📚", "🧪", "📋", "✏️", "🖍️", "🧷", "🏫", "📖", "🍎", "📐", "🖊️", "✂️", "📏", "🎒", "💌", "📝", "💉", "📅"]
      },
      patients: {
        count: 28,
        emojis: ["💊", "📐", "🩹", "🍎", "📖", "🖊️", "🧷", "✏️", "📏", "📚", "🧪", "🎒", "📋", "🏫", "🖍️", "💉", "📌", "📝", "✂️", "🧬"]
      },
      photos: {
        count: 20,
        emojis: ["📎", "🖇️", "✂️", "🎒", "📏", "🖍️", "📚", "📐", "🖊️", "🧷", "📖", "🍎", "✏️", "📋", "💊", "📮", "📌", "📷"]
      },
      messages: {
        count: 20,
        emojis: ["💌", "📮", "📝", "✉️", "📅", "📕", "🖊️", "📎", "✏️", "📖", "📐", "🧷", "🍎", "📚", "💊", "🏫", "📌", "📭"]
      }
    };

    /* 固定种子：每次刷新布局一致（也保证测试稳定） */
    var seed = 20260801;
    function rnd() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }

    for (var id in sets) {
      var sec = document.getElementById(id);
      if (!sec) continue;
      var cfg = sets[id];
      var html = "";
      for (var i = 0; i < cfg.count; i++) {
        var emoji = cfg.emojis[i % cfg.emojis.length];
        var top = (3 + rnd() * 88).toFixed(1);
        var left = (3 + rnd() * 88).toFixed(1);
        var rot = (rnd() * 50 - 25).toFixed(1);
        var scale = (0.7 + rnd() * 0.6).toFixed(2);
        html += '<span class="deco" style="top:' + top + '%;left:' + left + '%;transform:rotate(' + rot + 'deg) scale(' + scale + ');">' + emoji + '</span>';
      }
      sec.insertAdjacentHTML("afterbegin", html);
    }
  }

  /* ─────────── 2. 照片墙 ─────────── */
  var PHOTO_SRC = []; // 供灯箱使用的照片列表

  function renderPhotoWall() {
    const wall = document.getElementById("photoWall");
    if (!wall || typeof PHOTO_WALL === "undefined") return;

    PHOTO_SRC = PHOTO_WALL;
    wall.innerHTML = PHOTO_WALL.map(function (p, i) {
      return (
        '<div class="photo-slot reveal">' +
          '<div class="photo-frame">' +
            '<img src="' + escapeHtml(p.src) + '" alt="' + escapeHtml(p.caption) + '" loading="lazy" data-index="' + i + '">' +
          '</div>' +
          '<p class="photo-caption">' + escapeHtml(p.caption) + '</p>' +
        '</div>'
      );
    }).join("");

    // 点击任意照片 → 打开灯箱预览
    wall.addEventListener("click", function (e) {
      var img = e.target.closest(".photo-frame img");
      if (img) openLightbox(parseInt(img.getAttribute("data-index"), 10));
    });
  }

  /* ─────────── 2.5 照片灯箱 ─────────── */
  var lightbox = null;
  var lbIndex = 0;
  var lbImgEl = null;
  var lbScale = 1, lbTx = 0, lbTy = 0;        // 缩放与平移
  var lbDragging = false, lbDragMoved = false; // 拖动状态
  var lbDragSX = 0, lbDragSY = 0, lbDragTX = 0, lbDragTY = 0;
  var lbClickTimer = null;

  function lbApply() {
    lbImgEl.style.transform = "translate(" + lbTx + "px," + lbTy + "px) scale(" + lbScale + ")";
    lbImgEl.style.cursor = lbScale > 1 ? "grab" : "zoom-in";
  }

  function lbReset() {
    lbScale = 1; lbTx = 0; lbTy = 0;
    if (lbImgEl) lbApply();
  }

  function lbZoom(factor) {
    lbScale = Math.min(4, Math.max(1, lbScale * factor));
    if (lbScale === 1) { lbTx = 0; lbTy = 0; }
    lbApply();
  }

  function openLightbox(index) {
    if (!PHOTO_SRC.length) return;
    lbIndex = (index + PHOTO_SRC.length) % PHOTO_SRC.length;
    updateLightbox();
    document.getElementById("lightbox").classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
    document.body.style.overflow = "";
    lbReset();
  }

  function updateLightbox() {
    var p = PHOTO_SRC[lbIndex];
    lbImgEl.src = p.src;
    lbImgEl.alt = p.caption;
    document.getElementById("lbCaption").textContent = p.caption;
    lbReset();
  }

  function bindLightbox() {
    lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    lbImgEl = document.getElementById("lbImg");

    document.getElementById("lbClose").addEventListener("click", closeLightbox);
    document.getElementById("lbPrev").addEventListener("click", function () {
      openLightbox(lbIndex - 1);
    });
    document.getElementById("lbNext").addEventListener("click", function () {
      openLightbox(lbIndex + 1);
    });
    // 点击遮罩空白处关闭（不落在图片/按钮上）
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    // 键盘：ESC 关闭，← → 切换
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") openLightbox(lbIndex - 1);
      else if (e.key === "ArrowRight") openLightbox(lbIndex + 1);
    });

    /* ── 放大查看 ── */
    // 单击切换 1x ↔ 2x，双击复原
    lbImgEl.addEventListener("click", function () {
      if (lbDragMoved) { lbDragMoved = false; return; }
      if (lbClickTimer) {
        clearTimeout(lbClickTimer); lbClickTimer = null;
        lbReset();
        return;
      }
      lbClickTimer = setTimeout(function () {
        lbClickTimer = null;
        lbZoom(lbScale > 1 ? 0.5 : 2);
      }, 250);
    });
    // 滚轮缩放（1x ~ 4x）
    lbImgEl.addEventListener("wheel", function (e) {
      e.preventDefault();
      lbZoom(e.deltaY < 0 ? 1.15 : 0.87);
    }, { passive: false });
    // 按住拖动平移（放大后）
    lbImgEl.addEventListener("mousedown", function (e) {
      if (lbScale <= 1) return;
      lbDragging = true; lbDragMoved = false;
      lbDragSX = e.clientX; lbDragSY = e.clientY;
      lbDragTX = lbTx; lbDragTY = lbTy;
      lbImgEl.classList.add("dragging");
      lbImgEl.style.cursor = "grabbing";
      e.preventDefault();
    });
    document.addEventListener("mousemove", function (e) {
      if (!lbDragging) return;
      var dx = e.clientX - lbDragSX, dy = e.clientY - lbDragSY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) lbDragMoved = true;
      lbTx = lbDragTX + dx;
      lbTy = lbDragTY + dy;
      lbApply();
    });
    document.addEventListener("mouseup", function () {
      if (!lbDragging) return;
      lbDragging = false;
      lbImgEl.classList.remove("dragging");
      lbApply();
    });
  }

  /* ─────────── 3. 留言板（本地保存） ─────────── */
  var STORAGE_KEY = "baisha_messages";
  var messages = [];

  function loadMessages() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      messages = raw ? JSON.parse(raw) : [];
    } catch (e) {
      messages = [];
    }
  }

  function saveMessages() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) { /* 隐私模式等场景下忽略 */ }
  }

  function renderMessages() {
    var list = document.getElementById("msgList");
    if (!list) return;

    if (messages.length === 0) {
      list.innerHTML = '<div class="msg-empty">📭 留言板还空着，快来贴上第一张留言条吧</div>';
      return;
    }

    list.innerHTML = messages.map(function (m) {
      return (
        '<div class="msg-card reveal">' +
          '<span class="m-time">' + escapeHtml(m.time) + '</span>' +
          '<span class="m-name">' + escapeHtml(m.name) + '</span>' +
          '<p>' + escapeHtml(m.text) + '</p>' +
        '</div>'
      );
    }).join("");

    // 让新留言渐显
    requestAnimationFrame(function () {
      list.querySelectorAll(".msg-card.reveal").forEach(function (el) {
        el.classList.add("visible");
      });
    });
  }

  function bindMessageForm() {
    var form = document.getElementById("msgForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("msgName").value.trim();
      var text = document.getElementById("msgText").value.trim();
      if (!name || !text) return;

      var now = new Date();
      var pad = function (n) { return n < 10 ? "0" + n : n; };
      var time = now.getFullYear() + "-" + pad(now.getMonth() + 1) + "-" + pad(now.getDate());

      messages.unshift({ name: name, text: text, time: time });
      saveMessages();
      renderMessages();

      form.reset();
    });
  }

  /* ─────────── 3. 大门 / 病区 切换 ─────────── */
  var WARD_SECTIONS = ["patients", "photos", "messages"];

  function unlockSection(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add("unlocked");
  }

  function lockAllSections() {
    WARD_SECTIONS.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.classList.remove("unlocked");
    });
  }

  function scrollToSection(id) {
    var el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  /* 进入病区：每次入院都从头开始参观 */
  function enterWard(e) {
    e.preventDefault();
    document.body.classList.remove("at-gate");
    document.body.classList.add("entered");
    lockAllSections();
    unlockSection("patients");
    scrollToSection("patients");
  }

  function backToGate(e) {
    if (e) e.preventDefault();
    document.body.classList.remove("entered");
    document.body.classList.add("at-gate");
    lockAllSections();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* 下一区按钮：收起当前区，解锁并跳往下一区 */
  function bindNextButtons() {
    document.querySelectorAll(".next-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-next");
        if (target) {
          var cur = btn.closest("section");
          if (cur) cur.classList.remove("unlocked");
          unlockSection(target);
          scrollToSection(target);
        }
      });
    });

    // 「探视完毕，返回大门」按钮
    document.querySelectorAll('[data-gate="true"]').forEach(function (btn) {
      btn.addEventListener("click", backToGate);
    });
  }

  /* 导航栏：正常跳转，点到的区自动解锁 */
  function bindNav() {
    document.querySelectorAll(".topbar .nav a").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        if (link.classList.contains("back-to-gate")) {
          backToGate(e);
          return;
        }
        var target = link.getAttribute("href").slice(1);
        if (WARD_SECTIONS.indexOf(target) === -1) return;
        unlockSection(target);
        scrollToSection(target);
      });
    });
  }

  /* ─────────── 4. 页面切换过渡（总览 ↔ 详情页） ─────────── */
  function bindPageTransitions() {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented) return;                       // 站内已有逻辑的链接（enter-btn 等）不拦截
      var link = e.target.closest ? e.target.closest("a[href]") : null;
      if (!link) return;
      var href = link.getAttribute("href") || "";
      if (href.indexOf(".html") === -1) return;             // 只处理跨页面跳转（锚点导航不受影响）
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;  // 新标签页打开等操作不拦截
      e.preventDefault();
      document.body.classList.add("page-leave");
      setTimeout(function () { window.location.href = href; }, 400);
    });
  }

  /* ─────────── 5. 滚动渐显 ─────────── */
  function initReveal() {
    var targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach(function (el) { observer.observe(el); });
  }

  /* 从详情页返回（index.html#patients）时，自动入院并定位到对应病区 */
  function restoreFromHash() {
    var h = location.hash.slice(1);
    if (!h || WARD_SECTIONS.indexOf(h) === -1) return;
    document.body.classList.remove("at-gate");
    document.body.classList.add("entered");
    lockAllSections();
    unlockSection(h);
  }

  /* ─────────── 启动 ─────────── */
  renderDecors();
  renderPatients();
  renderPhotoWall();
  bindLightbox();
  bindPageTransitions();
  loadMessages();
  renderMessages();
  bindMessageForm();
  restoreFromHash();

  var enterBtn = document.querySelector(".enter-btn");
  if (enterBtn) enterBtn.addEventListener("click", enterWard);

  document.querySelectorAll(".back-to-gate").forEach(function (link) {
    link.addEventListener("click", backToGate);
  });

  bindNextButtons();
  bindNav();
  initReveal();
})();

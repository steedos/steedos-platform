/**
 * Steedos Mobile Bridge - Capacitor 原生能力桥接
 *
 * 此脚本作为 Steedos client.js 自动加载到 H5 页面中，
 * 检测 Capacitor 原生环境并提供推送注册、通知跳转、文件上传/下载等能力。
 * 项目方只需安装此 Steedos package 即可获得移动端能力。
 */
(function () {
  'use strict';

  function boot() {
    var Capacitor = window.Capacitor;
    if (!Capacitor || !Capacitor.isNativePlatform || !Capacitor.isNativePlatform()) {
      // Android WebView 中 native-bridge.js 由 MainActivity 注入，可能还没加载完
      // androidBridge 是原生端注入的 JS interface，存在说明在 Android WebView 中
      if (window.androidBridge && !window.__mobileBridgeRetryCount) {
        window.__mobileBridgeRetryCount = 0;
      }
      if (window.androidBridge && window.__mobileBridgeRetryCount < 10) {
        window.__mobileBridgeRetryCount++;
        console.log('[MobileBridge] Waiting for Capacitor bridge injection, retry ' + window.__mobileBridgeRetryCount);
        setTimeout(boot, 200);
        return;
      }
      console.log('[MobileBridge] Not in Capacitor native environment, skipping.');
      return;
    }

  var Plugins = Capacitor.Plugins || {};
  console.log('[MobileBridge] Capacitor native detected, platform:', Capacitor.getPlatform());

  // ============ 推送通知 ============

  /**
   * 上报推送设备 token 到 Steedos 服务端
   * 调用 Moleculer action: push-notifications.register
   */
  function registerPushDevice(token) {
    var platform = Capacitor.getPlatform(); // 'ios' | 'android'
    var provider = 'fcm'; // @capacitor/push-notifications 使用 FCM (Android) / APNs via FCM (iOS)

    fetch(window.location.origin + '/service/api/push-notifications/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ device_id: token, platform: platform, provider: provider })
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.error) {
          console.warn('[MobileBridge] Device register error:', data.error);
        } else {
          console.log('[MobileBridge] Push device registered:', data._id);
        }
      })
      .catch(function (e) {
        console.error('[MobileBridge] Push device register failed:', e);
      });
  }

  /**
   * 注销推送设备（登出时调用）
   * 调用 Moleculer action: push-notifications.unregister
   */
  function unregisterPushDevice() {
    var token = localStorage.getItem('push_token');
    if (!token) return;

    fetch(window.location.origin + '/service/api/push-notifications/unregister', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ device_id: token })
    }).then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.error) {
          console.warn('[MobileBridge] Device unregister error:', data.error);
        } else {
          console.log('[MobileBridge] Push device unregistered');
        }
      })
      .catch(function (e) { console.error('[MobileBridge] Unregister error:', e); });
  }

  function initPushNotifications() {
    var PushNotifications = Plugins.PushNotifications;
    if (!PushNotifications) {
      console.warn('[MobileBridge] PushNotifications plugin not available');
      return;
    }

    PushNotifications.requestPermissions().then(function (permission) {
      if (permission.receive !== 'granted') {
        console.warn('[MobileBridge] Push permission denied');
        return;
      }
      PushNotifications.register();
    }).catch(function (e) {
      console.error('[MobileBridge] Push permission error:', e);
    });

    PushNotifications.addListener('registration', function (token) {
      console.log('[MobileBridge] Push token:', token.value);
      localStorage.setItem('push_token', token.value);
      registerPushDevice(token.value);
    });

    PushNotifications.addListener('registrationError', function (error) {
      console.error('[MobileBridge] Push registration error:', error);
    });

    // 前台收到通知
    PushNotifications.addListener('pushNotificationReceived', function (notification) {
      console.log('[MobileBridge] Foreground notification:', notification);
      // 可在此显示应用内提示
    });

    // 用户点击通知 → 跳转到指定 URL
    PushNotifications.addListener('pushNotificationActionPerformed', function (action) {
      console.log('[MobileBridge] Notification action:', JSON.stringify(action));
      var data = action.notification && action.notification.data;
      if (!data) return;

      // 优先使用 url 字段跳转
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // 使用 related_to 字段构建跳转 URL
      if (data.related_to) {
        try {
          var related = typeof data.related_to === 'string' ? JSON.parse(data.related_to) : data.related_to;
          if (related.o && related.ids && related.ids.length > 0) {
            window.location.href = window.location.origin + '/app/' + related.o + '/view/' + related.ids[0];
            return;
          }
        } catch (e) {
          console.error('[MobileBridge] Parse related_to error:', e);
        }
      }
    });
  }

  // ============ 文件上传/下载 ============

  function pickFile() {
    var FilePicker = Plugins.FilePicker;
    if (!FilePicker) return Promise.resolve(null);
    return FilePicker.pickFiles({ multiple: false, readData: true })
      .then(function (result) { return result.files[0]; })
      .catch(function (e) { console.error('[MobileBridge] File pick error:', e); return null; });
  }

  function takePhoto() {
    var Camera = Plugins.Camera;
    if (!Camera) return Promise.resolve(null);
    return Camera.getPhoto({
      quality: 80, allowEditing: false, resultType: 'base64', source: 'CAMERA'
    }).then(function (image) {
      return {
        data: image.base64String,
        mimeType: 'image/' + image.format,
        name: 'photo_' + Date.now() + '.' + image.format
      };
    }).catch(function (e) { console.error('[MobileBridge] Camera error:', e); return null; });
  }

  function pickImage() {
    var Camera = Plugins.Camera;
    if (!Camera) return Promise.resolve(null);
    return Camera.getPhoto({
      quality: 80, allowEditing: false, resultType: 'base64', source: 'PHOTOS'
    }).then(function (image) {
      return {
        data: image.base64String,
        mimeType: 'image/' + image.format,
        name: 'image_' + Date.now() + '.' + image.format
      };
    }).catch(function (e) { console.error('[MobileBridge] Pick image error:', e); return null; });
  }

  function downloadFile(url, fileName) {
    var Filesystem = Plugins.Filesystem;
    if (!Filesystem) return Promise.resolve(null);
    return fetch(url)
      .then(function (response) { return response.blob(); })
      .then(function (blob) {
        return new Promise(function (resolve, reject) {
          var reader = new FileReader();
          reader.onload = function () {
            var base64Data = reader.result.split(',')[1];
            Filesystem.writeFile({
              path: 'Downloads/' + fileName,
              data: base64Data,
              directory: 'DOCUMENTS',
              recursive: true
            }).then(function (savedFile) {
              var SharePlugin = Plugins.Share;
              if (SharePlugin) SharePlugin.share({ title: fileName, url: savedFile.uri });
              resolve(savedFile);
            }).catch(reject);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      })
      .catch(function (e) { console.error('[MobileBridge] Download error:', e); return null; });
  }

  // ============ 服务器切换 ============

  var STORAGE_KEY = 'steedos_urls';

  function getLocalUrl() {
    var platform = Capacitor.getPlatform();
    if (platform === 'ios') return 'capacitor://localhost/index.html?manual=1';
    return 'http://localhost/index.html?manual=1';
  }

  function getSavedUrls() {
    // 优先从 cookie 读取（跨域共享）
    var match = document.cookie.match(new RegExp('(?:^|;\\s*)' + STORAGE_KEY + '=([^;]*)'));
    if (match) {
      try {
        var urls = JSON.parse(decodeURIComponent(match[1]));
        if (Array.isArray(urls) && urls.length > 0) return urls;
      } catch (e) {}
    }
    // fallback: localStorage（同域可读）
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch (e) { return []; }
  }

  function saveUrlsFromBridge(urls) {
    var value = encodeURIComponent(JSON.stringify(urls));
    document.cookie = STORAGE_KEY + '=' + value + ';path=/;max-age=31536000;SameSite=None';
  }

  function switchServer() {
    window.location.href = getLocalUrl();
  }

  // 微信小程序风格：下拉页面露出深色服务器切换面板
  (function () {
    var startY = null;
    var pulling = false;
    var panel = null;
    var safeTop = (Capacitor.getPlatform() === 'android') ? 24 : (parseInt(getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)')) || 0);
    var headerHeight = 64 + safeTop;
    var panelHeight = window.innerHeight - headerHeight;
    var maxPull = panelHeight;
    var opened = false;
    var handle = null;

    function getUrlsForPanel() {
      var urls = getSavedUrls();
      // 确保当前地址在列表中
      var current = window.location.origin;
      if (urls.indexOf(current) === -1) urls.unshift(current);
      return urls;
    }

    function createPanel() {
      if (panel) return;

      panel = document.createElement('div');
      panel.id = '__steedos_server_panel';
      // 挂在 html 上，不受 body transform 影响
      panel.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:' + headerHeight + 'px;z-index:1;' +
        'background:linear-gradient(180deg,#1a1a2e 0%,#16213e 100%);display:flex;flex-direction:column;align-items:center;' +
        'justify-content:center;padding:0 16px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'transform:translateY(-100%);';

      var urls = getUrlsForPanel();
      var currentUrl = window.location.origin;

      // 上方弹性空间，把内容推到中间
      var html = '<div style="width:100%;max-width:400px;">';

      // 标题
      html += '<div style="text-align:center;margin-bottom:14px;">' +
        '<span style="font-size:15px;font-weight:600;color:rgba(255,255,255,0.85);">切换服务器</span></div>';

      // URL 输入框 + 打开按钮
      html += '<div style="display:flex;gap:8px;margin-bottom:14px;">' +
        '<input id="__steedos_url_input" type="url" placeholder="输入服务器地址" ' +
        'style="flex:1;height:38px;border-radius:8px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.08);' +
        'color:#fff;padding:0 12px;font-size:16px;outline:none;-webkit-appearance:none;" />' +
        '<button id="__steedos_url_go" style="height:38px;padding:0 16px;border-radius:8px;border:none;' +
        'background:#3b82f6;color:#fff;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;">打开</button>' +
        '</div>';

      // 历史地址列表
      if (urls.length > 0) {
        html += '<div style="margin-bottom:6px;"><span style="font-size:11px;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.5px;">历史地址</span></div>';
        urls.forEach(function (url) {
          var isCurrent = currentUrl === url || url.indexOf(currentUrl) === 0 || currentUrl.indexOf(url) === 0;
          var bg = isCurrent ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)';
          var border = isCurrent ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)';
          html += '<div class="__steedos_server_item" data-url="' + url + '" style="display:flex;align-items:center;' +
            'padding:10px 12px;margin-bottom:6px;border-radius:8px;background:' + bg + ';border:' + border + ';cursor:pointer;">' +
            '<span style="flex:1;font-size:13px;color:rgba(255,255,255,0.8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + url + '</span>' +
            (isCurrent ? '<span style="font-size:10px;color:#3b82f6;margin-left:6px;flex-shrink:0;">当前</span>' : '') +
            '<span class="__steedos_remove_url" data-url="' + url + '" style="margin-left:8px;color:rgba(255,255,255,0.2);font-size:14px;cursor:pointer;flex-shrink:0;padding:0 2px;">✕</span>' +
            '</div>';
        });
      }

      html += '</div>';
      panel.innerHTML = html;

      // 拉手指示条 — 独立元素，z-index:3 高于 body(2)，固定在 body 顶部上方
      handle = document.createElement('div');
      handle.id = '__steedos_handle';
      handle.style.cssText = 'position:fixed;left:0;right:0;top:0;z-index:3;text-align:center;padding:8px 0;' +
        'pointer-events:none;transform:translateY(-20px);';
      handle.innerHTML = '<div style="width:40px;height:5px;border-radius:3px;background:rgba(255,255,255,0.5);margin:0 auto;"></div>';
      document.documentElement.appendChild(handle);

      // 输入框预填
      var input = panel.querySelector('#__steedos_url_input');
      if (urls.length > 0) input.value = urls[0];

      // 打开按钮
      panel.querySelector('#__steedos_url_go').addEventListener('click', function (e) {
        e.stopPropagation();
        var url = input.value.trim();
        if (!url) return;
        if (url.indexOf('http') !== 0) url = 'https://' + url;
        var saved = getSavedUrls().filter(function (u) { return u !== url; });
        saved.unshift(url);
        saveUrlsFromBridge(saved.slice(0, 10));
        window.location.href = url;
      });

      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { e.preventDefault(); panel.querySelector('#__steedos_url_go').click(); }
      });

      // 点击跳转
      panel.querySelectorAll('.__steedos_server_item').forEach(function (el) {
        el.addEventListener('click', function (e) {
          if (e.target.classList.contains('__steedos_remove_url')) return;
          e.stopPropagation();
          var url = el.getAttribute('data-url');
          if (url) window.location.href = url;
        });
      });

      // 删除
      panel.querySelectorAll('.__steedos_remove_url').forEach(function (el) {
        el.addEventListener('click', function (e) {
          e.stopPropagation();
          var url = el.getAttribute('data-url');
          var saved = getSavedUrls().filter(function (u) { return u !== url; });
          saveUrlsFromBridge(saved);
          removePanel();
          createPanel();
        });
      });

      panel.addEventListener('touchmove', function (e) { e.stopPropagation(); }, { passive: false });

      // 挂到 <html> 上，不受 body transform 影响
      document.documentElement.appendChild(panel);

      document.body.style.position = 'relative';
      document.body.style.zIndex = '2';
      var bodyBg = getComputedStyle(document.body).backgroundColor;
      if (!bodyBg || bodyBg === 'rgba(0, 0, 0, 0)' || bodyBg === 'transparent') {
        document.body.style.background = '#fff';
      }
    }

    function removePanel() {
      if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
      panel = null;
      if (handle && handle.parentNode) handle.parentNode.removeChild(handle);
      handle = null;
      document.body.style.position = '';
      document.body.style.zIndex = '';
    }

    var panelHeaderStyle = null;

    function setHeaderPadding(enabled) {
      if (enabled) {
        // 删除覆盖样式，恢复默认
        if (panelHeaderStyle && panelHeaderStyle.parentNode) {
          panelHeaderStyle.parentNode.removeChild(panelHeaderStyle);
          panelHeaderStyle = null;
        }
      } else {
        // 注入覆盖样式，去掉 safe area
        if (!panelHeaderStyle) {
          panelHeaderStyle = document.createElement('style');
          panelHeaderStyle.textContent =
            '.steedos-header-container-line-one { height: 64px !important; padding-top: 0 !important; }';
          document.head.appendChild(panelHeaderStyle);
        }
      }
    }

    function closePanel() {
      // 面板向上滑出 + body 回到原位
      if (panel) {
        panel.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
        panel.style.transform = 'translateY(-100%)';
      }
      if (handle) { handle.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)'; handle.style.transform = 'translateY(-20px)'; }
      document.body.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
      document.body.style.transform = '';
      document.body.style.boxShadow = '';
      setHeaderPadding(true);
      opened = false;
      if (closePushCleanup) { closePushCleanup(); closePushCleanup = null; }
      setTimeout(function () {
        removePanel();
        document.body.style.transition = '';
      }, 300);
    }

    // 面板打开后，注册关闭交互（点击 + 向上推）
    var closePushCleanup = null;

    function registerCloseHandlers() {
      var pushStartY = null;
      var pushActive = false;

      var touchStartHandler = function (e) {
        if (panel && panel.contains(e.target)) return;
        pushStartY = e.touches[0].clientY;
        pushActive = false;
      };

      var touchMoveHandler = function (e) {
        if (pushStartY === null) return;
        var deltaY = e.touches[0].clientY - pushStartY;
        if (deltaY < -10) pushActive = true;
        if (pushActive) {
          var offset = Math.max(0, maxPull + deltaY);
          document.body.style.transform = 'translateY(' + offset + 'px)';
          document.body.style.transition = 'none';
          if (handle) { handle.style.transform = 'translateY(' + (offset - 20) + 'px)'; handle.style.transition = 'none'; }
          // 面板也跟着动：从0开始往上移
          if (panel) {
            var panelOffset = offset - maxPull;
            panel.style.transform = 'translateY(' + panelOffset + 'px)';
            panel.style.transition = 'none';
          }
          e.preventDefault();
        }
      };

      var touchEndHandler = function () {
        if (pushActive) {
          var transform = document.body.style.transform;
          var m = transform && transform.match(/translateY\(([\d.]+)px\)/);
          var offset = m ? parseFloat(m[1]) : maxPull;
          if (offset < maxPull * 0.7) {
            // 关闭
            closePanel();
          } else {
            // 弹回打开状态
            document.body.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
            document.body.style.transform = 'translateY(' + maxPull + 'px)';
            if (handle) { handle.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)'; handle.style.transform = 'translateY(' + (maxPull - 20) + 'px)'; }
            if (panel) {
              panel.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
              panel.style.transform = '';
            }
            // 不 cleanup — 保持 handler 可以再次操作
          }
        } else if (pushStartY !== null) {
          // 纯点击 → 收回
          closePanel();
        }
        pushStartY = null;
        pushActive = false;
      };

      var clickHandler = function (e) {
        if (panel && !panel.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          closePanel();
        }
      };

      closePushCleanup = function () {
        document.removeEventListener('touchstart', touchStartHandler, true);
        document.removeEventListener('touchmove', touchMoveHandler, true);
        document.removeEventListener('touchend', touchEndHandler, true);
        document.removeEventListener('click', clickHandler, true);
      };

      document.addEventListener('touchstart', touchStartHandler, true);
      document.addEventListener('touchmove', touchMoveHandler, true);
      document.addEventListener('touchend', touchEndHandler, true);
      document.addEventListener('click', clickHandler, true);
    }

    function isAtTop() {
      return window.scrollY <= 0 && document.documentElement.scrollTop <= 0;
    }

    var isAndroidPlatform = Capacitor.getPlatform() === 'android';

    document.addEventListener('touchstart', function (e) {
      if (opened) return;
      if (e.touches.length === 1 && isAtTop()) {
        // Android 上只允许从 header 区域开始下拉，避免正常滚动误触
        if (isAndroidPlatform && e.touches[0].clientY > headerHeight) {
          startY = null;
          return;
        }
        startY = e.touches[0].clientY;
        pulling = false;
      } else {
        startY = null;
      }
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (startY === null || opened) return;
      var deltaY = e.touches[0].clientY - startY;

      if (deltaY < 0) {
        if (pulling) {
          document.body.style.transform = '';
          document.body.style.transition = '';
          removePanel();
          pulling = false;
        }
        startY = null;
        return;
      }

      // 未开始拉动时，如果页面已经不在顶部了（用户在向上滚动后反弹），取消
      if (!pulling && !isAtTop()) {
        startY = null;
        return;
      }

      if (deltaY > 30 && !pulling) {
        pulling = true;
        createPanel();
      }

      if (pulling) {
        var offset = Math.min(deltaY * 0.85, maxPull);
        document.body.style.transform = 'translateY(' + offset + 'px)';
        document.body.style.transition = 'none';
        document.body.style.boxShadow = '0 -4px 30px rgba(0,0,0,0.3)';
        if (handle) { handle.style.transform = 'translateY(' + (offset - 20) + 'px)'; handle.style.transition = 'none'; }
        // 面板从上方滑入：初始在 -100%，随拉动逐渐到 0
        if (panel) {
          var panelProgress = offset / maxPull;
          var panelTranslate = -100 + (panelProgress * 100);
          panel.style.transform = 'translateY(' + panelTranslate + '%)';
          panel.style.transition = 'none';
        }
        e.preventDefault();
      }
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!pulling) { startY = null; return; }

      var currentOffset = 0;
      var transform = document.body.style.transform;
      var match = transform && transform.match(/translateY\(([\d.]+)px\)/);
      if (match) currentOffset = parseFloat(match[1]);

      if (currentOffset >= maxPull * 0.5) {
        document.body.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
        document.body.style.transform = 'translateY(' + maxPull + 'px)';
        if (handle) { handle.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)'; handle.style.transform = 'translateY(' + (maxPull - 20) + 'px)'; }
        if (panel) {
          panel.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
          panel.style.transform = '';
        }
        opened = true;
        setHeaderPadding(false);
        setTimeout(registerCloseHandlers, 350);
      } else {
        // 面板滑回上方
        if (panel) {
          panel.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
          panel.style.transform = 'translateY(-100%)';
        }
        if (handle) { handle.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)'; handle.style.transform = 'translateY(-20px)'; }
        document.body.style.transition = 'transform 0.3s cubic-bezier(0.2,0,0,1)';
        document.body.style.transform = '';
        document.body.style.boxShadow = '';
        setTimeout(function () {
          removePanel();
          document.body.style.transition = '';
        }, 300);
      }

      startY = null;
      pulling = false;
    }, { passive: true });
  })();

  // ============ 暴露全局 Bridge ============

  window.SteedosBridge = {
    pickFile: pickFile,
    takePhoto: takePhoto,
    pickImage: pickImage,
    downloadFile: downloadFile,
    getPushToken: function () { return localStorage.getItem('push_token'); },
    registerPushDevice: function () { var t = localStorage.getItem('push_token'); if (t) registerPushDevice(t); },
    unregisterPushDevice: unregisterPushDevice,
    isNative: function () { return true; },
    getPlatform: function () { return Capacitor.getPlatform(); },
    switchServer: switchServer,
  };

  // ============ 拦截链接点击和 window.open（防止跳转外部浏览器）============

  function isFileUrl(url) {
    return /\/(api\/files|cfs\/files|api\/v6\/files|s3\/|api\/v1\/files)\//i.test(url) ||
      /[?&]download=true/i.test(url) ||
      /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|zip|rar|png|jpg|jpeg|gif|csv|txt|json)(\?|$)/i.test(url);
  }

  function getFileName(url) {
    var name = url.split('/').pop().split('?')[0] || ('file_' + Date.now());
    try { name = decodeURIComponent(name); } catch (e) {}
    return name;
  }

  // 拦截 <a target="_blank"> 点击
  document.addEventListener('click', function (e) {
    var anchor = e.target.closest ? e.target.closest('a') : null;
    if (!anchor) return;

    var href = anchor.getAttribute('href');
    if (!href || href === '#') return;

    var target = anchor.getAttribute('target');
    var fullUrl = new URL(href, window.location.href).href;

    // 文件下载链接 → 原生下载
    if (isFileUrl(fullUrl)) {
      e.preventDefault();
      e.stopPropagation();
      console.log('[MobileBridge] Intercepted file download link:', fullUrl);
      downloadFile(fullUrl, getFileName(fullUrl));
      return;
    }

    // target="_blank" → 在当前 WebView 内导航
    if (target === '_blank') {
      e.preventDefault();
      e.stopPropagation();
      console.log('[MobileBridge] Intercepted _blank link, navigating in WebView:', fullUrl);
      window.location.href = fullUrl;
    }
  }, true);

  // 拦截 window.open
  var _originalOpen = window.open;
  window.open = function (url) {
    if (!url) return null;
    var urlStr = String(url);
    if (isFileUrl(urlStr)) {
      console.log('[MobileBridge] Intercepted window.open file download:', urlStr);
      downloadFile(urlStr, getFileName(urlStr));
      return null;
    }
    console.log('[MobileBridge] Intercepted window.open, navigating in WebView:', urlStr);
    window.location.href = urlStr;
    return null;
  };

  // ============ 角标清除 ============

  function clearBadge() {
    var PushNotifications = Plugins.PushNotifications;
    if (!PushNotifications) return;
    // 清除通知中心所有已送达通知
    if (PushNotifications.removeAllDeliveredNotifications) {
      PushNotifications.removeAllDeliveredNotifications();
    }
    // 设置角标为 0
    var Badge = Plugins.Badge;
    if (Badge && Badge.clear) {
      Badge.clear();
    }
    // iOS 备选方案：通过 PushNotifications 设置 badge
    if (PushNotifications.setBadgeCount) {
      PushNotifications.setBadgeCount({ count: 0 });
    }
    console.log('[MobileBridge] Badge cleared');
  }

  // App 启动时清除
  clearBadge();

  // App 从后台回到前台时清除
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      clearBadge();
    }
  });

  // Capacitor App plugin 的 resume 事件（更可靠）
  var AppPlugin = Plugins.App;
  if (AppPlugin && AppPlugin.addListener) {
    AppPlugin.addListener('appStateChange', function (state) {
      if (state.isActive) {
        clearBadge();
      }
    });
  }

  // ============ 状态栏 ============

  function initStatusBar() {
    console.log('[MobileBridge] initStatusBar called');
    var isAndroid = Capacitor.getPlatform() === 'android';
    var isIOS = Capacitor.getPlatform() === 'ios';

    if (isIOS) {
      // iOS: 通过 StatusBar 插件设置 overlay 模式
      var StatusBar = Plugins.StatusBar;
      if (StatusBar) {
        StatusBar.setOverlaysWebView({ overlay: true });
        StatusBar.setStyle({ style: 'LIGHT' });
      }

      // 确保 viewport 有 viewport-fit=cover
      var viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        var content = viewport.getAttribute('content') || '';
        if (content.indexOf('viewport-fit') === -1) {
          viewport.setAttribute('content', content + ', viewport-fit=cover');
        }
      } else {
        viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover';
        document.head.appendChild(viewport);
      }

      // iOS 用 env(safe-area-inset-top) 给 header 加 padding
      var safeAreaTop = 'env(safe-area-inset-top)';
      var style = document.createElement('style');
      style.textContent =
        '.steedos-header-container-line-one { height: calc(64px + ' + safeAreaTop + ') !important; padding-top: ' + safeAreaTop + ' !important; }' +
        '.creator-content-wrapper { margin-top: calc(64px + ' + safeAreaTop + ') !important; }' +
        '.antd-Modal-content { padding-top: calc(24px + ' + safeAreaTop + ') !important; }' +
        '.antd-Modal-close { top: ' + safeAreaTop + ' !important; }' +
        '.steedos-instance-detail-wrapper { height: calc(100vh - 64px - ' + safeAreaTop + ') !important; height: calc(100dvh - 64px - ' + safeAreaTop + ') !important; }' +
        '.ant-notification, .antd-Toast-wrap { top: ' + safeAreaTop + ' !important; padding-top: ' + safeAreaTop + ' !important; }' +
        '.ant-notification-notice, .antd-Toast-notice { margin-top: 8px !important; }' +
        '[data-radix-popper-content-wrapper] { max-width: calc(100vw - 16px) !important; }' +
        '[data-radix-popper-content-wrapper] [role="dialog"] { max-width: calc(100vw - 16px) !important; overflow-x: hidden !important; }' +
        '[data-radix-popper-content-wrapper] .tb-inbox { width: calc(100vw - 16px) !important; max-width: calc(100vw - 16px) !important; }' +
        '.ant-drawer .ant-drawer-content { padding-top: ' + safeAreaTop + ' !important; }' +
        '.antd-Drawer-footer { padding-left: 30px !important; padding-right: 30px !important; justify-content: space-between !important; }' +
        '.steedos-approve-submit-button { order: 2 !important; }' +
        '.steedos-approve-close-button { order: 1 !important; }';
      document.head.appendChild(style);
    }

    // Android: WebView 已通过 overlay=false 避开状态栏，不再给 header 额外加顶部空白
    if (isAndroid) {
      var StatusBar = Plugins.StatusBar;
      if (StatusBar) {
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setStyle({ style: 'LIGHT' });
      }

      var style = document.createElement('style');
      style.textContent =
        '.steedos-header-container-line-one { height: 64px !important; padding-top: 0 !important; }' +
        '.creator-content-wrapper { margin-top: 64px !important; }' +
        '.antd-Modal-content { padding-top: 24px !important; }' +
        '.antd-Modal-close { top: 0 !important; }' +
        '.steedos-instance-detail-wrapper { height: calc(100vh - 64px) !important; height: calc(100dvh - 64px) !important; }' +
        '.ant-notification, .antd-Toast-wrap { top: 0 !important; padding-top: 0 !important; }' +
        '.ant-notification-notice, .antd-Toast-notice { margin-top: 8px !important; }' +
        '[data-radix-popper-content-wrapper] { max-width: calc(100vw - 16px) !important; }' +
        '[data-radix-popper-content-wrapper] [role="dialog"] { max-width: calc(100vw - 16px) !important; overflow-x: hidden !important; }' +
        '[data-radix-popper-content-wrapper] .tb-inbox { width: calc(100vw - 16px) !important; max-width: calc(100vw - 16px) !important; }' +
        '.ant-drawer .ant-drawer-content { padding-top: 0 !important; }' +
        '.antd-Drawer-footer { padding-left: 30px !important; padding-right: 30px !important; justify-content: space-between !important; }' +
        '.steedos-approve-submit-button { order: 2 !important; }' +
        '.steedos-approve-close-button { order: 1 !important; }';
      document.head.appendChild(style);
    }
    console.log('[MobileBridge] StatusBar initialized, platform:', Capacitor.getPlatform());
  }

  function initIOSLoginSafeArea() {
    if (Capacitor.getPlatform() !== 'ios') return;

    var style = document.createElement('style');
    style.textContent =
      '@supports (padding-top: env(safe-area-inset-top)) {' +
        '.steedos-auth-card { margin-top: max(env(safe-area-inset-top), 28px) !important; }' +
      '}';
    document.head.appendChild(style);
  }

  function initMobileRadixPopoverLayout() {
    var platform = Capacitor.getPlatform();
    if (platform !== 'ios' && platform !== 'android') return;

    function getTranslateY(transform) {
      if (!transform || transform === 'none') return 0;
      var matrix3d = transform.match(/^matrix3d\((.+)\)$/);
      if (matrix3d) {
        var values3d = matrix3d[1].split(',').map(parseFloat);
        return values3d[13] || 0;
      }
      var matrix = transform.match(/^matrix\((.+)\)$/);
      if (matrix) {
        var values = matrix[1].split(',').map(parseFloat);
        return values[5] || 0;
      }
      var translate = transform.match(/translate(?:3d)?\([^,]+,\s*([-\d.]+)px/);
      return translate ? parseFloat(translate[1]) : 0;
    }

    function fixRadixPopovers() {
      var wrappers = document.querySelectorAll('[data-radix-popper-content-wrapper]');
      wrappers.forEach(function (wrapper) {
        var inbox = wrapper.querySelector('.tb-inbox');
        if (!inbox) return;

        var computed = window.getComputedStyle(wrapper);
        var y = getTranslateY(computed.transform || wrapper.style.transform);
        setStyle(wrapper, 'left', '0px');
        setStyle(wrapper, 'right', 'auto');
        setStyle(wrapper, 'maxWidth', 'calc(100vw - 16px)');
        setStyle(wrapper, 'transform', 'translate(8px, ' + y + 'px)');
        setCssVar(wrapper, '--radix-popper-available-width', 'calc(100vw - 16px)');

        setStyle(inbox, 'width', 'calc(100vw - 16px)');
        setStyle(inbox, 'maxWidth', 'calc(100vw - 16px)');
        setStyle(inbox, 'overflowX', 'hidden');
      });
    }

    function setStyle(element, prop, value) {
      if (element.style[prop] !== value) {
        element.style[prop] = value;
      }
    }

    function setCssVar(element, prop, value) {
      if (element.style.getPropertyValue(prop) !== value) {
        element.style.setProperty(prop, value);
      }
    }

    var scheduled = false;
    function scheduleFix() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        fixRadixPopovers();
      });
    }

    scheduleFix();
    document.addEventListener('click', function () { setTimeout(scheduleFix, 0); }, true);
    window.addEventListener('resize', scheduleFix);
    new MutationObserver(scheduleFix).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }

  // ============ 初始化 ============

  initStatusBar();
  initIOSLoginSafeArea();
  initMobileRadixPopoverLayout();
  initPushNotifications();
  console.log('[MobileBridge] Bridge initialized. window.SteedosBridge available.');

  }
  boot();
})();

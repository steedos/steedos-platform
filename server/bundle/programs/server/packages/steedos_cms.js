(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ReactiveVar = Package['reactive-var'].ReactiveVar;
var ReactiveDict = Package['reactive-dict'].ReactiveDict;
var Random = Package.random.Random;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var check = Package.check.check;
var Match = Package.check.Match;
var DDPRateLimiter = Package['ddp-rate-limiter'].DDPRateLimiter;
var _ = Package.underscore._;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var Blaze = Package.blaze.Blaze;
var UI = Package.blaze.UI;
var Handlebars = Package.blaze.Handlebars;
var WebApp = Package.webapp.WebApp;
var WebAppInternals = Package.webapp.WebAppInternals;
var main = Package.webapp.main;
var JsonRoutes = Package['simple:json-routes'].JsonRoutes;
var RestMiddleware = Package['simple:json-routes'].RestMiddleware;
var Restivus = Package['nimble:restivus'].Restivus;
var SimpleSchema = Package['aldeed:simple-schema'].SimpleSchema;
var MongoObject = Package['aldeed:simple-schema'].MongoObject;
var Tabular = Package['aldeed:tabular'].Tabular;
var CollectionHooks = Package['matb33:collection-hooks'].CollectionHooks;
var BlazeLayout = Package['kadira:blaze-layout'].BlazeLayout;
var FlowRouter = Package['kadira:flow-router'].FlowRouter;
var Template = Package['meteorhacks:ssr'].Template;
var SSR = Package['meteorhacks:ssr'].SSR;
var Selector = Package['steedos:base'].Selector;
var Steedos = Package['steedos:base'].Steedos;
var AjaxCollection = Package['steedos:base'].AjaxCollection;
var SteedosDataManager = Package['steedos:base'].SteedosDataManager;
var SteedosOffice = Package['steedos:base'].SteedosOffice;
var billingManager = Package['steedos:base'].billingManager;
var SubsManager = Package['meteorhacks:subs-manager'].SubsManager;
var CFDataManager = Package['steedos:autoform'].CFDataManager;
var Markdown = Package['perak:markdown'].Markdown;
var _i18n = Package['universe:i18n']._i18n;
var i18n = Package['universe:i18n'].i18n;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var HTML = Package.htmljs.HTML;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var FS = Package['steedos:cfs-base-package'].FS;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;

/* Package-scope variables */
var __coffeescriptShare;

(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cms/i18n/en.i18n.json.js                                                                        //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Package['universe:i18n'].i18n.addTranslations('en','',{"Steedos CMS":"Blogs","cms_home":"Home","cms_label_dashboard":"Dashboard","cms_button_new":"Compose","cms_button_edit":"Edit Post","cms_button_admin":"Settings","cms_button_back":"Back","cms_button_remove":"Remove Post","cms_sites":"Blogs","cms_sites_name":"Name","cms_sites_id":"ID","cms_sites_description":"Description","cms_sites_anonymous":"Anonymous View","cms_sites_cover":"Cover Image","cms_sites_avatar":"Avatar Image","cms_sites_order":"Order No","cms_sites_layout":"Customize Layout","cms_sites_owner":"Owner","cms_sites_admins":"Collaborators","cms_sites_modified":"Modified","cms_sites_type":"Type","cms_sites_space":"Space","cms_sites_created_by":"Created By","cms_sites_created":"Created","cms_sites_modified_by":"Modified By","cms_sites_preview":"Preview","cms_sites_edit":"Edit Site","cms_sites_remove":"Remove Site","cms_sites_back":"Back","cms_posts":"Posts","cms_posts_title":"Title","cms_posts_body":"Summary","cms_posts_htmlBody":"Body","cms_posts_id":"ID","cms_posts_space":"Space","cms_posts_site":"Site","cms_posts_featured":"Featured","cms_posts_attachments":"Attachments","cms_posts_category":"Category","cms_posts_admins":"Collaborators","cms_posts_created_by":"Created By","cms_posts_created":"Created","cms_posts_modified_by":"Modified By","cms_posts_modified":"Modified","cms_posts_author":"Author ID","cms_posts_author_name":"Author","cms_posts_summary":"Summary","cms_posts_images":"Images","cms_posts_postDate":"Publish Date","cms_posts_view_count":"%s viewers","cms_post_error_remove_reads_fail":"Remove post read history failed","cms_posts_none":"No posts found.","cms_posts_new":"New post","cms_categories":"Categories","cms_categories_name":"Name","cms_categories_id":"ID","cms_categories_description":"Description","cms_categories_parent":"Parent","cms_categories_users":"Authorized Users","cms_categories_order":"Order No","cms_categories_admins":"Collaborators","cms_categories_modified":"Modified","cms_categories_space":"Space","cms_categories_featured":"Featured","cms_categories_menu":"Desplayed in the menu","cms_categories_error_has_children":"Can't remove because it has children","cms_categories_error_has_posts":"Can't remove because it has posts","cms_categories_new":"New Category","cms_sites_error_login_required":"Login required","cms_sites_error_site_owner_only":"Site owner only","cms_sites_error_has_categories":"Can't remove because it has categories","cms_sites_error_has_posts":"Can't remove because it has posts","cms_sites_visibility":"Visibility","cms_sites_visibility_private":"Private(Only the site's collaborators and owner can see.)","cms_sites_visibility_team":"Team(All users in the space can see.)","cms_sites_visibility_public":"Public(Will publish to the internet and everyone can see.)","cms_welcome_title":"Welcome to Steedos Blog","cms_welcome_body":"You can read and share posts with your colleagues, Space admins can manage categories.<br/>Currently you do not have any sites, you can click <a href = \"javasxript:void(0)\" class = \"btn-new-site\">here</a> to create a new site.","cms_categories_edit":"Edit Category","cms_categories_remove":"Delete Category","cms_categories_error_deny_set_self":"Can't set the Parent property to current categorie.","cms_post_error_remove_unreads_fail":"Remove post unread record failed","cms_posts_members":"Publish To","cms_posts_members_organizations":"Authorized organizations(Articles is visible to these organizations)","cms_posts_members_users":"Authorized user(Articles is visible to these users)","cms_posts_visibility":"Visibility","cms_posts_visibility_private":"Private(Only the post's author and published members can see and only the site's collaborators can edit it.)","cms_posts_visibility_space":"Space(All users in the space can see, but only the site's collaborators can edit it)","cms_error_login_required":"Login required","cms_new_site":"New Site","CMS_attachment_download":"Download","CMS_attachment_view":"Preview","cms_site_empty_help":"No articles available","cms_home_mobile_top_title":"Please select a site"});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cms/i18n/zh-CN.i18n.json.js                                                                     //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
Package['universe:i18n'].i18n.addTranslations('zh-CN','',{"Steedos CMS":"信息发布","cms_home":"首页","cms_label_dashboard":"导航","cms_button_new":"发布","cms_button_edit":"编辑文章","cms_button_admin":"设置","cms_button_back":"返回","cms_button_remove":"删除文章","cms_sites_preview":"预览","cms_sites_edit":"编辑站点","cms_sites_remove":"删除站点","cms_sites_back":"返回","cms_post_error_remove_reads_fail":"删除文章阅读记录失败","cms_posts_none":"没有文章.","cms_posts_new":"新建文章","cms_categories_menu":"在菜单中显示","cms_categories_new":"新建栏目","cms_categories_error_has_children":"该栏目下有子栏目，不能删除","cms_categories_error_has_posts":"该栏目下有文章，不能删除","cms_sites_error_login_required":"请先登录","cms_sites_error_site_owner_only":"所有者才能进行修改","cms_sites_error_has_categories":"该站点下有栏目，不能删除","cms_sites_error_has_posts":"该站点下有文章，不能删除","cms_error_required_members_value":"授权查看不能为空","cms_sites_is_needto_limit_unit":"文章只能发布到单位","cms_sites_visibility":"可见性","cms_sites_visibility_private":"私有（此站点不公开，只有站点成员可见。）","cms_sites_visibility_team":"工作区（此工作区的所有用户都可见，但只有站点成员可以编辑。）","cms_sites_visibility_public":"公开（发布到互联网，所有人都可见，但只有站点成员可以编辑。）","cms_welcome_title":"欢迎使用知识库应用","cms_welcome_body":"您可以在这里与同事快速分享各类信息，管理员可以维护信息分类。<br/>目前您还没有任何站点，可以点击<a href = \"javasxript:void(0)\" class = \"btn-new-site\">这里</a>来新建一个站点。","cms_categories_edit":"编辑栏目","cms_categories_remove":"删除栏目","cms_categories_error_deny_set_self":"不能修改上级栏目为当前栏目自身","cms_post_error_remove_unreads_fail":"删除文章未读记录失败","cms_posts_visibility":"可见性","cms_posts_visibility_private":"私有（文章作者及发布对象可见，且只有作者或站点成员可以编辑。）","cms_posts_visibility_space":"工作区（此工作区的所有用户都可见，但只有作者或站点成员可以编辑。）","cms_error_login_required":"请先登录","cms_new_site":"新建站点","CMS_attachment_download":"下载","CMS_attachment_view":"查看","cms_site_empty_help":"没有文章","cms_home_mobile_top_title":"请选择站点"});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cms/server/routes/site.coffee                                                                   //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
var Cookies, renderSite;
Cookies = Npm.require("cookies");

Template.registerHelpers = function (dict) {
  return _.each(dict, function (v, k) {
    return Template.registerHelper(k, v);
  });
};

Template.registerHelpers({
  CategoryId: function () {
    return Template.instance().data.params.categoryId;
  },
  CategoryActive: function (c) {
    var categoryId;
    categoryId = Template.instance().data.params.categoryId;

    if (categoryId === c) {
      return "active";
    }
  },
  Category: function () {
    var categoryId;
    categoryId = Template.instance().data.params.categoryId;

    if (categoryId) {
      return db.cms_categories.findOne(categoryId);
    }
  },
  ParentCategory: function () {
    var c, categoryId;
    categoryId = Template.instance().data.params.categoryId;

    if (categoryId) {
      c = db.cms_categories.findOne(categoryId);

      if (c != null ? c.parent : void 0) {
        return db.cms_categories.findOne(c.parent);
      }
    }
  },
  SubCategories: function (parent) {
    var siteId;

    if (parent === "root") {
      siteId = Template.instance().data.params.siteId;
      return db.cms_categories.find({
        site: siteId,
        parent: null
      }, {
        sort: {
          order: 1,
          created: 1
        }
      });
    } else {
      return db.cms_categories.find({
        parent: parent
      }, {
        sort: {
          order: 1,
          created: 1
        }
      });
    }
  },
  SubCategoriesCount: function (parent) {
    var siteId;

    if (parent === "root") {
      siteId = Template.instance().data.params.siteId;
      return db.cms_categories.find({
        site: siteId,
        parent: null
      }).count();
    } else {
      return db.cms_categories.find({
        parent: parent
      }).count();
    }
  },
  fromNow: function (value) {
    return moment(value).fromNow();
  },
  DateFormat: function (value, formatString) {
    if (!formatString) {
      formatString = "YYYY-MM-DD";
    }

    return moment(value).format(formatString);
  },
  Posts: function (categoryId, limit, skip) {
    var siteId;

    if (!limit) {
      limit = 5;
    }

    skip = 0;
    siteId = Template.instance().data.params.siteId;

    if (!siteId) {
      return [];
    }

    if (categoryId) {
      return db.cms_posts.find({
        site: siteId,
        category: categoryId
      }, {
        sort: {
          postDate: -1
        },
        limit: limit,
        skip: skip
      });
    } else {
      return db.cms_posts.find({
        site: siteId
      }, {
        sort: {
          postDate: -1
        },
        limit: limit,
        skip: skip
      });
    }
  },
  PostsCount: function (categoryId) {
    var siteId;
    siteId = Template.instance().data.params.siteId;

    if (!siteId) {
      return 0;
    }

    if (categoryId) {
      return db.cms_posts.find({
        site: siteId,
        category: categoryId
      }).count();
    } else {
      return db.cms_posts.find({
        site: siteId
      }).count();
    }
  },
  PostSummary: function () {
    if (this.body) {
      return this.body.substring(0, 400);
    }
  },
  _: function (key) {
    return TAPi18n.__(key);
  },
  RecentPosts: function (categoryId, limit, skip) {
    var cat, children, siteId;

    if (!limit) {
      limit = 5;
    }

    skip = 0;
    siteId = Template.instance().data.params.siteId;
    cat = db.cms_categories.findOne(categoryId);

    if (!cat) {
      return [];
    }

    children = cat.calculateChildren();
    children.push(categoryId);
    return db.cms_posts.find({
      site: siteId,
      category: {
        $in: children
      }
    }, {
      sort: {
        postDate: -1
      },
      limit: limit,
      skip: skip
    });
  },
  Markdown: function (text) {
    if (text) {
      return Spacebars.SafeString(Markdown(text));
    }
  },
  SafeString: function (text) {
    if (text) {
      return Spacebars.SafeString(text);
    }
  },
  PostAttachmentUrl: function (attachment, isPreview) {
    var url;
    url = Meteor.absoluteUrl("api/files/files/" + attachment._id + "/" + attachment.original.name);

    if (!(typeof isPreview === "boolean" && isPreview) && !Steedos.isMobile()) {
      url += "?download=true";
    }

    return url;
  },
  IsImageAttachment: function (attachment) {
    var ref, type;
    type = attachment != null ? (ref = attachment.original) != null ? ref.type : void 0 : void 0;
    return type != null ? type.startsWith("image/") : void 0;
  },
  IsHtmlAttachment: function (attachment) {
    var ref;
    return (attachment != null ? (ref = attachment.original) != null ? ref.type : void 0 : void 0) === "text/html";
  },
  isProduction: function () {
    return Meteor.isProduction;
  }
});
Template.registerHelper('Post', function () {
  var postId;
  postId = Template.instance().data.params.postId;

  if (postId) {
    return db.cms_posts.findOne({
      _id: postId
    });
  }
});
Template.registerHelper('images', function (postId) {
  var fileIds, postAttachments;

  if (postId) {
    postAttachments = Creator.getCollection("cms_files").find({
      'parent.o': 'cms_posts',
      'parent.ids': postId
    }, {
      fields: {
        _id: 1,
        versions: 1
      }
    }).fetch();
    fileIds = [];
    postAttachments.forEach(function (att) {
      if ((att != null ? att.versions.length : void 0) > 0) {
        return fileIds.push(att.versions[0]);
      }
    });
    return _.pluck(cfs.files.find({
      _id: {
        $in: fileIds
      },
      "original.type": /image\//
    }, {
      sort: {
        "uploadedAt": -1
      }
    }).fetch(), '_id');
  }
});
Template.registerHelper('Attachments', function () {
  var fileIds, postAttachments, postId;
  postId = Template.instance().data.params.postId;

  if (postId) {
    postAttachments = Creator.getCollection("cms_files").find({
      'parent.o': 'cms_posts',
      'parent.ids': postId
    }, {
      fields: {
        _id: 1,
        versions: 1
      }
    }).fetch();
    fileIds = [];
    postAttachments.forEach(function (att) {
      if ((att != null ? att.versions.length : void 0) > 0) {
        return fileIds.push(att.versions[0]);
      }
    });
    return cfs.files.find({
      _id: {
        $in: fileIds
      }
    }, {
      sort: {
        "uploadedAt": -1
      }
    }).fetch();
  }
});
Template.registerHelper('SiteId', function () {
  var siteId;
  siteId = Template.instance().data.params.siteId;
  return siteId;
});
Template.registerHelper('Site', function () {
  var siteId;
  siteId = Template.instance().data.params.siteId;

  if (siteId) {
    return db.cms_sites.findOne({
      _id: siteId
    });
  }
});
Template.registerHelper('IndexPage', function () {
  var data;
  data = Template.instance().data;

  if (!data.params) {
    return false;
  } else if (data.params.categoryId) {
    return false;
  } else if (data.params.postId) {
    return false;
  } else {
    return true;
  }
});
Template.registerHelper('TagPage', function () {
  var tag;
  tag = Template.instance().data.params.tag;

  if (tag) {
    return true;
  }

  return false;
});
Template.registerHelper('Tag', function () {
  var tag;
  tag = Template.instance().data.params.tag;
  return tag;
});
Template.registerHelper('PostPage', function () {
  var postId;
  postId = Template.instance().data.params.postId;

  if (postId) {
    return true;
  }

  return false;
});
Template.registerHelper('equals', function (a, b) {
  return a === b;
});

renderSite = function (req, res, next) {
  var authToken, cookies, hashedToken, html, isPostIncSuc, layout, postId, site, templateName, user, userId;
  site = db.cms_sites.findOne({
    _id: req.params.siteId
  });

  if (!site) {
    res.writeHead(404);
    res.end("Site not found");
    return;
  }

  cookies = new Cookies(req, res);
  userId = cookies.get("X-User-Id");
  authToken = cookies.get("X-Auth-Token");

  if (userId && authToken) {
    hashedToken = Accounts._hashLoginToken(authToken);
    user = Meteor.users.findOne({
      _id: userId,
      "services.resume.loginTokens.hashedToken": hashedToken
    });
  }

  if ((site != null ? site.visibility : void 0) !== "public") {
    res.writeHead(401);
    res.end("Access Denied");
    return;
  }

  templateName = 'site_theme_' + site.theme;
  layout = site.layout;

  if (!layout) {
    layout = Assets.getText('themes/default.html');
  }

  SSR.compileTemplate('site_theme_' + site.theme, layout);
  postId = req.params.postId;

  if (postId) {
    isPostIncSuc = db.cms_posts.direct.update({
      _id: postId
    }, {
      $inc: {
        viewCount: 1
      }
    });

    if (!isPostIncSuc) {
      console.error("addPostViewer while previewing site post Failed. cms_posts.update.$inc ..." + postId);
    }
  }

  html = SSR.render(templateName, {
    params: req.params
  });
  return res.end(html);
};

JsonRoutes.add("get", "/site/:siteId", renderSite);
JsonRoutes.add("get", "/site/:siteId/c/:categoryId", renderSite);
JsonRoutes.add("get", "/site/:siteId/p/:postId", renderSite);
JsonRoutes.add("get", "/site/:siteId/t/:tag", renderSite);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/steedos_cms/server/routes/avatar.coffee                                                                 //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
__coffeescriptShare = typeof __coffeescriptShare === 'object' ? __coffeescriptShare : {}; var share = __coffeescriptShare;
Meteor.startup(function () {
  return JsonRoutes.add('get', '/avatar/cms_sites/:siteId', function (req, res, next) {
    var color, colors, initials, position, ref, ref1, reqModifiedHeader, site, svg, username;
    site = db.cms_sites.findOne(req.params.siteId);

    if (!site) {
      res.writeHead(401);
      res.end();
      return;
    }

    if (site.avatar) {
      res.setHeader("Location", Meteor.absoluteUrl("api/files/avatars/" + site.avatar));
      res.writeHead(302);
      res.end();
      return;
    }

    username = site.name;

    if (!username) {
      username = "";
    }

    res.setHeader('Content-Disposition', 'inline');

    if (typeof file === "undefined" || file === null) {
      res.setHeader('content-type', 'image/svg+xml');
      res.setHeader('cache-control', 'public, max-age=31536000');
      colors = ['#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFC107', '#FF9800', '#FF5722', '#795548', '#9E9E9E', '#607D8B'];
      position = username.length % colors.length;
      color = colors[position];
      initials = '';

      if (username.charCodeAt(0) > 255) {
        initials = username.substr(0, 1);
      } else {
        initials = username.substr(0, 2);
      }

      initials = initials.toUpperCase();
      svg = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg xmlns=\"http://www.w3.org/2000/svg\" pointer-events=\"none\" width=\"50\" height=\"50\" style=\"width: 50px; height: 50px; background-color: " + color + ";\">\n    <text text-anchor=\"middle\" y=\"50%\" x=\"50%\" dy=\"0.36em\" pointer-events=\"auto\" fill=\"#ffffff\" font-family=\"Helvetica, Arial, Lucida Grande, sans-serif\" style=\"font-weight: 400; font-size: 28px;\">\n        " + initials + "\n    </text>\n</svg>";
      res.write(svg);
      res.end();
      return;
    }

    reqModifiedHeader = req.headers["if-modified-since"];

    if (reqModifiedHeader != null) {
      if (reqModifiedHeader === ((ref = site.modified) != null ? ref.toUTCString() : void 0)) {
        res.setHeader('Last-Modified', reqModifiedHeader);
        res.writeHead(304);
        res.end();
        return;
      }
    }

    res.setHeader('Last-Modified', ((ref1 = site.modified) != null ? ref1.toUTCString() : void 0) || new Date().toUTCString());
    res.setHeader('content-type', 'image/jpeg');
    res.setHeader('Content-Length', file.length);
    file.readStream.pipe(res);
  });
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
Package._define("steedos:cms");

})();

//# sourceURL=meteor://💻app/packages/steedos_cms.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2F2YXRhci5jb2ZmZWUiXSwibmFtZXMiOlsiQ29va2llcyIsInJlbmRlclNpdGUiLCJOcG0iLCJyZXF1aXJlIiwiVGVtcGxhdGUiLCJyZWdpc3RlckhlbHBlcnMiLCJkaWN0IiwiXyIsImVhY2giLCJ2IiwiayIsInJlZ2lzdGVySGVscGVyIiwiQ2F0ZWdvcnlJZCIsImluc3RhbmNlIiwiZGF0YSIsInBhcmFtcyIsImNhdGVnb3J5SWQiLCJDYXRlZ29yeUFjdGl2ZSIsImMiLCJDYXRlZ29yeSIsImRiIiwiY21zX2NhdGVnb3JpZXMiLCJmaW5kT25lIiwiUGFyZW50Q2F0ZWdvcnkiLCJwYXJlbnQiLCJTdWJDYXRlZ29yaWVzIiwic2l0ZUlkIiwiZmluZCIsInNpdGUiLCJzb3J0Iiwib3JkZXIiLCJjcmVhdGVkIiwiU3ViQ2F0ZWdvcmllc0NvdW50IiwiY291bnQiLCJmcm9tTm93IiwidmFsdWUiLCJtb21lbnQiLCJEYXRlRm9ybWF0IiwiZm9ybWF0U3RyaW5nIiwiZm9ybWF0IiwiUG9zdHMiLCJsaW1pdCIsInNraXAiLCJjbXNfcG9zdHMiLCJjYXRlZ29yeSIsInBvc3REYXRlIiwiUG9zdHNDb3VudCIsIlBvc3RTdW1tYXJ5IiwiYm9keSIsInN1YnN0cmluZyIsImtleSIsIlRBUGkxOG4iLCJfXyIsIlJlY2VudFBvc3RzIiwiY2F0IiwiY2hpbGRyZW4iLCJjYWxjdWxhdGVDaGlsZHJlbiIsInB1c2giLCIkaW4iLCJNYXJrZG93biIsInRleHQiLCJTcGFjZWJhcnMiLCJTYWZlU3RyaW5nIiwiUG9zdEF0dGFjaG1lbnRVcmwiLCJhdHRhY2htZW50IiwiaXNQcmV2aWV3IiwidXJsIiwiTWV0ZW9yIiwiYWJzb2x1dGVVcmwiLCJfaWQiLCJvcmlnaW5hbCIsIm5hbWUiLCJTdGVlZG9zIiwiaXNNb2JpbGUiLCJJc0ltYWdlQXR0YWNobWVudCIsInJlZiIsInR5cGUiLCJzdGFydHNXaXRoIiwiSXNIdG1sQXR0YWNobWVudCIsImlzUHJvZHVjdGlvbiIsInBvc3RJZCIsImZpbGVJZHMiLCJwb3N0QXR0YWNobWVudHMiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpZWxkcyIsInZlcnNpb25zIiwiZmV0Y2giLCJmb3JFYWNoIiwiYXR0IiwibGVuZ3RoIiwicGx1Y2siLCJjZnMiLCJmaWxlcyIsImNtc19zaXRlcyIsInRhZyIsImEiLCJiIiwicmVxIiwicmVzIiwibmV4dCIsImF1dGhUb2tlbiIsImNvb2tpZXMiLCJoYXNoZWRUb2tlbiIsImh0bWwiLCJpc1Bvc3RJbmNTdWMiLCJsYXlvdXQiLCJ0ZW1wbGF0ZU5hbWUiLCJ1c2VyIiwidXNlcklkIiwid3JpdGVIZWFkIiwiZW5kIiwiZ2V0IiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJ1c2VycyIsInZpc2liaWxpdHkiLCJ0aGVtZSIsIkFzc2V0cyIsImdldFRleHQiLCJTU1IiLCJjb21waWxlVGVtcGxhdGUiLCJkaXJlY3QiLCJ1cGRhdGUiLCIkaW5jIiwidmlld0NvdW50IiwiY29uc29sZSIsImVycm9yIiwicmVuZGVyIiwiSnNvblJvdXRlcyIsImFkZCIsInN0YXJ0dXAiLCJjb2xvciIsImNvbG9ycyIsImluaXRpYWxzIiwicG9zaXRpb24iLCJyZWYxIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZSIsImF2YXRhciIsInNldEhlYWRlciIsImZpbGUiLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ3cml0ZSIsImhlYWRlcnMiLCJtb2RpZmllZCIsInRvVVRDU3RyaW5nIiwiRGF0ZSIsInJl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SUFBSixHQUFXRCxXQUFYLEVBQS9EO0FBQ0FsRCxRQUFJMEMsU0FBSixDQUFjLGNBQWQsRUFBOEIsWUFBOUI7QUFDQTFDLFFBQUkwQyxTQUFKLENBQWMsZ0JBQWQsRUFBZ0NDLEtBQUtwRCxNQUFyQztBQUVBb0QsU0FBS1MsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUJyRCxHQUFyQjtBQTdESixJQ0RGO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDb29raWVzID0gTnBtLnJlcXVpcmUoXCJjb29raWVzXCIpXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcnMgPSAoZGljdCkgLT5cclxuXHRfLmVhY2ggZGljdCwgKHYsIGspLT5cclxuXHRcdFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyIGssIHZcclxuXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcnNcclxuXHJcblxyXG5cdENhdGVnb3J5SWQ6ICgpLT5cclxuXHRcdHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWRcclxuXHJcblx0Q2F0ZWdvcnlBY3RpdmU6IChjKS0+XHJcblx0XHRjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkXHJcblx0XHRpZiBjYXRlZ29yeUlkID09IGNcclxuXHRcdFx0cmV0dXJuIFwiYWN0aXZlXCJcclxuXHJcblx0Q2F0ZWdvcnk6ICgpLT5cclxuXHRcdGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWRcclxuXHRcdGlmIGNhdGVnb3J5SWRcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZClcclxuXHJcblx0UGFyZW50Q2F0ZWdvcnk6ICgpLT5cclxuXHRcdGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWRcclxuXHRcdGlmIGNhdGVnb3J5SWRcclxuXHRcdFx0YyA9IGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZClcclxuXHRcdFx0aWYgYz8ucGFyZW50XHJcblx0XHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoYy5wYXJlbnQpXHJcblxyXG5cdFN1YkNhdGVnb3JpZXM6IChwYXJlbnQpLT5cclxuXHRcdGlmIHBhcmVudCA9PSBcInJvb3RcIlxyXG5cdFx0XHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7c2l0ZTogc2l0ZUlkLCBwYXJlbnQ6IG51bGx9LCB7c29ydDoge29yZGVyOiAxLCBjcmVhdGVkOiAxfX0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtwYXJlbnQ6IHBhcmVudH0sIHtzb3J0OiB7b3JkZXI6IDEsIGNyZWF0ZWQ6IDF9fSlcclxuXHRcdFx0XHJcblx0U3ViQ2F0ZWdvcmllc0NvdW50OiAocGFyZW50KS0+XHJcblx0XHRpZiBwYXJlbnQgPT0gXCJyb290XCJcclxuXHRcdFx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe3NpdGU6IHNpdGVJZCwgcGFyZW50OiBudWxsfSkuY291bnQoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7cGFyZW50OiBwYXJlbnR9KS5jb3VudCgpXHJcblxyXG5cdGZyb21Ob3c6ICh2YWx1ZSktPlxyXG5cdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkuZnJvbU5vdygpXHJcblxyXG5cdERhdGVGb3JtYXQ6ICh2YWx1ZSwgZm9ybWF0U3RyaW5nKSAtPlxyXG5cdFx0aWYgIWZvcm1hdFN0cmluZ1xyXG5cdFx0XHRmb3JtYXRTdHJpbmcgPSBcIllZWVktTU0tRERcIlxyXG5cdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkuZm9ybWF0KGZvcm1hdFN0cmluZylcclxuXHJcblx0UG9zdHM6IChjYXRlZ29yeUlkLCBsaW1pdCwgc2tpcCktPlxyXG5cdFx0aWYgIWxpbWl0IFxyXG5cdFx0XHRsaW1pdCA9IDVcclxuXHRcdHNraXAgPSAwXHJcblx0XHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxyXG5cdFx0aWYgIXNpdGVJZCBcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRpZiBjYXRlZ29yeUlkIFxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IGNhdGVnb3J5SWR9LCB7c29ydDoge3Bvc3REYXRlOiAtMX0sIGxpbWl0OiBsaW1pdCwgc2tpcDogc2tpcH0pXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7c2l0ZTogc2l0ZUlkfSwge3NvcnQ6IHtwb3N0RGF0ZTogLTF9LCBsaW1pdDogbGltaXQsIHNraXA6IHNraXB9KVxyXG5cclxuXHRQb3N0c0NvdW50OiAoY2F0ZWdvcnlJZCktPlxyXG5cdFx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcclxuXHRcdGlmICFzaXRlSWQgXHJcblx0XHRcdHJldHVybiAwXHJcblx0XHRpZiBjYXRlZ29yeUlkIFxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IGNhdGVnb3J5SWR9KS5jb3VudCgpXHJcblx0XHRlbHNlXHJcblx0XHRcdHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7c2l0ZTogc2l0ZUlkfSkuY291bnQoKVxyXG5cdCAgIFxyXG5cdFBvc3RTdW1tYXJ5OiAtPlxyXG5cdFx0aWYgdGhpcy5ib2R5XHJcblx0XHRcdHJldHVybiB0aGlzLmJvZHkuc3Vic3RyaW5nKDAsIDQwMClcclxuXHJcblx0XzogKGtleSkgLT5cclxuXHRcdHJldHVybiBUQVBpMThuLl9fIGtleVxyXG5cclxuXHRSZWNlbnRQb3N0czogKGNhdGVnb3J5SWQsIGxpbWl0LCBza2lwKS0+XHJcblx0XHRpZiAhbGltaXQgXHJcblx0XHRcdGxpbWl0ID0gNVxyXG5cdFx0c2tpcCA9IDBcclxuXHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXHJcblx0XHRjYXQgPSBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpXHJcblx0XHRpZiAhY2F0IFxyXG5cdFx0XHRyZXR1cm4gW11cclxuXHRcdGNoaWxkcmVuID0gY2F0LmNhbGN1bGF0ZUNoaWxkcmVuKCk7XHJcblx0XHRjaGlsZHJlbi5wdXNoKGNhdGVnb3J5SWQpXHJcblx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IHskaW46IGNoaWxkcmVufX0sIHtzb3J0OiB7cG9zdERhdGU6IC0xfSwgbGltaXQ6IGxpbWl0LCBza2lwOiBza2lwfSlcclxuXHJcblx0TWFya2Rvd246ICh0ZXh0KS0+XHJcblx0XHRpZiB0ZXh0XHJcblx0XHRcdHJldHVybiBTcGFjZWJhcnMuU2FmZVN0cmluZyhNYXJrZG93bih0ZXh0KSlcclxuXHJcblx0U2FmZVN0cmluZzogKHRleHQpLT5cclxuXHRcdGlmIHRleHRcclxuXHRcdFx0cmV0dXJuIFNwYWNlYmFycy5TYWZlU3RyaW5nKHRleHQpXHJcblxyXG5cdFBvc3RBdHRhY2htZW50VXJsOiAoYXR0YWNobWVudCxpc1ByZXZpZXcpLT4gXHJcblx0XHR1cmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvZmlsZXMvI3thdHRhY2htZW50Ll9pZH0vI3thdHRhY2htZW50Lm9yaWdpbmFsLm5hbWV9XCIpXHJcblx0XHRpZiAhKHR5cGVvZiBpc1ByZXZpZXcgPT0gXCJib29sZWFuXCIgYW5kIGlzUHJldmlldykgYW5kICFTdGVlZG9zLmlzTW9iaWxlKClcclxuXHRcdFx0dXJsICs9IFwiP2Rvd25sb2FkPXRydWVcIlxyXG5cdFx0cmV0dXJuIHVybFxyXG5cclxuXHRJc0ltYWdlQXR0YWNobWVudDogKGF0dGFjaG1lbnQpLT5cclxuXHRcdHR5cGUgPSBhdHRhY2htZW50Py5vcmlnaW5hbD8udHlwZVxyXG5cdFx0cmV0dXJuIHR5cGU/LnN0YXJ0c1dpdGgoXCJpbWFnZS9cIilcclxuXHJcblx0SXNIdG1sQXR0YWNobWVudDogKGF0dGFjaG1lbnQpLT5cclxuXHRcdHJldHVybiBhdHRhY2htZW50Py5vcmlnaW5hbD8udHlwZSA9PSBcInRleHQvaHRtbFwiXHJcblxyXG5cdGlzUHJvZHVjdGlvbjogKCktPlxyXG5cdFx0cmV0dXJuIE1ldGVvci5pc1Byb2R1Y3Rpb25cclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdQb3N0JywgLT5cclxuXHRwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZFxyXG5cdGlmIHBvc3RJZFxyXG5cdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kT25lKHtfaWQ6IHBvc3RJZH0pXHJcblxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ2ltYWdlcycsIChwb3N0SWQpLT5cclxuXHRpZiBwb3N0SWRcclxuXHRcdHBvc3RBdHRhY2htZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNtc19maWxlc1wiKS5maW5kKHsncGFyZW50Lm8nOiAnY21zX3Bvc3RzJywgJ3BhcmVudC5pZHMnOiBwb3N0SWR9LCB7ZmllbGRzOiB7X2lkOjEsIHZlcnNpb25zOiAxfX0pLmZldGNoKCk7XHJcblx0XHRmaWxlSWRzID0gW11cclxuXHRcdHBvc3RBdHRhY2htZW50cy5mb3JFYWNoIChhdHQpLT5cclxuXHRcdFx0aWYgYXR0Py52ZXJzaW9ucy5sZW5ndGggPiAwXHJcblx0XHRcdFx0ZmlsZUlkcy5wdXNoKGF0dC52ZXJzaW9uc1swXSlcclxuXHRcdHJldHVybiBfLnBsdWNrKGNmcy5maWxlcy5maW5kKHtfaWQ6IHskaW46IGZpbGVJZHN9LCBcIm9yaWdpbmFsLnR5cGVcIjogL2ltYWdlXFwvL30se3NvcnQ6IHtcInVwbG9hZGVkQXRcIjogLTF9fSkuZmV0Y2goKSwgJ19pZCcpXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnQXR0YWNobWVudHMnLCAoKS0+XHJcblx0cG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWRcclxuXHRpZiBwb3N0SWRcclxuXHRcdHBvc3RBdHRhY2htZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNtc19maWxlc1wiKS5maW5kKHsncGFyZW50Lm8nOiAnY21zX3Bvc3RzJywgJ3BhcmVudC5pZHMnOiBwb3N0SWR9LCB7ZmllbGRzOiB7X2lkOjEsIHZlcnNpb25zOiAxfX0pLmZldGNoKCk7XHJcblx0XHRmaWxlSWRzID0gW11cclxuXHRcdHBvc3RBdHRhY2htZW50cy5mb3JFYWNoIChhdHQpLT5cclxuXHRcdFx0aWYgYXR0Py52ZXJzaW9ucy5sZW5ndGggPiAwXHJcblx0XHRcdFx0ZmlsZUlkcy5wdXNoKGF0dC52ZXJzaW9uc1swXSlcclxuXHJcblx0XHRyZXR1cm4gY2ZzLmZpbGVzLmZpbmQoe19pZDogeyRpbjogZmlsZUlkc319LHtzb3J0OiB7XCJ1cGxvYWRlZEF0XCI6IC0xfX0pLmZldGNoKClcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdTaXRlSWQnLCAtPlxyXG5cdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXHJcblx0cmV0dXJuIHNpdGVJZFxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ1NpdGUnLCAtPlxyXG5cdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXHJcblx0aWYgc2l0ZUlkXHJcblx0XHRyZXR1cm4gZGIuY21zX3NpdGVzLmZpbmRPbmUoe19pZDogc2l0ZUlkfSlcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdJbmRleFBhZ2UnLCAtPlxyXG5cdGRhdGEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGFcclxuXHRpZiAhZGF0YS5wYXJhbXNcclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHRlbHNlIGlmIGRhdGEucGFyYW1zLmNhdGVnb3J5SWRcclxuXHRcdHJldHVybiBmYWxzZVxyXG5cdGVsc2UgaWYgZGF0YS5wYXJhbXMucG9zdElkXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHRlbHNlIFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdUYWdQYWdlJywgLT5cclxuXHR0YWcgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnRhZ1xyXG5cdGlmIHRhZ1xyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdUYWcnLCAtPlxyXG5cdHRhZyA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMudGFnXHJcblx0cmV0dXJuIHRhZ1xyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ1Bvc3RQYWdlJywgLT5cclxuXHRwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZFxyXG5cdGlmIHBvc3RJZFxyXG5cdFx0cmV0dXJuIHRydWVcclxuXHRyZXR1cm4gZmFsc2VcclxuXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnZXF1YWxzJywgKGEsIGIpLT5cclxuXHRyZXR1cm4gYSA9PSBiXHJcblxyXG5yZW5kZXJTaXRlID0gKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG5cdHNpdGUgPSBkYi5jbXNfc2l0ZXMuZmluZE9uZSh7X2lkOiByZXEucGFyYW1zLnNpdGVJZH0pXHJcblx0XHJcblx0aWYgIXNpdGVcclxuXHRcdHJlcy53cml0ZUhlYWQgNDA0XHJcblx0XHRyZXMuZW5kKFwiU2l0ZSBub3QgZm91bmRcIilcclxuXHRcdHJldHVyblxyXG5cclxuXHRjb29raWVzID0gbmV3IENvb2tpZXMoIHJlcSwgcmVzICk7XHJcblx0dXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIilcclxuXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxyXG5cclxuXHRpZiB1c2VySWQgYW5kIGF1dGhUb2tlblxyXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxyXG5cdFx0dXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lXHJcblx0XHRcdF9pZDogdXNlcklkLFxyXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxyXG5cclxuXHR1bmxlc3Mgc2l0ZT8udmlzaWJpbGl0eSA9PSBcInB1YmxpY1wiXHJcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxyXG5cdFx0cmVzLmVuZChcIkFjY2VzcyBEZW5pZWRcIilcclxuXHRcdHJldHVyblxyXG5cclxuXHR0ZW1wbGF0ZU5hbWUgPSAnc2l0ZV90aGVtZV8nICsgc2l0ZS50aGVtZVxyXG5cdGxheW91dCA9IHNpdGUubGF5b3V0XHJcblx0aWYgIWxheW91dFxyXG5cdFx0bGF5b3V0ID0gQXNzZXRzLmdldFRleHQoJ3RoZW1lcy9kZWZhdWx0Lmh0bWwnKVxyXG5cdFNTUi5jb21waWxlVGVtcGxhdGUoJ3NpdGVfdGhlbWVfJyArIHNpdGUudGhlbWUsIGxheW91dCk7XHJcblxyXG5cdHBvc3RJZCA9IHJlcS5wYXJhbXMucG9zdElkXHJcblx0aWYgcG9zdElkXHJcblx0XHRpc1Bvc3RJbmNTdWMgPSBkYi5jbXNfcG9zdHMuZGlyZWN0LnVwZGF0ZSB7XHJcblx0XHRcdF9pZDogcG9zdElkXHJcblx0XHR9LCAkaW5jOlxyXG5cdFx0XHR2aWV3Q291bnQ6IDFcclxuXHRcdHVubGVzcyBpc1Bvc3RJbmNTdWNcclxuXHRcdFx0Y29uc29sZS5lcnJvciBcImFkZFBvc3RWaWV3ZXIgd2hpbGUgcHJldmlld2luZyBzaXRlIHBvc3QgRmFpbGVkLiBjbXNfcG9zdHMudXBkYXRlLiRpbmMgLi4uI3twb3N0SWR9XCJcclxuXHJcblx0aHRtbCA9IFNTUi5yZW5kZXIgdGVtcGxhdGVOYW1lLCBcclxuXHRcdHBhcmFtczogcmVxLnBhcmFtc1xyXG5cclxuXHRyZXMuZW5kKGh0bWwpO1xyXG5cclxuIyBKc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWRcIiwgKHJlcSwgcmVzLCBuZXh0KS0+XHJcbiMgICByZXMuc3RhdHVzQ29kZSA9IDMwMjtcclxuIyAgIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBcIi4vcy9ob21lXCJcclxuIyAgIHJlcy5lbmQoKTtcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZFwiLCByZW5kZXJTaXRlICBcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC9jLzpjYXRlZ29yeUlkXCIsIHJlbmRlclNpdGUgIFxyXG5cclxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL3AvOnBvc3RJZFwiLCByZW5kZXJTaXRlICBcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC90Lzp0YWdcIiwgcmVuZGVyU2l0ZSAgIiwidmFyIENvb2tpZXMsIHJlbmRlclNpdGU7XG5cbkNvb2tpZXMgPSBOcG0ucmVxdWlyZShcImNvb2tpZXNcIik7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVycyA9IGZ1bmN0aW9uKGRpY3QpIHtcbiAgcmV0dXJuIF8uZWFjaChkaWN0LCBmdW5jdGlvbih2LCBrKSB7XG4gICAgcmV0dXJuIFRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKGssIHYpO1xuICB9KTtcbn07XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVycyh7XG4gIENhdGVnb3J5SWQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWQ7XG4gIH0sXG4gIENhdGVnb3J5QWN0aXZlOiBmdW5jdGlvbihjKSB7XG4gICAgdmFyIGNhdGVnb3J5SWQ7XG4gICAgY2F0ZWdvcnlJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZDtcbiAgICBpZiAoY2F0ZWdvcnlJZCA9PT0gYykge1xuICAgICAgcmV0dXJuIFwiYWN0aXZlXCI7XG4gICAgfVxuICB9LFxuICBDYXRlZ29yeTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGNhdGVnb3J5SWQ7XG4gICAgY2F0ZWdvcnlJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZDtcbiAgICBpZiAoY2F0ZWdvcnlJZCkge1xuICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZCk7XG4gICAgfVxuICB9LFxuICBQYXJlbnRDYXRlZ29yeTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIGMsIGNhdGVnb3J5SWQ7XG4gICAgY2F0ZWdvcnlJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZDtcbiAgICBpZiAoY2F0ZWdvcnlJZCkge1xuICAgICAgYyA9IGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZCk7XG4gICAgICBpZiAoYyAhPSBudWxsID8gYy5wYXJlbnQgOiB2b2lkIDApIHtcbiAgICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoYy5wYXJlbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgU3ViQ2F0ZWdvcmllczogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgdmFyIHNpdGVJZDtcbiAgICBpZiAocGFyZW50ID09PSBcInJvb3RcIikge1xuICAgICAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZCxcbiAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICB9LCB7XG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgICBjcmVhdGVkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7XG4gICAgICAgIHBhcmVudDogcGFyZW50XG4gICAgICB9LCB7XG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBvcmRlcjogMSxcbiAgICAgICAgICBjcmVhdGVkOiAxXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgU3ViQ2F0ZWdvcmllc0NvdW50OiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICB2YXIgc2l0ZUlkO1xuICAgIGlmIChwYXJlbnQgPT09IFwicm9vdFwiKSB7XG4gICAgICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkLFxuICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtcbiAgICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgfVxuICB9LFxuICBmcm9tTm93OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBtb21lbnQodmFsdWUpLmZyb21Ob3coKTtcbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24odmFsdWUsIGZvcm1hdFN0cmluZykge1xuICAgIGlmICghZm9ybWF0U3RyaW5nKSB7XG4gICAgICBmb3JtYXRTdHJpbmcgPSBcIllZWVktTU0tRERcIjtcbiAgICB9XG4gICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkuZm9ybWF0KGZvcm1hdFN0cmluZyk7XG4gIH0sXG4gIFBvc3RzOiBmdW5jdGlvbihjYXRlZ29yeUlkLCBsaW1pdCwgc2tpcCkge1xuICAgIHZhciBzaXRlSWQ7XG4gICAgaWYgKCFsaW1pdCkge1xuICAgICAgbGltaXQgPSA1O1xuICAgIH1cbiAgICBza2lwID0gMDtcbiAgICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgICBpZiAoIXNpdGVJZCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBpZiAoY2F0ZWdvcnlJZCkge1xuICAgICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkLFxuICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlJZFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgcG9zdERhdGU6IC0xXG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgICAgc2tpcDogc2tpcFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgcG9zdERhdGU6IC0xXG4gICAgICAgIH0sXG4gICAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgICAgc2tpcDogc2tpcFxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBQb3N0c0NvdW50OiBmdW5jdGlvbihjYXRlZ29yeUlkKSB7XG4gICAgdmFyIHNpdGVJZDtcbiAgICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgICBpZiAoIXNpdGVJZCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChjYXRlZ29yeUlkKSB7XG4gICAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWQsXG4gICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUlkXG4gICAgICB9KS5jb3VudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWRcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgfVxuICB9LFxuICBQb3N0U3VtbWFyeTogZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuYm9keSkge1xuICAgICAgcmV0dXJuIHRoaXMuYm9keS5zdWJzdHJpbmcoMCwgNDAwKTtcbiAgICB9XG4gIH0sXG4gIF86IGZ1bmN0aW9uKGtleSkge1xuICAgIHJldHVybiBUQVBpMThuLl9fKGtleSk7XG4gIH0sXG4gIFJlY2VudFBvc3RzOiBmdW5jdGlvbihjYXRlZ29yeUlkLCBsaW1pdCwgc2tpcCkge1xuICAgIHZhciBjYXQsIGNoaWxkcmVuLCBzaXRlSWQ7XG4gICAgaWYgKCFsaW1pdCkge1xuICAgICAgbGltaXQgPSA1O1xuICAgIH1cbiAgICBza2lwID0gMDtcbiAgICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgICBjYXQgPSBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpO1xuICAgIGlmICghY2F0KSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGNoaWxkcmVuID0gY2F0LmNhbGN1bGF0ZUNoaWxkcmVuKCk7XG4gICAgY2hpbGRyZW4ucHVzaChjYXRlZ29yeUlkKTtcbiAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe1xuICAgICAgc2l0ZTogc2l0ZUlkLFxuICAgICAgY2F0ZWdvcnk6IHtcbiAgICAgICAgJGluOiBjaGlsZHJlblxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgcG9zdERhdGU6IC0xXG4gICAgICB9LFxuICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgc2tpcDogc2tpcFxuICAgIH0pO1xuICB9LFxuICBNYXJrZG93bjogZnVuY3Rpb24odGV4dCkge1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICByZXR1cm4gU3BhY2ViYXJzLlNhZmVTdHJpbmcoTWFya2Rvd24odGV4dCkpO1xuICAgIH1cbiAgfSxcbiAgU2FmZVN0cmluZzogZnVuY3Rpb24odGV4dCkge1xuICAgIGlmICh0ZXh0KSB7XG4gICAgICByZXR1cm4gU3BhY2ViYXJzLlNhZmVTdHJpbmcodGV4dCk7XG4gICAgfVxuICB9LFxuICBQb3N0QXR0YWNobWVudFVybDogZnVuY3Rpb24oYXR0YWNobWVudCwgaXNQcmV2aWV3KSB7XG4gICAgdmFyIHVybDtcbiAgICB1cmwgPSBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvZmlsZXMvXCIgKyBhdHRhY2htZW50Ll9pZCArIFwiL1wiICsgYXR0YWNobWVudC5vcmlnaW5hbC5uYW1lKTtcbiAgICBpZiAoISh0eXBlb2YgaXNQcmV2aWV3ID09PSBcImJvb2xlYW5cIiAmJiBpc1ByZXZpZXcpICYmICFTdGVlZG9zLmlzTW9iaWxlKCkpIHtcbiAgICAgIHVybCArPSBcIj9kb3dubG9hZD10cnVlXCI7XG4gICAgfVxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIElzSW1hZ2VBdHRhY2htZW50OiBmdW5jdGlvbihhdHRhY2htZW50KSB7XG4gICAgdmFyIHJlZiwgdHlwZTtcbiAgICB0eXBlID0gYXR0YWNobWVudCAhPSBudWxsID8gKHJlZiA9IGF0dGFjaG1lbnQub3JpZ2luYWwpICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMCA6IHZvaWQgMDtcbiAgICByZXR1cm4gdHlwZSAhPSBudWxsID8gdHlwZS5zdGFydHNXaXRoKFwiaW1hZ2UvXCIpIDogdm9pZCAwO1xuICB9LFxuICBJc0h0bWxBdHRhY2htZW50OiBmdW5jdGlvbihhdHRhY2htZW50KSB7XG4gICAgdmFyIHJlZjtcbiAgICByZXR1cm4gKGF0dGFjaG1lbnQgIT0gbnVsbCA/IChyZWYgPSBhdHRhY2htZW50Lm9yaWdpbmFsKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDAgOiB2b2lkIDApID09PSBcInRleHQvaHRtbFwiO1xuICB9LFxuICBpc1Byb2R1Y3Rpb246IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBNZXRlb3IuaXNQcm9kdWN0aW9uO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1Bvc3QnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHBvc3RJZDtcbiAgcG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWQ7XG4gIGlmIChwb3N0SWQpIHtcbiAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBwb3N0SWRcbiAgICB9KTtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdpbWFnZXMnLCBmdW5jdGlvbihwb3N0SWQpIHtcbiAgdmFyIGZpbGVJZHMsIHBvc3RBdHRhY2htZW50cztcbiAgaWYgKHBvc3RJZCkge1xuICAgIHBvc3RBdHRhY2htZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNtc19maWxlc1wiKS5maW5kKHtcbiAgICAgICdwYXJlbnQubyc6ICdjbXNfcG9zdHMnLFxuICAgICAgJ3BhcmVudC5pZHMnOiBwb3N0SWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICB2ZXJzaW9uczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgZmlsZUlkcyA9IFtdO1xuICAgIHBvc3RBdHRhY2htZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgaWYgKChhdHQgIT0gbnVsbCA/IGF0dC52ZXJzaW9ucy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgICByZXR1cm4gZmlsZUlkcy5wdXNoKGF0dC52ZXJzaW9uc1swXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIF8ucGx1Y2soY2ZzLmZpbGVzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogZmlsZUlkc1xuICAgICAgfSxcbiAgICAgIFwib3JpZ2luYWwudHlwZVwiOiAvaW1hZ2VcXC8vXG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBcInVwbG9hZGVkQXRcIjogLTFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpLCAnX2lkJyk7XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignQXR0YWNobWVudHMnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGZpbGVJZHMsIHBvc3RBdHRhY2htZW50cywgcG9zdElkO1xuICBwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZDtcbiAgaWYgKHBvc3RJZCkge1xuICAgIHBvc3RBdHRhY2htZW50cyA9IENyZWF0b3IuZ2V0Q29sbGVjdGlvbihcImNtc19maWxlc1wiKS5maW5kKHtcbiAgICAgICdwYXJlbnQubyc6ICdjbXNfcG9zdHMnLFxuICAgICAgJ3BhcmVudC5pZHMnOiBwb3N0SWRcbiAgICB9LCB7XG4gICAgICBmaWVsZHM6IHtcbiAgICAgICAgX2lkOiAxLFxuICAgICAgICB2ZXJzaW9uczogMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gICAgZmlsZUlkcyA9IFtdO1xuICAgIHBvc3RBdHRhY2htZW50cy5mb3JFYWNoKGZ1bmN0aW9uKGF0dCkge1xuICAgICAgaWYgKChhdHQgIT0gbnVsbCA/IGF0dC52ZXJzaW9ucy5sZW5ndGggOiB2b2lkIDApID4gMCkge1xuICAgICAgICByZXR1cm4gZmlsZUlkcy5wdXNoKGF0dC52ZXJzaW9uc1swXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGNmcy5maWxlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGZpbGVJZHNcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIFwidXBsb2FkZWRBdFwiOiAtMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCk7XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignU2l0ZUlkJywgZnVuY3Rpb24oKSB7XG4gIHZhciBzaXRlSWQ7XG4gIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICByZXR1cm4gc2l0ZUlkO1xufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdTaXRlJywgZnVuY3Rpb24oKSB7XG4gIHZhciBzaXRlSWQ7XG4gIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICBpZiAoc2l0ZUlkKSB7XG4gICAgcmV0dXJuIGRiLmNtc19zaXRlcy5maW5kT25lKHtcbiAgICAgIF9pZDogc2l0ZUlkXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignSW5kZXhQYWdlJywgZnVuY3Rpb24oKSB7XG4gIHZhciBkYXRhO1xuICBkYXRhID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhO1xuICBpZiAoIWRhdGEucGFyYW1zKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKGRhdGEucGFyYW1zLmNhdGVnb3J5SWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAoZGF0YS5wYXJhbXMucG9zdElkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1RhZ1BhZ2UnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHRhZztcbiAgdGFnID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy50YWc7XG4gIGlmICh0YWcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1RhZycsIGZ1bmN0aW9uKCkge1xuICB2YXIgdGFnO1xuICB0YWcgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnRhZztcbiAgcmV0dXJuIHRhZztcbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignUG9zdFBhZ2UnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHBvc3RJZDtcbiAgcG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWQ7XG4gIGlmIChwb3N0SWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ2VxdWFscycsIGZ1bmN0aW9uKGEsIGIpIHtcbiAgcmV0dXJuIGEgPT09IGI7XG59KTtcblxucmVuZGVyU2l0ZSA9IGZ1bmN0aW9uKHJlcSwgcmVzLCBuZXh0KSB7XG4gIHZhciBhdXRoVG9rZW4sIGNvb2tpZXMsIGhhc2hlZFRva2VuLCBodG1sLCBpc1Bvc3RJbmNTdWMsIGxheW91dCwgcG9zdElkLCBzaXRlLCB0ZW1wbGF0ZU5hbWUsIHVzZXIsIHVzZXJJZDtcbiAgc2l0ZSA9IGRiLmNtc19zaXRlcy5maW5kT25lKHtcbiAgICBfaWQ6IHJlcS5wYXJhbXMuc2l0ZUlkXG4gIH0pO1xuICBpZiAoIXNpdGUpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwNCk7XG4gICAgcmVzLmVuZChcIlNpdGUgbm90IGZvdW5kXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICBjb29raWVzID0gbmV3IENvb2tpZXMocmVxLCByZXMpO1xuICB1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKTtcbiAgYXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIik7XG4gIGlmICh1c2VySWQgJiYgYXV0aFRva2VuKSB7XG4gICAgaGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKTtcbiAgICB1c2VyID0gTWV0ZW9yLnVzZXJzLmZpbmRPbmUoe1xuICAgICAgX2lkOiB1c2VySWQsXG4gICAgICBcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuICAgIH0pO1xuICB9XG4gIGlmICgoc2l0ZSAhPSBudWxsID8gc2l0ZS52aXNpYmlsaXR5IDogdm9pZCAwKSAhPT0gXCJwdWJsaWNcIikge1xuICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICByZXMuZW5kKFwiQWNjZXNzIERlbmllZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgdGVtcGxhdGVOYW1lID0gJ3NpdGVfdGhlbWVfJyArIHNpdGUudGhlbWU7XG4gIGxheW91dCA9IHNpdGUubGF5b3V0O1xuICBpZiAoIWxheW91dCkge1xuICAgIGxheW91dCA9IEFzc2V0cy5nZXRUZXh0KCd0aGVtZXMvZGVmYXVsdC5odG1sJyk7XG4gIH1cbiAgU1NSLmNvbXBpbGVUZW1wbGF0ZSgnc2l0ZV90aGVtZV8nICsgc2l0ZS50aGVtZSwgbGF5b3V0KTtcbiAgcG9zdElkID0gcmVxLnBhcmFtcy5wb3N0SWQ7XG4gIGlmIChwb3N0SWQpIHtcbiAgICBpc1Bvc3RJbmNTdWMgPSBkYi5jbXNfcG9zdHMuZGlyZWN0LnVwZGF0ZSh7XG4gICAgICBfaWQ6IHBvc3RJZFxuICAgIH0sIHtcbiAgICAgICRpbmM6IHtcbiAgICAgICAgdmlld0NvdW50OiAxXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFpc1Bvc3RJbmNTdWMpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJhZGRQb3N0Vmlld2VyIHdoaWxlIHByZXZpZXdpbmcgc2l0ZSBwb3N0IEZhaWxlZC4gY21zX3Bvc3RzLnVwZGF0ZS4kaW5jIC4uLlwiICsgcG9zdElkKTtcbiAgICB9XG4gIH1cbiAgaHRtbCA9IFNTUi5yZW5kZXIodGVtcGxhdGVOYW1lLCB7XG4gICAgcGFyYW1zOiByZXEucGFyYW1zXG4gIH0pO1xuICByZXR1cm4gcmVzLmVuZChodG1sKTtcbn07XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZFwiLCByZW5kZXJTaXRlKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL2MvOmNhdGVnb3J5SWRcIiwgcmVuZGVyU2l0ZSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC9wLzpwb3N0SWRcIiwgcmVuZGVyU2l0ZSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC90Lzp0YWdcIiwgcmVuZGVyU2l0ZSk7XG4iLCJNZXRlb3Iuc3RhcnR1cCAtPlxyXG4gICAgXHJcbiAgICBKc29uUm91dGVzLmFkZCAnZ2V0JywgJy9hdmF0YXIvY21zX3NpdGVzLzpzaXRlSWQnLCAocmVxLCByZXMsIG5leHQpIC0+XHJcbiAgICAgICAgc2l0ZSA9IGRiLmNtc19zaXRlcy5maW5kT25lKHJlcS5wYXJhbXMuc2l0ZUlkKTtcclxuICAgICAgICBpZiAhc2l0ZVxyXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkIDQwMVxyXG4gICAgICAgICAgICByZXMuZW5kKClcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIGlmIHNpdGUuYXZhdGFyXHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHNpdGUuYXZhdGFyKVxyXG4gICAgICAgICAgICByZXMud3JpdGVIZWFkIDMwMlxyXG4gICAgICAgICAgICByZXMuZW5kKClcclxuICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIHVzZXJuYW1lID0gc2l0ZS5uYW1lO1xyXG4gICAgICAgIGlmICF1c2VybmFtZVxyXG4gICAgICAgICAgICB1c2VybmFtZSA9IFwiXCJcclxuXHJcbiAgICAgICAgcmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXHJcblxyXG4gICAgICAgIGlmIG5vdCBmaWxlP1xyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcclxuICAgICAgICAgICAgcmVzLnNldEhlYWRlciAnY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnXHJcblxyXG4gICAgICAgICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXHJcblxyXG4gICAgICAgICAgICBwb3NpdGlvbiA9IHVzZXJuYW1lLmxlbmd0aCAlIGNvbG9ycy5sZW5ndGhcclxuICAgICAgICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXHJcblxyXG4gICAgICAgICAgICBpbml0aWFscyA9ICcnXHJcbiAgICAgICAgICAgIGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XHJcbiAgICAgICAgICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKVxyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxyXG5cclxuICAgICAgICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpXHJcblxyXG4gICAgICAgICAgICBzdmcgPSBcIlwiXCJcclxuICAgICAgICAgICAgPD94bWwgdmVyc2lvbj1cIjEuMFwiIGVuY29kaW5nPVwiVVRGLThcIiBzdGFuZGFsb25lPVwibm9cIj8+XHJcbiAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIHN0eWxlPVwid2lkdGg6IDUwcHg7IGhlaWdodDogNTBweDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XHJcbiAgICAgICAgICAgICAgICA8dGV4dCB0ZXh0LWFuY2hvcj1cIm1pZGRsZVwiIHk9XCI1MCVcIiB4PVwiNTAlXCIgZHk9XCIwLjM2ZW1cIiBwb2ludGVyLWV2ZW50cz1cImF1dG9cIiBmaWxsPVwiI2ZmZmZmZlwiIGZvbnQtZmFtaWx5PVwiSGVsdmV0aWNhLCBBcmlhbCwgTHVjaWRhIEdyYW5kZSwgc2Fucy1zZXJpZlwiIHN0eWxlPVwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAyOHB4O1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICN7aW5pdGlhbHN9XHJcbiAgICAgICAgICAgICAgICA8L3RleHQ+XHJcbiAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICBcIlwiXCJcclxuXHJcbiAgICAgICAgICAgIHJlcy53cml0ZSBzdmdcclxuICAgICAgICAgICAgcmVzLmVuZCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICByZXFNb2RpZmllZEhlYWRlciA9IHJlcS5oZWFkZXJzW1wiaWYtbW9kaWZpZWQtc2luY2VcIl07XHJcbiAgICAgICAgaWYgcmVxTW9kaWZpZWRIZWFkZXI/XHJcbiAgICAgICAgICAgIGlmIHJlcU1vZGlmaWVkSGVhZGVyID09IHNpdGUubW9kaWZpZWQ/LnRvVVRDU3RyaW5nKClcclxuICAgICAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCByZXFNb2RpZmllZEhlYWRlclxyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCAzMDRcclxuICAgICAgICAgICAgICAgIHJlcy5lbmQoKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuXHJcblxyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIgJ0xhc3QtTW9kaWZpZWQnLCBzaXRlLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpIG9yIG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKVxyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIgJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9qcGVnJ1xyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcclxuXHJcbiAgICAgICAgZmlsZS5yZWFkU3RyZWFtLnBpcGUgcmVzXHJcbiAgICAgICAgcmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvY21zX3NpdGVzLzpzaXRlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JzLCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVxTW9kaWZpZWRIZWFkZXIsIHNpdGUsIHN2ZywgdXNlcm5hbWU7XG4gICAgc2l0ZSA9IGRiLmNtc19zaXRlcy5maW5kT25lKHJlcS5wYXJhbXMuc2l0ZUlkKTtcbiAgICBpZiAoIXNpdGUpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNpdGUuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyBzaXRlLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHNpdGUubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgcG9zaXRpb24gPSB1c2VybmFtZS5sZW5ndGggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIjUwXFxcIiBoZWlnaHQ9XFxcIjUwXFxcIiBzdHlsZT1cXFwid2lkdGg6IDUwcHg7IGhlaWdodDogNTBweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuICAgIDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI2ZmZmZmZlxcXCIgZm9udC1mYW1pbHk9XFxcIkhlbHZldGljYSwgQXJpYWwsIEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWZcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IDI4cHg7XFxcIj5cXG4gICAgICAgIFwiICsgaW5pdGlhbHMgKyBcIlxcbiAgICA8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmID0gc2l0ZS5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYxID0gc2l0ZS5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iXX0=

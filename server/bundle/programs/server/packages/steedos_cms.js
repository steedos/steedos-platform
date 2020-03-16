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
var ServerSession = Package['steedos:base'].ServerSession;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2F2YXRhci5jb2ZmZWUiXSwibmFtZXMiOlsiQ29va2llcyIsInJlbmRlclNpdGUiLCJOcG0iLCJyZXF1aXJlIiwiVGVtcGxhdGUiLCJyZWdpc3RlckhlbHBlcnMiLCJkaWN0IiwiXyIsImVhY2giLCJ2IiwiayIsInJlZ2lzdGVySGVscGVyIiwiQ2F0ZWdvcnlJZCIsImluc3RhbmNlIiwiZGF0YSIsInBhcmFtcyIsImNhdGVnb3J5SWQiLCJDYXRlZ29yeUFjdGl2ZSIsImMiLCJDYXRlZ29yeSIsImRiIiwiY21zX2NhdGVnb3JpZXMiLCJmaW5kT25lIiwiUGFyZW50Q2F0ZWdvcnkiLCJwYXJlbnQiLCJTdWJDYXRlZ29yaWVzIiwic2l0ZUlkIiwiZmluZCIsInNpdGUiLCJzb3J0Iiwib3JkZXIiLCJjcmVhdGVkIiwiU3ViQ2F0ZWdvcmllc0NvdW50IiwiY291bnQiLCJmcm9tTm93IiwidmFsdWUiLCJtb21lbnQiLCJEYXRlRm9ybWF0IiwiZm9ybWF0U3RyaW5nIiwiZm9ybWF0IiwiUG9zdHMiLCJsaW1pdCIsInNraXAiLCJjbXNfcG9zdHMiLCJjYXRlZ29yeSIsInBvc3REYXRlIiwiUG9zdHNDb3VudCIsIlBvc3RTdW1tYXJ5IiwiYm9keSIsInN1YnN0cmluZyIsImtleSIsIlRBUGkxOG4iLCJfXyIsIlJlY2VudFBvc3RzIiwiY2F0IiwiY2hpbGRyZW4iLCJjYWxjdWxhdGVDaGlsZHJlbiIsInB1c2giLCIkaW4iLCJNYXJrZG93biIsInRleHQiLCJTcGFjZWJhcnMiLCJTYWZlU3RyaW5nIiwiUG9zdEF0dGFjaG1lbnRVcmwiLCJhdHRhY2htZW50IiwiaXNQcmV2aWV3IiwidXJsIiwiTWV0ZW9yIiwiYWJzb2x1dGVVcmwiLCJfaWQiLCJvcmlnaW5hbCIsIm5hbWUiLCJTdGVlZG9zIiwiaXNNb2JpbGUiLCJJc0ltYWdlQXR0YWNobWVudCIsInJlZiIsInR5cGUiLCJzdGFydHNXaXRoIiwiSXNIdG1sQXR0YWNobWVudCIsImlzUHJvZHVjdGlvbiIsInBvc3RJZCIsImZpbGVJZHMiLCJwb3N0QXR0YWNobWVudHMiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpZWxkcyIsInZlcnNpb25zIiwiZmV0Y2giLCJmb3JFYWNoIiwiYXR0IiwibGVuZ3RoIiwicGx1Y2siLCJjZnMiLCJmaWxlcyIsImNtc19zaXRlcyIsInRhZyIsImEiLCJiIiwicmVxIiwicmVzIiwibmV4dCIsImF1dGhUb2tlbiIsImNvb2tpZXMiLCJoYXNoZWRUb2tlbiIsImh0bWwiLCJpc1Bvc3RJbmNTdWMiLCJsYXlvdXQiLCJ0ZW1wbGF0ZU5hbWUiLCJ1c2VyIiwidXNlcklkIiwid3JpdGVIZWFkIiwiZW5kIiwiZ2V0IiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJ1c2VycyIsInZpc2liaWxpdHkiLCJ0aGVtZSIsIkFzc2V0cyIsImdldFRleHQiLCJTU1IiLCJjb21waWxlVGVtcGxhdGUiLCJkaXJlY3QiLCJ1cGRhdGUiLCIkaW5jIiwidmlld0NvdW50IiwiY29uc29sZSIsImVycm9yIiwicmVuZGVyIiwiSnNvblJvdXRlcyIsImFkZCIsInN0YXJ0dXAiLCJjb2xvciIsImNvbG9ycyIsImluaXRpYWxzIiwicG9zaXRpb24iLCJyZWYxIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZSIsImF2YXRhciIsInNldEhlYWRlciIsImZpbGUiLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ3cml0ZSIsImhlYWRlcnMiLCJtb2RpZmllZCIsInRvVVRDU3RyaW5nIiwiRGF0ZSIsInJl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LElBQUosR0FBV0QsV0FBWCxFQUEvRDtBQUNBbEQsUUFBSTBDLFNBQUosQ0FBYyxjQUFkLEVBQThCLFlBQTlCO0FBQ0ExQyxRQUFJMEMsU0FBSixDQUFjLGdCQUFkLEVBQWdDQyxLQUFLcEQsTUFBckM7QUFFQW9ELFNBQUtTLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCckQsR0FBckI7QUE3REosSUNERjtBRERGLEciLCJmaWxlIjoiL3BhY2thZ2VzL3N0ZWVkb3NfY21zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiQ29va2llcyA9IE5wbS5yZXF1aXJlKFwiY29va2llc1wiKVxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXJzID0gKGRpY3QpIC0+XHJcblx0Xy5lYWNoIGRpY3QsICh2LCBrKS0+XHJcblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciBrLCB2XHJcblxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXJzXHJcblxyXG5cclxuXHRDYXRlZ29yeUlkOiAoKS0+XHJcblx0XHRyZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkXHJcblxyXG5cdENhdGVnb3J5QWN0aXZlOiAoYyktPlxyXG5cdFx0Y2F0ZWdvcnlJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZFxyXG5cdFx0aWYgY2F0ZWdvcnlJZCA9PSBjXHJcblx0XHRcdHJldHVybiBcImFjdGl2ZVwiXHJcblxyXG5cdENhdGVnb3J5OiAoKS0+XHJcblx0XHRjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkXHJcblx0XHRpZiBjYXRlZ29yeUlkXHJcblx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpXHJcblxyXG5cdFBhcmVudENhdGVnb3J5OiAoKS0+XHJcblx0XHRjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkXHJcblx0XHRpZiBjYXRlZ29yeUlkXHJcblx0XHRcdGMgPSBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpXHJcblx0XHRcdGlmIGM/LnBhcmVudFxyXG5cdFx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGMucGFyZW50KVxyXG5cclxuXHRTdWJDYXRlZ29yaWVzOiAocGFyZW50KS0+XHJcblx0XHRpZiBwYXJlbnQgPT0gXCJyb290XCJcclxuXHRcdFx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe3NpdGU6IHNpdGVJZCwgcGFyZW50OiBudWxsfSwge3NvcnQ6IHtvcmRlcjogMSwgY3JlYXRlZDogMX19KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7cGFyZW50OiBwYXJlbnR9LCB7c29ydDoge29yZGVyOiAxLCBjcmVhdGVkOiAxfX0pXHJcblx0XHRcdFxyXG5cdFN1YkNhdGVnb3JpZXNDb3VudDogKHBhcmVudCktPlxyXG5cdFx0aWYgcGFyZW50ID09IFwicm9vdFwiXHJcblx0XHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXHJcblx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtzaXRlOiBzaXRlSWQsIHBhcmVudDogbnVsbH0pLmNvdW50KClcclxuXHRcdGVsc2VcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe3BhcmVudDogcGFyZW50fSkuY291bnQoKVxyXG5cclxuXHRmcm9tTm93OiAodmFsdWUpLT5cclxuXHRcdHJldHVybiBtb21lbnQodmFsdWUpLmZyb21Ob3coKVxyXG5cclxuXHREYXRlRm9ybWF0OiAodmFsdWUsIGZvcm1hdFN0cmluZykgLT5cclxuXHRcdGlmICFmb3JtYXRTdHJpbmdcclxuXHRcdFx0Zm9ybWF0U3RyaW5nID0gXCJZWVlZLU1NLUREXCJcclxuXHRcdHJldHVybiBtb21lbnQodmFsdWUpLmZvcm1hdChmb3JtYXRTdHJpbmcpXHJcblxyXG5cdFBvc3RzOiAoY2F0ZWdvcnlJZCwgbGltaXQsIHNraXApLT5cclxuXHRcdGlmICFsaW1pdCBcclxuXHRcdFx0bGltaXQgPSA1XHJcblx0XHRza2lwID0gMFxyXG5cdFx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcclxuXHRcdGlmICFzaXRlSWQgXHJcblx0XHRcdHJldHVybiBbXVxyXG5cdFx0aWYgY2F0ZWdvcnlJZCBcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtzaXRlOiBzaXRlSWQsIGNhdGVnb3J5OiBjYXRlZ29yeUlkfSwge3NvcnQ6IHtwb3N0RGF0ZTogLTF9LCBsaW1pdDogbGltaXQsIHNraXA6IHNraXB9KVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZH0sIHtzb3J0OiB7cG9zdERhdGU6IC0xfSwgbGltaXQ6IGxpbWl0LCBza2lwOiBza2lwfSlcclxuXHJcblx0UG9zdHNDb3VudDogKGNhdGVnb3J5SWQpLT5cclxuXHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXHJcblx0XHRpZiAhc2l0ZUlkIFxyXG5cdFx0XHRyZXR1cm4gMFxyXG5cdFx0aWYgY2F0ZWdvcnlJZCBcclxuXHRcdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtzaXRlOiBzaXRlSWQsIGNhdGVnb3J5OiBjYXRlZ29yeUlkfSkuY291bnQoKVxyXG5cdFx0ZWxzZVxyXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZH0pLmNvdW50KClcclxuXHQgICBcclxuXHRQb3N0U3VtbWFyeTogLT5cclxuXHRcdGlmIHRoaXMuYm9keVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5ib2R5LnN1YnN0cmluZygwLCA0MDApXHJcblxyXG5cdF86IChrZXkpIC0+XHJcblx0XHRyZXR1cm4gVEFQaTE4bi5fXyBrZXlcclxuXHJcblx0UmVjZW50UG9zdHM6IChjYXRlZ29yeUlkLCBsaW1pdCwgc2tpcCktPlxyXG5cdFx0aWYgIWxpbWl0IFxyXG5cdFx0XHRsaW1pdCA9IDVcclxuXHRcdHNraXAgPSAwXHJcblx0XHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxyXG5cdFx0Y2F0ID0gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKVxyXG5cdFx0aWYgIWNhdCBcclxuXHRcdFx0cmV0dXJuIFtdXHJcblx0XHRjaGlsZHJlbiA9IGNhdC5jYWxjdWxhdGVDaGlsZHJlbigpO1xyXG5cdFx0Y2hpbGRyZW4ucHVzaChjYXRlZ29yeUlkKVxyXG5cdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtzaXRlOiBzaXRlSWQsIGNhdGVnb3J5OiB7JGluOiBjaGlsZHJlbn19LCB7c29ydDoge3Bvc3REYXRlOiAtMX0sIGxpbWl0OiBsaW1pdCwgc2tpcDogc2tpcH0pXHJcblxyXG5cdE1hcmtkb3duOiAodGV4dCktPlxyXG5cdFx0aWYgdGV4dFxyXG5cdFx0XHRyZXR1cm4gU3BhY2ViYXJzLlNhZmVTdHJpbmcoTWFya2Rvd24odGV4dCkpXHJcblxyXG5cdFNhZmVTdHJpbmc6ICh0ZXh0KS0+XHJcblx0XHRpZiB0ZXh0XHJcblx0XHRcdHJldHVybiBTcGFjZWJhcnMuU2FmZVN0cmluZyh0ZXh0KVxyXG5cclxuXHRQb3N0QXR0YWNobWVudFVybDogKGF0dGFjaG1lbnQsaXNQcmV2aWV3KS0+IFxyXG5cdFx0dXJsID0gTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2ZpbGVzLyN7YXR0YWNobWVudC5faWR9LyN7YXR0YWNobWVudC5vcmlnaW5hbC5uYW1lfVwiKVxyXG5cdFx0aWYgISh0eXBlb2YgaXNQcmV2aWV3ID09IFwiYm9vbGVhblwiIGFuZCBpc1ByZXZpZXcpIGFuZCAhU3RlZWRvcy5pc01vYmlsZSgpXHJcblx0XHRcdHVybCArPSBcIj9kb3dubG9hZD10cnVlXCJcclxuXHRcdHJldHVybiB1cmxcclxuXHJcblx0SXNJbWFnZUF0dGFjaG1lbnQ6IChhdHRhY2htZW50KS0+XHJcblx0XHR0eXBlID0gYXR0YWNobWVudD8ub3JpZ2luYWw/LnR5cGVcclxuXHRcdHJldHVybiB0eXBlPy5zdGFydHNXaXRoKFwiaW1hZ2UvXCIpXHJcblxyXG5cdElzSHRtbEF0dGFjaG1lbnQ6IChhdHRhY2htZW50KS0+XHJcblx0XHRyZXR1cm4gYXR0YWNobWVudD8ub3JpZ2luYWw/LnR5cGUgPT0gXCJ0ZXh0L2h0bWxcIlxyXG5cclxuXHRpc1Byb2R1Y3Rpb246ICgpLT5cclxuXHRcdHJldHVybiBNZXRlb3IuaXNQcm9kdWN0aW9uXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnUG9zdCcsIC0+XHJcblx0cG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWRcclxuXHRpZiBwb3N0SWRcclxuXHRcdHJldHVybiBkYi5jbXNfcG9zdHMuZmluZE9uZSh7X2lkOiBwb3N0SWR9KVxyXG5cclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdpbWFnZXMnLCAocG9zdElkKS0+XHJcblx0aWYgcG9zdElkXHJcblx0XHRwb3N0QXR0YWNobWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjbXNfZmlsZXNcIikuZmluZCh7J3BhcmVudC5vJzogJ2Ntc19wb3N0cycsICdwYXJlbnQuaWRzJzogcG9zdElkfSwge2ZpZWxkczoge19pZDoxLCB2ZXJzaW9uczogMX19KS5mZXRjaCgpO1xyXG5cdFx0ZmlsZUlkcyA9IFtdXHJcblx0XHRwb3N0QXR0YWNobWVudHMuZm9yRWFjaCAoYXR0KS0+XHJcblx0XHRcdGlmIGF0dD8udmVyc2lvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdGZpbGVJZHMucHVzaChhdHQudmVyc2lvbnNbMF0pXHJcblx0XHRyZXR1cm4gXy5wbHVjayhjZnMuZmlsZXMuZmluZCh7X2lkOiB7JGluOiBmaWxlSWRzfSwgXCJvcmlnaW5hbC50eXBlXCI6IC9pbWFnZVxcLy99LHtzb3J0OiB7XCJ1cGxvYWRlZEF0XCI6IC0xfX0pLmZldGNoKCksICdfaWQnKVxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ0F0dGFjaG1lbnRzJywgKCktPlxyXG5cdHBvc3RJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMucG9zdElkXHJcblx0aWYgcG9zdElkXHJcblx0XHRwb3N0QXR0YWNobWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjbXNfZmlsZXNcIikuZmluZCh7J3BhcmVudC5vJzogJ2Ntc19wb3N0cycsICdwYXJlbnQuaWRzJzogcG9zdElkfSwge2ZpZWxkczoge19pZDoxLCB2ZXJzaW9uczogMX19KS5mZXRjaCgpO1xyXG5cdFx0ZmlsZUlkcyA9IFtdXHJcblx0XHRwb3N0QXR0YWNobWVudHMuZm9yRWFjaCAoYXR0KS0+XHJcblx0XHRcdGlmIGF0dD8udmVyc2lvbnMubGVuZ3RoID4gMFxyXG5cdFx0XHRcdGZpbGVJZHMucHVzaChhdHQudmVyc2lvbnNbMF0pXHJcblxyXG5cdFx0cmV0dXJuIGNmcy5maWxlcy5maW5kKHtfaWQ6IHskaW46IGZpbGVJZHN9fSx7c29ydDoge1widXBsb2FkZWRBdFwiOiAtMX19KS5mZXRjaCgpXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnU2l0ZUlkJywgLT5cclxuXHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxyXG5cdHJldHVybiBzaXRlSWRcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdTaXRlJywgLT5cclxuXHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxyXG5cdGlmIHNpdGVJZFxyXG5cdFx0cmV0dXJuIGRiLmNtc19zaXRlcy5maW5kT25lKHtfaWQ6IHNpdGVJZH0pXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnSW5kZXhQYWdlJywgLT5cclxuXHRkYXRhID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhXHJcblx0aWYgIWRhdGEucGFyYW1zXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0ZWxzZSBpZiBkYXRhLnBhcmFtcy5jYXRlZ29yeUlkXHJcblx0XHRyZXR1cm4gZmFsc2VcclxuXHRlbHNlIGlmIGRhdGEucGFyYW1zLnBvc3RJZFxyXG5cdFx0cmV0dXJuIGZhbHNlXHJcblx0ZWxzZSBcclxuXHRcdHJldHVybiB0cnVlXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnVGFnUGFnZScsIC0+XHJcblx0dGFnID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy50YWdcclxuXHRpZiB0YWdcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnVGFnJywgLT5cclxuXHR0YWcgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnRhZ1xyXG5cdHJldHVybiB0YWdcclxuXHJcblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdQb3N0UGFnZScsIC0+XHJcblx0cG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWRcclxuXHRpZiBwb3N0SWRcclxuXHRcdHJldHVybiB0cnVlXHJcblx0cmV0dXJuIGZhbHNlXHJcblxyXG5cclxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ2VxdWFscycsIChhLCBiKS0+XHJcblx0cmV0dXJuIGEgPT0gYlxyXG5cclxucmVuZGVyU2l0ZSA9IChyZXEsIHJlcywgbmV4dCkgLT5cclxuXHRzaXRlID0gZGIuY21zX3NpdGVzLmZpbmRPbmUoe19pZDogcmVxLnBhcmFtcy5zaXRlSWR9KVxyXG5cdFxyXG5cdGlmICFzaXRlXHJcblx0XHRyZXMud3JpdGVIZWFkIDQwNFxyXG5cdFx0cmVzLmVuZChcIlNpdGUgbm90IGZvdW5kXCIpXHJcblx0XHRyZXR1cm5cclxuXHJcblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xyXG5cdHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpXHJcblx0YXV0aFRva2VuID0gY29va2llcy5nZXQoXCJYLUF1dGgtVG9rZW5cIilcclxuXHJcblx0aWYgdXNlcklkIGFuZCBhdXRoVG9rZW5cclxuXHRcdGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbilcclxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxyXG5cdFx0XHRfaWQ6IHVzZXJJZCxcclxuXHRcdFx0XCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cclxuXHJcblx0dW5sZXNzIHNpdGU/LnZpc2liaWxpdHkgPT0gXCJwdWJsaWNcIlxyXG5cdFx0cmVzLndyaXRlSGVhZCA0MDFcclxuXHRcdHJlcy5lbmQoXCJBY2Nlc3MgRGVuaWVkXCIpXHJcblx0XHRyZXR1cm5cclxuXHJcblx0dGVtcGxhdGVOYW1lID0gJ3NpdGVfdGhlbWVfJyArIHNpdGUudGhlbWVcclxuXHRsYXlvdXQgPSBzaXRlLmxheW91dFxyXG5cdGlmICFsYXlvdXRcclxuXHRcdGxheW91dCA9IEFzc2V0cy5nZXRUZXh0KCd0aGVtZXMvZGVmYXVsdC5odG1sJylcclxuXHRTU1IuY29tcGlsZVRlbXBsYXRlKCdzaXRlX3RoZW1lXycgKyBzaXRlLnRoZW1lLCBsYXlvdXQpO1xyXG5cclxuXHRwb3N0SWQgPSByZXEucGFyYW1zLnBvc3RJZFxyXG5cdGlmIHBvc3RJZFxyXG5cdFx0aXNQb3N0SW5jU3VjID0gZGIuY21zX3Bvc3RzLmRpcmVjdC51cGRhdGUge1xyXG5cdFx0XHRfaWQ6IHBvc3RJZFxyXG5cdFx0fSwgJGluYzpcclxuXHRcdFx0dmlld0NvdW50OiAxXHJcblx0XHR1bmxlc3MgaXNQb3N0SW5jU3VjXHJcblx0XHRcdGNvbnNvbGUuZXJyb3IgXCJhZGRQb3N0Vmlld2VyIHdoaWxlIHByZXZpZXdpbmcgc2l0ZSBwb3N0IEZhaWxlZC4gY21zX3Bvc3RzLnVwZGF0ZS4kaW5jIC4uLiN7cG9zdElkfVwiXHJcblxyXG5cdGh0bWwgPSBTU1IucmVuZGVyIHRlbXBsYXRlTmFtZSwgXHJcblx0XHRwYXJhbXM6IHJlcS5wYXJhbXNcclxuXHJcblx0cmVzLmVuZChodG1sKTtcclxuXHJcbiMgSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkXCIsIChyZXEsIHJlcywgbmV4dCktPlxyXG4jICAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XHJcbiMgICByZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgXCIuL3MvaG9tZVwiXHJcbiMgICByZXMuZW5kKCk7XHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWRcIiwgcmVuZGVyU2l0ZSAgXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvYy86Y2F0ZWdvcnlJZFwiLCByZW5kZXJTaXRlICBcclxuXHJcbkpzb25Sb3V0ZXMuYWRkIFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC9wLzpwb3N0SWRcIiwgcmVuZGVyU2l0ZSAgXHJcblxyXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvdC86dGFnXCIsIHJlbmRlclNpdGUgICIsInZhciBDb29raWVzLCByZW5kZXJTaXRlO1xuXG5Db29raWVzID0gTnBtLnJlcXVpcmUoXCJjb29raWVzXCIpO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcnMgPSBmdW5jdGlvbihkaWN0KSB7XG4gIHJldHVybiBfLmVhY2goZGljdCwgZnVuY3Rpb24odiwgaykge1xuICAgIHJldHVybiBUZW1wbGF0ZS5yZWdpc3RlckhlbHBlcihrLCB2KTtcbiAgfSk7XG59O1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcnMoe1xuICBDYXRlZ29yeUlkOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkO1xuICB9LFxuICBDYXRlZ29yeUFjdGl2ZTogZnVuY3Rpb24oYykge1xuICAgIHZhciBjYXRlZ29yeUlkO1xuICAgIGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWQ7XG4gICAgaWYgKGNhdGVnb3J5SWQgPT09IGMpIHtcbiAgICAgIHJldHVybiBcImFjdGl2ZVwiO1xuICAgIH1cbiAgfSxcbiAgQ2F0ZWdvcnk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYXRlZ29yeUlkO1xuICAgIGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWQ7XG4gICAgaWYgKGNhdGVnb3J5SWQpIHtcbiAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpO1xuICAgIH1cbiAgfSxcbiAgUGFyZW50Q2F0ZWdvcnk6IGZ1bmN0aW9uKCkge1xuICAgIHZhciBjLCBjYXRlZ29yeUlkO1xuICAgIGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWQ7XG4gICAgaWYgKGNhdGVnb3J5SWQpIHtcbiAgICAgIGMgPSBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGNhdGVnb3J5SWQpO1xuICAgICAgaWYgKGMgIT0gbnVsbCA/IGMucGFyZW50IDogdm9pZCAwKSB7XG4gICAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGMucGFyZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFN1YkNhdGVnb3JpZXM6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgIHZhciBzaXRlSWQ7XG4gICAgaWYgKHBhcmVudCA9PT0gXCJyb290XCIpIHtcbiAgICAgIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWQsXG4gICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgICAgY3JlYXRlZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe1xuICAgICAgICBwYXJlbnQ6IHBhcmVudFxuICAgICAgfSwge1xuICAgICAgICBzb3J0OiB7XG4gICAgICAgICAgb3JkZXI6IDEsXG4gICAgICAgICAgY3JlYXRlZDogMVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFN1YkNhdGVnb3JpZXNDb3VudDogZnVuY3Rpb24ocGFyZW50KSB7XG4gICAgdmFyIHNpdGVJZDtcbiAgICBpZiAocGFyZW50ID09PSBcInJvb3RcIikge1xuICAgICAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZCxcbiAgICAgICAgcGFyZW50OiBudWxsXG4gICAgICB9KS5jb3VudCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7XG4gICAgICAgIHBhcmVudDogcGFyZW50XG4gICAgICB9KS5jb3VudCgpO1xuICAgIH1cbiAgfSxcbiAgZnJvbU5vdzogZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gbW9tZW50KHZhbHVlKS5mcm9tTm93KCk7XG4gIH0sXG4gIERhdGVGb3JtYXQ6IGZ1bmN0aW9uKHZhbHVlLCBmb3JtYXRTdHJpbmcpIHtcbiAgICBpZiAoIWZvcm1hdFN0cmluZykge1xuICAgICAgZm9ybWF0U3RyaW5nID0gXCJZWVlZLU1NLUREXCI7XG4gICAgfVxuICAgIHJldHVybiBtb21lbnQodmFsdWUpLmZvcm1hdChmb3JtYXRTdHJpbmcpO1xuICB9LFxuICBQb3N0czogZnVuY3Rpb24oY2F0ZWdvcnlJZCwgbGltaXQsIHNraXApIHtcbiAgICB2YXIgc2l0ZUlkO1xuICAgIGlmICghbGltaXQpIHtcbiAgICAgIGxpbWl0ID0gNTtcbiAgICB9XG4gICAgc2tpcCA9IDA7XG4gICAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gICAgaWYgKCFzaXRlSWQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgaWYgKGNhdGVnb3J5SWQpIHtcbiAgICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZCxcbiAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SWRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIHBvc3REYXRlOiAtMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogbGltaXQsXG4gICAgICAgIHNraXA6IHNraXBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIHBvc3REYXRlOiAtMVxuICAgICAgICB9LFxuICAgICAgICBsaW1pdDogbGltaXQsXG4gICAgICAgIHNraXA6IHNraXBcbiAgICAgIH0pO1xuICAgIH1cbiAgfSxcbiAgUG9zdHNDb3VudDogZnVuY3Rpb24oY2F0ZWdvcnlJZCkge1xuICAgIHZhciBzaXRlSWQ7XG4gICAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gICAgaWYgKCFzaXRlSWQpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICBpZiAoY2F0ZWdvcnlJZCkge1xuICAgICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkLFxuICAgICAgICBjYXRlZ29yeTogY2F0ZWdvcnlJZFxuICAgICAgfSkuY291bnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkXG4gICAgICB9KS5jb3VudCgpO1xuICAgIH1cbiAgfSxcbiAgUG9zdFN1bW1hcnk6IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmJvZHkpIHtcbiAgICAgIHJldHVybiB0aGlzLmJvZHkuc3Vic3RyaW5nKDAsIDQwMCk7XG4gICAgfVxuICB9LFxuICBfOiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gVEFQaTE4bi5fXyhrZXkpO1xuICB9LFxuICBSZWNlbnRQb3N0czogZnVuY3Rpb24oY2F0ZWdvcnlJZCwgbGltaXQsIHNraXApIHtcbiAgICB2YXIgY2F0LCBjaGlsZHJlbiwgc2l0ZUlkO1xuICAgIGlmICghbGltaXQpIHtcbiAgICAgIGxpbWl0ID0gNTtcbiAgICB9XG4gICAgc2tpcCA9IDA7XG4gICAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gICAgY2F0ID0gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKTtcbiAgICBpZiAoIWNhdCkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBjaGlsZHJlbiA9IGNhdC5jYWxjdWxhdGVDaGlsZHJlbigpO1xuICAgIGNoaWxkcmVuLnB1c2goY2F0ZWdvcnlJZCk7XG4gICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtcbiAgICAgIHNpdGU6IHNpdGVJZCxcbiAgICAgIGNhdGVnb3J5OiB7XG4gICAgICAgICRpbjogY2hpbGRyZW5cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIHBvc3REYXRlOiAtMVxuICAgICAgfSxcbiAgICAgIGxpbWl0OiBsaW1pdCxcbiAgICAgIHNraXA6IHNraXBcbiAgICB9KTtcbiAgfSxcbiAgTWFya2Rvd246IGZ1bmN0aW9uKHRleHQpIHtcbiAgICBpZiAodGV4dCkge1xuICAgICAgcmV0dXJuIFNwYWNlYmFycy5TYWZlU3RyaW5nKE1hcmtkb3duKHRleHQpKTtcbiAgICB9XG4gIH0sXG4gIFNhZmVTdHJpbmc6IGZ1bmN0aW9uKHRleHQpIHtcbiAgICBpZiAodGV4dCkge1xuICAgICAgcmV0dXJuIFNwYWNlYmFycy5TYWZlU3RyaW5nKHRleHQpO1xuICAgIH1cbiAgfSxcbiAgUG9zdEF0dGFjaG1lbnRVcmw6IGZ1bmN0aW9uKGF0dGFjaG1lbnQsIGlzUHJldmlldykge1xuICAgIHZhciB1cmw7XG4gICAgdXJsID0gTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2ZpbGVzL1wiICsgYXR0YWNobWVudC5faWQgKyBcIi9cIiArIGF0dGFjaG1lbnQub3JpZ2luYWwubmFtZSk7XG4gICAgaWYgKCEodHlwZW9mIGlzUHJldmlldyA9PT0gXCJib29sZWFuXCIgJiYgaXNQcmV2aWV3KSAmJiAhU3RlZWRvcy5pc01vYmlsZSgpKSB7XG4gICAgICB1cmwgKz0gXCI/ZG93bmxvYWQ9dHJ1ZVwiO1xuICAgIH1cbiAgICByZXR1cm4gdXJsO1xuICB9LFxuICBJc0ltYWdlQXR0YWNobWVudDogZnVuY3Rpb24oYXR0YWNobWVudCkge1xuICAgIHZhciByZWYsIHR5cGU7XG4gICAgdHlwZSA9IGF0dGFjaG1lbnQgIT0gbnVsbCA/IChyZWYgPSBhdHRhY2htZW50Lm9yaWdpbmFsKSAhPSBudWxsID8gcmVmLnR5cGUgOiB2b2lkIDAgOiB2b2lkIDA7XG4gICAgcmV0dXJuIHR5cGUgIT0gbnVsbCA/IHR5cGUuc3RhcnRzV2l0aChcImltYWdlL1wiKSA6IHZvaWQgMDtcbiAgfSxcbiAgSXNIdG1sQXR0YWNobWVudDogZnVuY3Rpb24oYXR0YWNobWVudCkge1xuICAgIHZhciByZWY7XG4gICAgcmV0dXJuIChhdHRhY2htZW50ICE9IG51bGwgPyAocmVmID0gYXR0YWNobWVudC5vcmlnaW5hbCkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwIDogdm9pZCAwKSA9PT0gXCJ0ZXh0L2h0bWxcIjtcbiAgfSxcbiAgaXNQcm9kdWN0aW9uOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gTWV0ZW9yLmlzUHJvZHVjdGlvbjtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdQb3N0JywgZnVuY3Rpb24oKSB7XG4gIHZhciBwb3N0SWQ7XG4gIHBvc3RJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMucG9zdElkO1xuICBpZiAocG9zdElkKSB7XG4gICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kT25lKHtcbiAgICAgIF9pZDogcG9zdElkXG4gICAgfSk7XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignaW1hZ2VzJywgZnVuY3Rpb24ocG9zdElkKSB7XG4gIHZhciBmaWxlSWRzLCBwb3N0QXR0YWNobWVudHM7XG4gIGlmIChwb3N0SWQpIHtcbiAgICBwb3N0QXR0YWNobWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjbXNfZmlsZXNcIikuZmluZCh7XG4gICAgICAncGFyZW50Lm8nOiAnY21zX3Bvc3RzJyxcbiAgICAgICdwYXJlbnQuaWRzJzogcG9zdElkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgdmVyc2lvbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGZpbGVJZHMgPSBbXTtcbiAgICBwb3N0QXR0YWNobWVudHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgIGlmICgoYXR0ICE9IG51bGwgPyBhdHQudmVyc2lvbnMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGZpbGVJZHMucHVzaChhdHQudmVyc2lvbnNbMF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBfLnBsdWNrKGNmcy5maWxlcy5maW5kKHtcbiAgICAgIF9pZDoge1xuICAgICAgICAkaW46IGZpbGVJZHNcbiAgICAgIH0sXG4gICAgICBcIm9yaWdpbmFsLnR5cGVcIjogL2ltYWdlXFwvL1xuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgXCJ1cGxvYWRlZEF0XCI6IC0xXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKSwgJ19pZCcpO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ0F0dGFjaG1lbnRzJywgZnVuY3Rpb24oKSB7XG4gIHZhciBmaWxlSWRzLCBwb3N0QXR0YWNobWVudHMsIHBvc3RJZDtcbiAgcG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWQ7XG4gIGlmIChwb3N0SWQpIHtcbiAgICBwb3N0QXR0YWNobWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjbXNfZmlsZXNcIikuZmluZCh7XG4gICAgICAncGFyZW50Lm8nOiAnY21zX3Bvc3RzJyxcbiAgICAgICdwYXJlbnQuaWRzJzogcG9zdElkXG4gICAgfSwge1xuICAgICAgZmllbGRzOiB7XG4gICAgICAgIF9pZDogMSxcbiAgICAgICAgdmVyc2lvbnM6IDFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICAgIGZpbGVJZHMgPSBbXTtcbiAgICBwb3N0QXR0YWNobWVudHMuZm9yRWFjaChmdW5jdGlvbihhdHQpIHtcbiAgICAgIGlmICgoYXR0ICE9IG51bGwgPyBhdHQudmVyc2lvbnMubGVuZ3RoIDogdm9pZCAwKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIGZpbGVJZHMucHVzaChhdHQudmVyc2lvbnNbMF0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBjZnMuZmlsZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBmaWxlSWRzXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBcInVwbG9hZGVkQXRcIjogLTFcbiAgICAgIH1cbiAgICB9KS5mZXRjaCgpO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1NpdGVJZCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgc2l0ZUlkO1xuICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgcmV0dXJuIHNpdGVJZDtcbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignU2l0ZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgc2l0ZUlkO1xuICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgaWYgKHNpdGVJZCkge1xuICAgIHJldHVybiBkYi5jbXNfc2l0ZXMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHNpdGVJZFxuICAgIH0pO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ0luZGV4UGFnZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgZGF0YTtcbiAgZGF0YSA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YTtcbiAgaWYgKCFkYXRhLnBhcmFtcykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChkYXRhLnBhcmFtcy5jYXRlZ29yeUlkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9IGVsc2UgaWYgKGRhdGEucGFyYW1zLnBvc3RJZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdUYWdQYWdlJywgZnVuY3Rpb24oKSB7XG4gIHZhciB0YWc7XG4gIHRhZyA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMudGFnO1xuICBpZiAodGFnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdUYWcnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHRhZztcbiAgdGFnID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy50YWc7XG4gIHJldHVybiB0YWc7XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1Bvc3RQYWdlJywgZnVuY3Rpb24oKSB7XG4gIHZhciBwb3N0SWQ7XG4gIHBvc3RJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMucG9zdElkO1xuICBpZiAocG9zdElkKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdlcXVhbHMnLCBmdW5jdGlvbihhLCBiKSB7XG4gIHJldHVybiBhID09PSBiO1xufSk7XG5cbnJlbmRlclNpdGUgPSBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICB2YXIgYXV0aFRva2VuLCBjb29raWVzLCBoYXNoZWRUb2tlbiwgaHRtbCwgaXNQb3N0SW5jU3VjLCBsYXlvdXQsIHBvc3RJZCwgc2l0ZSwgdGVtcGxhdGVOYW1lLCB1c2VyLCB1c2VySWQ7XG4gIHNpdGUgPSBkYi5jbXNfc2l0ZXMuZmluZE9uZSh7XG4gICAgX2lkOiByZXEucGFyYW1zLnNpdGVJZFxuICB9KTtcbiAgaWYgKCFzaXRlKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDQpO1xuICAgIHJlcy5lbmQoXCJTaXRlIG5vdCBmb3VuZFwiKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29va2llcyA9IG5ldyBDb29raWVzKHJlcSwgcmVzKTtcbiAgdXNlcklkID0gY29va2llcy5nZXQoXCJYLVVzZXItSWRcIik7XG4gIGF1dGhUb2tlbiA9IGNvb2tpZXMuZ2V0KFwiWC1BdXRoLVRva2VuXCIpO1xuICBpZiAodXNlcklkICYmIGF1dGhUb2tlbikge1xuICAgIGhhc2hlZFRva2VuID0gQWNjb3VudHMuX2hhc2hMb2dpblRva2VuKGF1dGhUb2tlbik7XG4gICAgdXNlciA9IE1ldGVvci51c2Vycy5maW5kT25lKHtcbiAgICAgIF9pZDogdXNlcklkLFxuICAgICAgXCJzZXJ2aWNlcy5yZXN1bWUubG9naW5Ub2tlbnMuaGFzaGVkVG9rZW5cIjogaGFzaGVkVG9rZW5cbiAgICB9KTtcbiAgfVxuICBpZiAoKHNpdGUgIT0gbnVsbCA/IHNpdGUudmlzaWJpbGl0eSA6IHZvaWQgMCkgIT09IFwicHVibGljXCIpIHtcbiAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgcmVzLmVuZChcIkFjY2VzcyBEZW5pZWRcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIHRlbXBsYXRlTmFtZSA9ICdzaXRlX3RoZW1lXycgKyBzaXRlLnRoZW1lO1xuICBsYXlvdXQgPSBzaXRlLmxheW91dDtcbiAgaWYgKCFsYXlvdXQpIHtcbiAgICBsYXlvdXQgPSBBc3NldHMuZ2V0VGV4dCgndGhlbWVzL2RlZmF1bHQuaHRtbCcpO1xuICB9XG4gIFNTUi5jb21waWxlVGVtcGxhdGUoJ3NpdGVfdGhlbWVfJyArIHNpdGUudGhlbWUsIGxheW91dCk7XG4gIHBvc3RJZCA9IHJlcS5wYXJhbXMucG9zdElkO1xuICBpZiAocG9zdElkKSB7XG4gICAgaXNQb3N0SW5jU3VjID0gZGIuY21zX3Bvc3RzLmRpcmVjdC51cGRhdGUoe1xuICAgICAgX2lkOiBwb3N0SWRcbiAgICB9LCB7XG4gICAgICAkaW5jOiB7XG4gICAgICAgIHZpZXdDb3VudDogMVxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmICghaXNQb3N0SW5jU3VjKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiYWRkUG9zdFZpZXdlciB3aGlsZSBwcmV2aWV3aW5nIHNpdGUgcG9zdCBGYWlsZWQuIGNtc19wb3N0cy51cGRhdGUuJGluYyAuLi5cIiArIHBvc3RJZCk7XG4gICAgfVxuICB9XG4gIGh0bWwgPSBTU1IucmVuZGVyKHRlbXBsYXRlTmFtZSwge1xuICAgIHBhcmFtczogcmVxLnBhcmFtc1xuICB9KTtcbiAgcmV0dXJuIHJlcy5lbmQoaHRtbCk7XG59O1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9zaXRlLzpzaXRlSWRcIiwgcmVuZGVyU2l0ZSk7XG5cbkpzb25Sb3V0ZXMuYWRkKFwiZ2V0XCIsIFwiL3NpdGUvOnNpdGVJZC9jLzpjYXRlZ29yeUlkXCIsIHJlbmRlclNpdGUpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvcC86cG9zdElkXCIsIHJlbmRlclNpdGUpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvdC86dGFnXCIsIHJlbmRlclNpdGUpO1xuIiwiTWV0ZW9yLnN0YXJ0dXAgLT5cclxuICAgIFxyXG4gICAgSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyL2Ntc19zaXRlcy86c2l0ZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxyXG4gICAgICAgIHNpdGUgPSBkYi5jbXNfc2l0ZXMuZmluZE9uZShyZXEucGFyYW1zLnNpdGVJZCk7XHJcbiAgICAgICAgaWYgIXNpdGVcclxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCA0MDFcclxuICAgICAgICAgICAgcmVzLmVuZCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICBpZiBzaXRlLmF2YXRhclxyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyIFwiTG9jYXRpb25cIiwgTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyBzaXRlLmF2YXRhcilcclxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCAzMDJcclxuICAgICAgICAgICAgcmVzLmVuZCgpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICB1c2VybmFtZSA9IHNpdGUubmFtZTtcclxuICAgICAgICBpZiAhdXNlcm5hbWVcclxuICAgICAgICAgICAgdXNlcm5hbWUgPSBcIlwiXHJcblxyXG4gICAgICAgIHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJ1xyXG5cclxuICAgICAgICBpZiBub3QgZmlsZT9cclxuICAgICAgICAgICAgcmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL3N2Zyt4bWwnXHJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xyXG5cclxuICAgICAgICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywnI0U5MUU2MycsJyM5QzI3QjAnLCcjNjczQUI3JywnIzNGNTFCNScsJyMyMTk2RjMnLCcjMDNBOUY0JywnIzAwQkNENCcsJyMwMDk2ODgnLCcjNENBRjUwJywnIzhCQzM0QScsJyNDRERDMzknLCcjRkZDMTA3JywnI0ZGOTgwMCcsJyNGRjU3MjInLCcjNzk1NTQ4JywnIzlFOUU5RScsJyM2MDdEOEInXVxyXG5cclxuICAgICAgICAgICAgcG9zaXRpb24gPSB1c2VybmFtZS5sZW5ndGggJSBjb2xvcnMubGVuZ3RoXHJcbiAgICAgICAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXVxyXG5cclxuICAgICAgICAgICAgaW5pdGlhbHMgPSAnJ1xyXG4gICAgICAgICAgICBpZiB1c2VybmFtZS5jaGFyQ29kZUF0KDApPjI1NVxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMilcclxuXHJcbiAgICAgICAgICAgIGluaXRpYWxzID0gaW5pdGlhbHMudG9VcHBlckNhc2UoKVxyXG5cclxuICAgICAgICAgICAgc3ZnID0gXCJcIlwiXHJcbiAgICAgICAgICAgIDw/eG1sIHZlcnNpb249XCIxLjBcIiBlbmNvZGluZz1cIlVURi04XCIgc3RhbmRhbG9uZT1cIm5vXCI/PlxyXG4gICAgICAgICAgICA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBwb2ludGVyLWV2ZW50cz1cIm5vbmVcIiB3aWR0aD1cIjUwXCIgaGVpZ2h0PVwiNTBcIiBzdHlsZT1cIndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IGJhY2tncm91bmQtY29sb3I6ICN7Y29sb3J9O1wiPlxyXG4gICAgICAgICAgICAgICAgPHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNmZmZmZmZcIiBmb250LWZhbWlseT1cIkhlbHZldGljYSwgQXJpYWwsIEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWZcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogMjhweDtcIj5cclxuICAgICAgICAgICAgICAgICAgICAje2luaXRpYWxzfVxyXG4gICAgICAgICAgICAgICAgPC90ZXh0PlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgXCJcIlwiXHJcblxyXG4gICAgICAgICAgICByZXMud3JpdGUgc3ZnXHJcbiAgICAgICAgICAgIHJlcy5lbmQoKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuXHJcbiAgICAgICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xyXG4gICAgICAgIGlmIHJlcU1vZGlmaWVkSGVhZGVyP1xyXG4gICAgICAgICAgICBpZiByZXFNb2RpZmllZEhlYWRlciA9PSBzaXRlLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXHJcbiAgICAgICAgICAgICAgICByZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXJcclxuICAgICAgICAgICAgICAgIHJlcy53cml0ZUhlYWQgMzA0XHJcbiAgICAgICAgICAgICAgICByZXMuZW5kKClcclxuICAgICAgICAgICAgICAgIHJldHVyblxyXG5cclxuICAgICAgICByZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgc2l0ZS5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcclxuICAgICAgICByZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZydcclxuICAgICAgICByZXMuc2V0SGVhZGVyICdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoXHJcblxyXG4gICAgICAgIGZpbGUucmVhZFN0cmVhbS5waXBlIHJlc1xyXG4gICAgICAgIHJldHVybiIsIk1ldGVvci5zdGFydHVwKGZ1bmN0aW9uKCkge1xuICByZXR1cm4gSnNvblJvdXRlcy5hZGQoJ2dldCcsICcvYXZhdGFyL2Ntc19zaXRlcy86c2l0ZUlkJywgZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgICB2YXIgY29sb3IsIGNvbG9ycywgaW5pdGlhbHMsIHBvc2l0aW9uLCByZWYsIHJlZjEsIHJlcU1vZGlmaWVkSGVhZGVyLCBzaXRlLCBzdmcsIHVzZXJuYW1lO1xuICAgIHNpdGUgPSBkYi5jbXNfc2l0ZXMuZmluZE9uZShyZXEucGFyYW1zLnNpdGVJZCk7XG4gICAgaWYgKCFzaXRlKSB7XG4gICAgICByZXMud3JpdGVIZWFkKDQwMSk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChzaXRlLmF2YXRhcikge1xuICAgICAgcmVzLnNldEhlYWRlcihcIkxvY2F0aW9uXCIsIE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9hdmF0YXJzL1wiICsgc2l0ZS5hdmF0YXIpKTtcbiAgICAgIHJlcy53cml0ZUhlYWQoMzAyKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdXNlcm5hbWUgPSBzaXRlLm5hbWU7XG4gICAgaWYgKCF1c2VybmFtZSkge1xuICAgICAgdXNlcm5hbWUgPSBcIlwiO1xuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgJ2lubGluZScpO1xuICAgIGlmICh0eXBlb2YgZmlsZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCBmaWxlID09PSBudWxsKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgcmVzLnNldEhlYWRlcignY2FjaGUtY29udHJvbCcsICdwdWJsaWMsIG1heC1hZ2U9MzE1MzYwMDAnKTtcbiAgICAgIGNvbG9ycyA9IFsnI0Y0NDMzNicsICcjRTkxRTYzJywgJyM5QzI3QjAnLCAnIzY3M0FCNycsICcjM0Y1MUI1JywgJyMyMTk2RjMnLCAnIzAzQTlGNCcsICcjMDBCQ0Q0JywgJyMwMDk2ODgnLCAnIzRDQUY1MCcsICcjOEJDMzRBJywgJyNDRERDMzknLCAnI0ZGQzEwNycsICcjRkY5ODAwJywgJyNGRjU3MjInLCAnIzc5NTU0OCcsICcjOUU5RTlFJywgJyM2MDdEOEInXTtcbiAgICAgIHBvc2l0aW9uID0gdXNlcm5hbWUubGVuZ3RoICUgY29sb3JzLmxlbmd0aDtcbiAgICAgIGNvbG9yID0gY29sb3JzW3Bvc2l0aW9uXTtcbiAgICAgIGluaXRpYWxzID0gJyc7XG4gICAgICBpZiAodXNlcm5hbWUuY2hhckNvZGVBdCgwKSA+IDI1NSkge1xuICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAxKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDIpO1xuICAgICAgfVxuICAgICAgaW5pdGlhbHMgPSBpbml0aWFscy50b1VwcGVyQ2FzZSgpO1xuICAgICAgc3ZnID0gXCI8P3htbCB2ZXJzaW9uPVxcXCIxLjBcXFwiIGVuY29kaW5nPVxcXCJVVEYtOFxcXCIgc3RhbmRhbG9uZT1cXFwibm9cXFwiPz5cXG48c3ZnIHhtbG5zPVxcXCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1xcXCIgcG9pbnRlci1ldmVudHM9XFxcIm5vbmVcXFwiIHdpZHRoPVxcXCI1MFxcXCIgaGVpZ2h0PVxcXCI1MFxcXCIgc3R5bGU9XFxcIndpZHRoOiA1MHB4OyBoZWlnaHQ6IDUwcHg7IGJhY2tncm91bmQtY29sb3I6IFwiICsgY29sb3IgKyBcIjtcXFwiPlxcbiAgICA8dGV4dCB0ZXh0LWFuY2hvcj1cXFwibWlkZGxlXFxcIiB5PVxcXCI1MCVcXFwiIHg9XFxcIjUwJVxcXCIgZHk9XFxcIjAuMzZlbVxcXCIgcG9pbnRlci1ldmVudHM9XFxcImF1dG9cXFwiIGZpbGw9XFxcIiNmZmZmZmZcXFwiIGZvbnQtZmFtaWx5PVxcXCJIZWx2ZXRpY2EsIEFyaWFsLCBMdWNpZGEgR3JhbmRlLCBzYW5zLXNlcmlmXFxcIiBzdHlsZT1cXFwiZm9udC13ZWlnaHQ6IDQwMDsgZm9udC1zaXplOiAyOHB4O1xcXCI+XFxuICAgICAgICBcIiArIGluaXRpYWxzICsgXCJcXG4gICAgPC90ZXh0Plxcbjwvc3ZnPlwiO1xuICAgICAgcmVzLndyaXRlKHN2Zyk7XG4gICAgICByZXMuZW5kKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgIT0gbnVsbCkge1xuICAgICAgaWYgKHJlcU1vZGlmaWVkSGVhZGVyID09PSAoKHJlZiA9IHNpdGUubW9kaWZpZWQpICE9IG51bGwgPyByZWYudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkpIHtcbiAgICAgICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyKTtcbiAgICAgICAgcmVzLndyaXRlSGVhZCgzMDQpO1xuICAgICAgICByZXMuZW5kKCk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzLnNldEhlYWRlcignTGFzdC1Nb2RpZmllZCcsICgocmVmMSA9IHNpdGUubW9kaWZpZWQpICE9IG51bGwgPyByZWYxLnRvVVRDU3RyaW5nKCkgOiB2b2lkIDApIHx8IG5ldyBEYXRlKCkudG9VVENTdHJpbmcoKSk7XG4gICAgcmVzLnNldEhlYWRlcignY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnKTtcbiAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGZpbGUubGVuZ3RoKTtcbiAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZShyZXMpO1xuICB9KTtcbn0pO1xuIl19

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvc2VydmVyL3JvdXRlcy9zaXRlLmNvZmZlZSIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvc3RlZWRvc19jbXMvc2VydmVyL3JvdXRlcy9hdmF0YXIuY29mZmVlIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvcm91dGVzL2F2YXRhci5jb2ZmZWUiXSwibmFtZXMiOlsiQ29va2llcyIsInJlbmRlclNpdGUiLCJOcG0iLCJyZXF1aXJlIiwiVGVtcGxhdGUiLCJyZWdpc3RlckhlbHBlcnMiLCJkaWN0IiwiXyIsImVhY2giLCJ2IiwiayIsInJlZ2lzdGVySGVscGVyIiwiQ2F0ZWdvcnlJZCIsImluc3RhbmNlIiwiZGF0YSIsInBhcmFtcyIsImNhdGVnb3J5SWQiLCJDYXRlZ29yeUFjdGl2ZSIsImMiLCJDYXRlZ29yeSIsImRiIiwiY21zX2NhdGVnb3JpZXMiLCJmaW5kT25lIiwiUGFyZW50Q2F0ZWdvcnkiLCJwYXJlbnQiLCJTdWJDYXRlZ29yaWVzIiwic2l0ZUlkIiwiZmluZCIsInNpdGUiLCJzb3J0Iiwib3JkZXIiLCJjcmVhdGVkIiwiU3ViQ2F0ZWdvcmllc0NvdW50IiwiY291bnQiLCJmcm9tTm93IiwidmFsdWUiLCJtb21lbnQiLCJEYXRlRm9ybWF0IiwiZm9ybWF0U3RyaW5nIiwiZm9ybWF0IiwiUG9zdHMiLCJsaW1pdCIsInNraXAiLCJjbXNfcG9zdHMiLCJjYXRlZ29yeSIsInBvc3REYXRlIiwiUG9zdHNDb3VudCIsIlBvc3RTdW1tYXJ5IiwiYm9keSIsInN1YnN0cmluZyIsImtleSIsIlRBUGkxOG4iLCJfXyIsIlJlY2VudFBvc3RzIiwiY2F0IiwiY2hpbGRyZW4iLCJjYWxjdWxhdGVDaGlsZHJlbiIsInB1c2giLCIkaW4iLCJNYXJrZG93biIsInRleHQiLCJTcGFjZWJhcnMiLCJTYWZlU3RyaW5nIiwiUG9zdEF0dGFjaG1lbnRVcmwiLCJhdHRhY2htZW50IiwiaXNQcmV2aWV3IiwidXJsIiwiTWV0ZW9yIiwiYWJzb2x1dGVVcmwiLCJfaWQiLCJvcmlnaW5hbCIsIm5hbWUiLCJTdGVlZG9zIiwiaXNNb2JpbGUiLCJJc0ltYWdlQXR0YWNobWVudCIsInJlZiIsInR5cGUiLCJzdGFydHNXaXRoIiwiSXNIdG1sQXR0YWNobWVudCIsImlzUHJvZHVjdGlvbiIsInBvc3RJZCIsImZpbGVJZHMiLCJwb3N0QXR0YWNobWVudHMiLCJDcmVhdG9yIiwiZ2V0Q29sbGVjdGlvbiIsImZpZWxkcyIsInZlcnNpb25zIiwiZmV0Y2giLCJmb3JFYWNoIiwiYXR0IiwibGVuZ3RoIiwicGx1Y2siLCJjZnMiLCJmaWxlcyIsImNtc19zaXRlcyIsInRhZyIsImEiLCJiIiwicmVxIiwicmVzIiwibmV4dCIsImF1dGhUb2tlbiIsImNvb2tpZXMiLCJoYXNoZWRUb2tlbiIsImh0bWwiLCJpc1Bvc3RJbmNTdWMiLCJsYXlvdXQiLCJ0ZW1wbGF0ZU5hbWUiLCJ1c2VyIiwidXNlcklkIiwid3JpdGVIZWFkIiwiZW5kIiwiZ2V0IiwiQWNjb3VudHMiLCJfaGFzaExvZ2luVG9rZW4iLCJ1c2VycyIsInZpc2liaWxpdHkiLCJ0aGVtZSIsIkFzc2V0cyIsImdldFRleHQiLCJTU1IiLCJjb21waWxlVGVtcGxhdGUiLCJkaXJlY3QiLCJ1cGRhdGUiLCIkaW5jIiwidmlld0NvdW50IiwiY29uc29sZSIsImVycm9yIiwicmVuZGVyIiwiSnNvblJvdXRlcyIsImFkZCIsInN0YXJ0dXAiLCJjb2xvciIsImNvbG9ycyIsImluaXRpYWxzIiwicG9zaXRpb24iLCJyZWYxIiwicmVxTW9kaWZpZWRIZWFkZXIiLCJzdmciLCJ1c2VybmFtZSIsImF2YXRhciIsInNldEhlYWRlciIsImZpbGUiLCJjaGFyQ29kZUF0Iiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJ3cml0ZSIsImhlYWRlcnMiLCJtb2RpZmllZCIsInRvVVRDU3RyaW5nIiwiRGF0ZSIsInJl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U0FBSixDQUFjLGNBQWQsRUFBOEIsWUFBOUI7QUFDQTFDLFFBQUkwQyxTQUFKLENBQWMsZ0JBQWQsRUFBZ0NDLEtBQUtwRCxNQUFyQztBQUVBb0QsU0FBS1MsVUFBTCxDQUFnQkMsSUFBaEIsQ0FBcUJyRCxHQUFyQjtBQTdESixJQ0RGO0FEREYsRyIsImZpbGUiOiIvcGFja2FnZXMvc3RlZWRvc19jbXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJDb29raWVzID0gTnBtLnJlcXVpcmUoXCJjb29raWVzXCIpXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVycyA9IChkaWN0KSAtPlxuXHRfLmVhY2ggZGljdCwgKHYsIGspLT5cblx0XHRUZW1wbGF0ZS5yZWdpc3RlckhlbHBlciBrLCB2XG5cblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXJzXG5cblxuXHRDYXRlZ29yeUlkOiAoKS0+XG5cdFx0cmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZFxuXG5cdENhdGVnb3J5QWN0aXZlOiAoYyktPlxuXHRcdGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWRcblx0XHRpZiBjYXRlZ29yeUlkID09IGNcblx0XHRcdHJldHVybiBcImFjdGl2ZVwiXG5cblx0Q2F0ZWdvcnk6ICgpLT5cblx0XHRjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkXG5cdFx0aWYgY2F0ZWdvcnlJZFxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZClcblxuXHRQYXJlbnRDYXRlZ29yeTogKCktPlxuXHRcdGNhdGVnb3J5SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLmNhdGVnb3J5SWRcblx0XHRpZiBjYXRlZ29yeUlkXG5cdFx0XHRjID0gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKVxuXHRcdFx0aWYgYz8ucGFyZW50XG5cdFx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kT25lKGMucGFyZW50KVxuXG5cdFN1YkNhdGVnb3JpZXM6IChwYXJlbnQpLT5cblx0XHRpZiBwYXJlbnQgPT0gXCJyb290XCJcblx0XHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXG5cdFx0XHRyZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7c2l0ZTogc2l0ZUlkLCBwYXJlbnQ6IG51bGx9LCB7c29ydDoge29yZGVyOiAxLCBjcmVhdGVkOiAxfX0pXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe3BhcmVudDogcGFyZW50fSwge3NvcnQ6IHtvcmRlcjogMSwgY3JlYXRlZDogMX19KVxuXHRcdFx0XG5cdFN1YkNhdGVnb3JpZXNDb3VudDogKHBhcmVudCktPlxuXHRcdGlmIHBhcmVudCA9PSBcInJvb3RcIlxuXHRcdFx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcblx0XHRcdHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtzaXRlOiBzaXRlSWQsIHBhcmVudDogbnVsbH0pLmNvdW50KClcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZCh7cGFyZW50OiBwYXJlbnR9KS5jb3VudCgpXG5cblx0ZnJvbU5vdzogKHZhbHVlKS0+XG5cdFx0cmV0dXJuIG1vbWVudCh2YWx1ZSkuZnJvbU5vdygpXG5cblx0RGF0ZUZvcm1hdDogKHZhbHVlLCBmb3JtYXRTdHJpbmcpIC0+XG5cdFx0aWYgIWZvcm1hdFN0cmluZ1xuXHRcdFx0Zm9ybWF0U3RyaW5nID0gXCJZWVlZLU1NLUREXCJcblx0XHRyZXR1cm4gbW9tZW50KHZhbHVlKS5mb3JtYXQoZm9ybWF0U3RyaW5nKVxuXG5cdFBvc3RzOiAoY2F0ZWdvcnlJZCwgbGltaXQsIHNraXApLT5cblx0XHRpZiAhbGltaXQgXG5cdFx0XHRsaW1pdCA9IDVcblx0XHRza2lwID0gMFxuXHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXG5cdFx0aWYgIXNpdGVJZCBcblx0XHRcdHJldHVybiBbXVxuXHRcdGlmIGNhdGVnb3J5SWQgXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IGNhdGVnb3J5SWR9LCB7c29ydDoge3Bvc3REYXRlOiAtMX0sIGxpbWl0OiBsaW1pdCwgc2tpcDogc2tpcH0pXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtzaXRlOiBzaXRlSWR9LCB7c29ydDoge3Bvc3REYXRlOiAtMX0sIGxpbWl0OiBsaW1pdCwgc2tpcDogc2tpcH0pXG5cblx0UG9zdHNDb3VudDogKGNhdGVnb3J5SWQpLT5cblx0XHRzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZFxuXHRcdGlmICFzaXRlSWQgXG5cdFx0XHRyZXR1cm4gMFxuXHRcdGlmIGNhdGVnb3J5SWQgXG5cdFx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IGNhdGVnb3J5SWR9KS5jb3VudCgpXG5cdFx0ZWxzZVxuXHRcdFx0cmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtzaXRlOiBzaXRlSWR9KS5jb3VudCgpXG5cdCAgIFxuXHRQb3N0U3VtbWFyeTogLT5cblx0XHRpZiB0aGlzLmJvZHlcblx0XHRcdHJldHVybiB0aGlzLmJvZHkuc3Vic3RyaW5nKDAsIDQwMClcblxuXHRfOiAoa2V5KSAtPlxuXHRcdHJldHVybiBUQVBpMThuLl9fIGtleVxuXG5cdFJlY2VudFBvc3RzOiAoY2F0ZWdvcnlJZCwgbGltaXQsIHNraXApLT5cblx0XHRpZiAhbGltaXQgXG5cdFx0XHRsaW1pdCA9IDVcblx0XHRza2lwID0gMFxuXHRcdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXG5cdFx0Y2F0ID0gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKVxuXHRcdGlmICFjYXQgXG5cdFx0XHRyZXR1cm4gW11cblx0XHRjaGlsZHJlbiA9IGNhdC5jYWxjdWxhdGVDaGlsZHJlbigpO1xuXHRcdGNoaWxkcmVuLnB1c2goY2F0ZWdvcnlJZClcblx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe3NpdGU6IHNpdGVJZCwgY2F0ZWdvcnk6IHskaW46IGNoaWxkcmVufX0sIHtzb3J0OiB7cG9zdERhdGU6IC0xfSwgbGltaXQ6IGxpbWl0LCBza2lwOiBza2lwfSlcblxuXHRNYXJrZG93bjogKHRleHQpLT5cblx0XHRpZiB0ZXh0XG5cdFx0XHRyZXR1cm4gU3BhY2ViYXJzLlNhZmVTdHJpbmcoTWFya2Rvd24odGV4dCkpXG5cblx0U2FmZVN0cmluZzogKHRleHQpLT5cblx0XHRpZiB0ZXh0XG5cdFx0XHRyZXR1cm4gU3BhY2ViYXJzLlNhZmVTdHJpbmcodGV4dClcblxuXHRQb3N0QXR0YWNobWVudFVybDogKGF0dGFjaG1lbnQsaXNQcmV2aWV3KS0+IFxuXHRcdHVybCA9IE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9maWxlcy8je2F0dGFjaG1lbnQuX2lkfS8je2F0dGFjaG1lbnQub3JpZ2luYWwubmFtZX1cIilcblx0XHRpZiAhKHR5cGVvZiBpc1ByZXZpZXcgPT0gXCJib29sZWFuXCIgYW5kIGlzUHJldmlldykgYW5kICFTdGVlZG9zLmlzTW9iaWxlKClcblx0XHRcdHVybCArPSBcIj9kb3dubG9hZD10cnVlXCJcblx0XHRyZXR1cm4gdXJsXG5cblx0SXNJbWFnZUF0dGFjaG1lbnQ6IChhdHRhY2htZW50KS0+XG5cdFx0dHlwZSA9IGF0dGFjaG1lbnQ/Lm9yaWdpbmFsPy50eXBlXG5cdFx0cmV0dXJuIHR5cGU/LnN0YXJ0c1dpdGgoXCJpbWFnZS9cIilcblxuXHRJc0h0bWxBdHRhY2htZW50OiAoYXR0YWNobWVudCktPlxuXHRcdHJldHVybiBhdHRhY2htZW50Py5vcmlnaW5hbD8udHlwZSA9PSBcInRleHQvaHRtbFwiXG5cblx0aXNQcm9kdWN0aW9uOiAoKS0+XG5cdFx0cmV0dXJuIE1ldGVvci5pc1Byb2R1Y3Rpb25cblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIgJ1Bvc3QnLCAtPlxuXHRwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZFxuXHRpZiBwb3N0SWRcblx0XHRyZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmRPbmUoe19pZDogcG9zdElkfSlcblxuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnaW1hZ2VzJywgKHBvc3RJZCktPlxuXHRpZiBwb3N0SWRcblx0XHRwb3N0QXR0YWNobWVudHMgPSBDcmVhdG9yLmdldENvbGxlY3Rpb24oXCJjbXNfZmlsZXNcIikuZmluZCh7J3BhcmVudC5vJzogJ2Ntc19wb3N0cycsICdwYXJlbnQuaWRzJzogcG9zdElkfSwge2ZpZWxkczoge19pZDoxLCB2ZXJzaW9uczogMX19KS5mZXRjaCgpO1xuXHRcdGZpbGVJZHMgPSBbXVxuXHRcdHBvc3RBdHRhY2htZW50cy5mb3JFYWNoIChhdHQpLT5cblx0XHRcdGlmIGF0dD8udmVyc2lvbnMubGVuZ3RoID4gMFxuXHRcdFx0XHRmaWxlSWRzLnB1c2goYXR0LnZlcnNpb25zWzBdKVxuXHRcdHJldHVybiBfLnBsdWNrKGNmcy5maWxlcy5maW5kKHtfaWQ6IHskaW46IGZpbGVJZHN9LCBcIm9yaWdpbmFsLnR5cGVcIjogL2ltYWdlXFwvL30se3NvcnQ6IHtcInVwbG9hZGVkQXRcIjogLTF9fSkuZmV0Y2goKSwgJ19pZCcpXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdBdHRhY2htZW50cycsICgpLT5cblx0cG9zdElkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5wb3N0SWRcblx0aWYgcG9zdElkXG5cdFx0cG9zdEF0dGFjaG1lbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY21zX2ZpbGVzXCIpLmZpbmQoeydwYXJlbnQubyc6ICdjbXNfcG9zdHMnLCAncGFyZW50Lmlkcyc6IHBvc3RJZH0sIHtmaWVsZHM6IHtfaWQ6MSwgdmVyc2lvbnM6IDF9fSkuZmV0Y2goKTtcblx0XHRmaWxlSWRzID0gW11cblx0XHRwb3N0QXR0YWNobWVudHMuZm9yRWFjaCAoYXR0KS0+XG5cdFx0XHRpZiBhdHQ/LnZlcnNpb25zLmxlbmd0aCA+IDBcblx0XHRcdFx0ZmlsZUlkcy5wdXNoKGF0dC52ZXJzaW9uc1swXSlcblxuXHRcdHJldHVybiBjZnMuZmlsZXMuZmluZCh7X2lkOiB7JGluOiBmaWxlSWRzfX0se3NvcnQ6IHtcInVwbG9hZGVkQXRcIjogLTF9fSkuZmV0Y2goKVxuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnU2l0ZUlkJywgLT5cblx0c2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWRcblx0cmV0dXJuIHNpdGVJZFxuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnU2l0ZScsIC0+XG5cdHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkXG5cdGlmIHNpdGVJZFxuXHRcdHJldHVybiBkYi5jbXNfc2l0ZXMuZmluZE9uZSh7X2lkOiBzaXRlSWR9KVxuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlciAnSW5kZXhQYWdlJywgLT5cblx0ZGF0YSA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YVxuXHRpZiAhZGF0YS5wYXJhbXNcblx0XHRyZXR1cm4gZmFsc2U7XG5cdGVsc2UgaWYgZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZFxuXHRcdHJldHVybiBmYWxzZVxuXHRlbHNlIGlmIGRhdGEucGFyYW1zLnBvc3RJZFxuXHRcdHJldHVybiBmYWxzZVxuXHRlbHNlIFxuXHRcdHJldHVybiB0cnVlXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdUYWdQYWdlJywgLT5cblx0dGFnID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy50YWdcblx0aWYgdGFnXG5cdFx0cmV0dXJuIHRydWVcblx0cmV0dXJuIGZhbHNlXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdUYWcnLCAtPlxuXHR0YWcgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnRhZ1xuXHRyZXR1cm4gdGFnXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdQb3N0UGFnZScsIC0+XG5cdHBvc3RJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMucG9zdElkXG5cdGlmIHBvc3RJZFxuXHRcdHJldHVybiB0cnVlXG5cdHJldHVybiBmYWxzZVxuXG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyICdlcXVhbHMnLCAoYSwgYiktPlxuXHRyZXR1cm4gYSA9PSBiXG5cbnJlbmRlclNpdGUgPSAocmVxLCByZXMsIG5leHQpIC0+XG5cdHNpdGUgPSBkYi5jbXNfc2l0ZXMuZmluZE9uZSh7X2lkOiByZXEucGFyYW1zLnNpdGVJZH0pXG5cdFxuXHRpZiAhc2l0ZVxuXHRcdHJlcy53cml0ZUhlYWQgNDA0XG5cdFx0cmVzLmVuZChcIlNpdGUgbm90IGZvdW5kXCIpXG5cdFx0cmV0dXJuXG5cblx0Y29va2llcyA9IG5ldyBDb29raWVzKCByZXEsIHJlcyApO1xuXHR1c2VySWQgPSBjb29raWVzLmdldChcIlgtVXNlci1JZFwiKVxuXHRhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKVxuXG5cdGlmIHVzZXJJZCBhbmQgYXV0aFRva2VuXG5cdFx0aGFzaGVkVG9rZW4gPSBBY2NvdW50cy5faGFzaExvZ2luVG9rZW4oYXV0aFRva2VuKVxuXHRcdHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZVxuXHRcdFx0X2lkOiB1c2VySWQsXG5cdFx0XHRcInNlcnZpY2VzLnJlc3VtZS5sb2dpblRva2Vucy5oYXNoZWRUb2tlblwiOiBoYXNoZWRUb2tlblxuXG5cdHVubGVzcyBzaXRlPy52aXNpYmlsaXR5ID09IFwicHVibGljXCJcblx0XHRyZXMud3JpdGVIZWFkIDQwMVxuXHRcdHJlcy5lbmQoXCJBY2Nlc3MgRGVuaWVkXCIpXG5cdFx0cmV0dXJuXG5cblx0dGVtcGxhdGVOYW1lID0gJ3NpdGVfdGhlbWVfJyArIHNpdGUudGhlbWVcblx0bGF5b3V0ID0gc2l0ZS5sYXlvdXRcblx0aWYgIWxheW91dFxuXHRcdGxheW91dCA9IEFzc2V0cy5nZXRUZXh0KCd0aGVtZXMvZGVmYXVsdC5odG1sJylcblx0U1NSLmNvbXBpbGVUZW1wbGF0ZSgnc2l0ZV90aGVtZV8nICsgc2l0ZS50aGVtZSwgbGF5b3V0KTtcblxuXHRwb3N0SWQgPSByZXEucGFyYW1zLnBvc3RJZFxuXHRpZiBwb3N0SWRcblx0XHRpc1Bvc3RJbmNTdWMgPSBkYi5jbXNfcG9zdHMuZGlyZWN0LnVwZGF0ZSB7XG5cdFx0XHRfaWQ6IHBvc3RJZFxuXHRcdH0sICRpbmM6XG5cdFx0XHR2aWV3Q291bnQ6IDFcblx0XHR1bmxlc3MgaXNQb3N0SW5jU3VjXG5cdFx0XHRjb25zb2xlLmVycm9yIFwiYWRkUG9zdFZpZXdlciB3aGlsZSBwcmV2aWV3aW5nIHNpdGUgcG9zdCBGYWlsZWQuIGNtc19wb3N0cy51cGRhdGUuJGluYyAuLi4je3Bvc3RJZH1cIlxuXG5cdGh0bWwgPSBTU1IucmVuZGVyIHRlbXBsYXRlTmFtZSwgXG5cdFx0cGFyYW1zOiByZXEucGFyYW1zXG5cblx0cmVzLmVuZChodG1sKTtcblxuIyBKc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWRcIiwgKHJlcSwgcmVzLCBuZXh0KS0+XG4jICAgcmVzLnN0YXR1c0NvZGUgPSAzMDI7XG4jICAgcmVzLnNldEhlYWRlciBcIkxvY2F0aW9uXCIsIFwiLi9zL2hvbWVcIlxuIyAgIHJlcy5lbmQoKTtcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkXCIsIHJlbmRlclNpdGUgIFxuXG5Kc29uUm91dGVzLmFkZCBcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvYy86Y2F0ZWdvcnlJZFwiLCByZW5kZXJTaXRlICBcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL3AvOnBvc3RJZFwiLCByZW5kZXJTaXRlICBcblxuSnNvblJvdXRlcy5hZGQgXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL3QvOnRhZ1wiLCByZW5kZXJTaXRlICAiLCJ2YXIgQ29va2llcywgcmVuZGVyU2l0ZTtcblxuQ29va2llcyA9IE5wbS5yZXF1aXJlKFwiY29va2llc1wiKTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXJzID0gZnVuY3Rpb24oZGljdCkge1xuICByZXR1cm4gXy5lYWNoKGRpY3QsIGZ1bmN0aW9uKHYsIGspIHtcbiAgICByZXR1cm4gVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoaywgdik7XG4gIH0pO1xufTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXJzKHtcbiAgQ2F0ZWdvcnlJZDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZDtcbiAgfSxcbiAgQ2F0ZWdvcnlBY3RpdmU6IGZ1bmN0aW9uKGMpIHtcbiAgICB2YXIgY2F0ZWdvcnlJZDtcbiAgICBjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkO1xuICAgIGlmIChjYXRlZ29yeUlkID09PSBjKSB7XG4gICAgICByZXR1cm4gXCJhY3RpdmVcIjtcbiAgICB9XG4gIH0sXG4gIENhdGVnb3J5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgY2F0ZWdvcnlJZDtcbiAgICBjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkO1xuICAgIGlmIChjYXRlZ29yeUlkKSB7XG4gICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKTtcbiAgICB9XG4gIH0sXG4gIFBhcmVudENhdGVnb3J5OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYywgY2F0ZWdvcnlJZDtcbiAgICBjYXRlZ29yeUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5jYXRlZ29yeUlkO1xuICAgIGlmIChjYXRlZ29yeUlkKSB7XG4gICAgICBjID0gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjYXRlZ29yeUlkKTtcbiAgICAgIGlmIChjICE9IG51bGwgPyBjLnBhcmVudCA6IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZGIuY21zX2NhdGVnb3JpZXMuZmluZE9uZShjLnBhcmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBTdWJDYXRlZ29yaWVzOiBmdW5jdGlvbihwYXJlbnQpIHtcbiAgICB2YXIgc2l0ZUlkO1xuICAgIGlmIChwYXJlbnQgPT09IFwicm9vdFwiKSB7XG4gICAgICBzaXRlSWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnNpdGVJZDtcbiAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkLFxuICAgICAgICBwYXJlbnQ6IG51bGxcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIGNyZWF0ZWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYi5jbXNfY2F0ZWdvcmllcy5maW5kKHtcbiAgICAgICAgcGFyZW50OiBwYXJlbnRcbiAgICAgIH0sIHtcbiAgICAgICAgc29ydDoge1xuICAgICAgICAgIG9yZGVyOiAxLFxuICAgICAgICAgIGNyZWF0ZWQ6IDFcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LFxuICBTdWJDYXRlZ29yaWVzQ291bnQ6IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgIHZhciBzaXRlSWQ7XG4gICAgaWYgKHBhcmVudCA9PT0gXCJyb290XCIpIHtcbiAgICAgIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWQsXG4gICAgICAgIHBhcmVudDogbnVsbFxuICAgICAgfSkuY291bnQoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRiLmNtc19jYXRlZ29yaWVzLmZpbmQoe1xuICAgICAgICBwYXJlbnQ6IHBhcmVudFxuICAgICAgfSkuY291bnQoKTtcbiAgICB9XG4gIH0sXG4gIGZyb21Ob3c6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkuZnJvbU5vdygpO1xuICB9LFxuICBEYXRlRm9ybWF0OiBmdW5jdGlvbih2YWx1ZSwgZm9ybWF0U3RyaW5nKSB7XG4gICAgaWYgKCFmb3JtYXRTdHJpbmcpIHtcbiAgICAgIGZvcm1hdFN0cmluZyA9IFwiWVlZWS1NTS1ERFwiO1xuICAgIH1cbiAgICByZXR1cm4gbW9tZW50KHZhbHVlKS5mb3JtYXQoZm9ybWF0U3RyaW5nKTtcbiAgfSxcbiAgUG9zdHM6IGZ1bmN0aW9uKGNhdGVnb3J5SWQsIGxpbWl0LCBza2lwKSB7XG4gICAgdmFyIHNpdGVJZDtcbiAgICBpZiAoIWxpbWl0KSB7XG4gICAgICBsaW1pdCA9IDU7XG4gICAgfVxuICAgIHNraXAgPSAwO1xuICAgIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICAgIGlmICghc2l0ZUlkKSB7XG4gICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIGlmIChjYXRlZ29yeUlkKSB7XG4gICAgICByZXR1cm4gZGIuY21zX3Bvc3RzLmZpbmQoe1xuICAgICAgICBzaXRlOiBzaXRlSWQsXG4gICAgICAgIGNhdGVnb3J5OiBjYXRlZ29yeUlkXG4gICAgICB9LCB7XG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBwb3N0RGF0ZTogLTFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICBza2lwOiBza2lwXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRiLmNtc19wb3N0cy5maW5kKHtcbiAgICAgICAgc2l0ZTogc2l0ZUlkXG4gICAgICB9LCB7XG4gICAgICAgIHNvcnQ6IHtcbiAgICAgICAgICBwb3N0RGF0ZTogLTFcbiAgICAgICAgfSxcbiAgICAgICAgbGltaXQ6IGxpbWl0LFxuICAgICAgICBza2lwOiBza2lwXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFBvc3RzQ291bnQ6IGZ1bmN0aW9uKGNhdGVnb3J5SWQpIHtcbiAgICB2YXIgc2l0ZUlkO1xuICAgIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICAgIGlmICghc2l0ZUlkKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKGNhdGVnb3J5SWQpIHtcbiAgICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZCxcbiAgICAgICAgY2F0ZWdvcnk6IGNhdGVnb3J5SWRcbiAgICAgIH0pLmNvdW50KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7XG4gICAgICAgIHNpdGU6IHNpdGVJZFxuICAgICAgfSkuY291bnQoKTtcbiAgICB9XG4gIH0sXG4gIFBvc3RTdW1tYXJ5OiBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5ib2R5KSB7XG4gICAgICByZXR1cm4gdGhpcy5ib2R5LnN1YnN0cmluZygwLCA0MDApO1xuICAgIH1cbiAgfSxcbiAgXzogZnVuY3Rpb24oa2V5KSB7XG4gICAgcmV0dXJuIFRBUGkxOG4uX18oa2V5KTtcbiAgfSxcbiAgUmVjZW50UG9zdHM6IGZ1bmN0aW9uKGNhdGVnb3J5SWQsIGxpbWl0LCBza2lwKSB7XG4gICAgdmFyIGNhdCwgY2hpbGRyZW4sIHNpdGVJZDtcbiAgICBpZiAoIWxpbWl0KSB7XG4gICAgICBsaW1pdCA9IDU7XG4gICAgfVxuICAgIHNraXAgPSAwO1xuICAgIHNpdGVJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMuc2l0ZUlkO1xuICAgIGNhdCA9IGRiLmNtc19jYXRlZ29yaWVzLmZpbmRPbmUoY2F0ZWdvcnlJZCk7XG4gICAgaWYgKCFjYXQpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgY2hpbGRyZW4gPSBjYXQuY2FsY3VsYXRlQ2hpbGRyZW4oKTtcbiAgICBjaGlsZHJlbi5wdXNoKGNhdGVnb3J5SWQpO1xuICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZCh7XG4gICAgICBzaXRlOiBzaXRlSWQsXG4gICAgICBjYXRlZ29yeToge1xuICAgICAgICAkaW46IGNoaWxkcmVuXG4gICAgICB9XG4gICAgfSwge1xuICAgICAgc29ydDoge1xuICAgICAgICBwb3N0RGF0ZTogLTFcbiAgICAgIH0sXG4gICAgICBsaW1pdDogbGltaXQsXG4gICAgICBza2lwOiBza2lwXG4gICAgfSk7XG4gIH0sXG4gIE1hcmtkb3duOiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgaWYgKHRleHQpIHtcbiAgICAgIHJldHVybiBTcGFjZWJhcnMuU2FmZVN0cmluZyhNYXJrZG93bih0ZXh0KSk7XG4gICAgfVxuICB9LFxuICBTYWZlU3RyaW5nOiBmdW5jdGlvbih0ZXh0KSB7XG4gICAgaWYgKHRleHQpIHtcbiAgICAgIHJldHVybiBTcGFjZWJhcnMuU2FmZVN0cmluZyh0ZXh0KTtcbiAgICB9XG4gIH0sXG4gIFBvc3RBdHRhY2htZW50VXJsOiBmdW5jdGlvbihhdHRhY2htZW50LCBpc1ByZXZpZXcpIHtcbiAgICB2YXIgdXJsO1xuICAgIHVybCA9IE1ldGVvci5hYnNvbHV0ZVVybChcImFwaS9maWxlcy9maWxlcy9cIiArIGF0dGFjaG1lbnQuX2lkICsgXCIvXCIgKyBhdHRhY2htZW50Lm9yaWdpbmFsLm5hbWUpO1xuICAgIGlmICghKHR5cGVvZiBpc1ByZXZpZXcgPT09IFwiYm9vbGVhblwiICYmIGlzUHJldmlldykgJiYgIVN0ZWVkb3MuaXNNb2JpbGUoKSkge1xuICAgICAgdXJsICs9IFwiP2Rvd25sb2FkPXRydWVcIjtcbiAgICB9XG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgSXNJbWFnZUF0dGFjaG1lbnQ6IGZ1bmN0aW9uKGF0dGFjaG1lbnQpIHtcbiAgICB2YXIgcmVmLCB0eXBlO1xuICAgIHR5cGUgPSBhdHRhY2htZW50ICE9IG51bGwgPyAocmVmID0gYXR0YWNobWVudC5vcmlnaW5hbCkgIT0gbnVsbCA/IHJlZi50eXBlIDogdm9pZCAwIDogdm9pZCAwO1xuICAgIHJldHVybiB0eXBlICE9IG51bGwgPyB0eXBlLnN0YXJ0c1dpdGgoXCJpbWFnZS9cIikgOiB2b2lkIDA7XG4gIH0sXG4gIElzSHRtbEF0dGFjaG1lbnQ6IGZ1bmN0aW9uKGF0dGFjaG1lbnQpIHtcbiAgICB2YXIgcmVmO1xuICAgIHJldHVybiAoYXR0YWNobWVudCAhPSBudWxsID8gKHJlZiA9IGF0dGFjaG1lbnQub3JpZ2luYWwpICE9IG51bGwgPyByZWYudHlwZSA6IHZvaWQgMCA6IHZvaWQgMCkgPT09IFwidGV4dC9odG1sXCI7XG4gIH0sXG4gIGlzUHJvZHVjdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIE1ldGVvci5pc1Byb2R1Y3Rpb247XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignUG9zdCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgcG9zdElkO1xuICBwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZDtcbiAgaWYgKHBvc3RJZCkge1xuICAgIHJldHVybiBkYi5jbXNfcG9zdHMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHBvc3RJZFxuICAgIH0pO1xuICB9XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ2ltYWdlcycsIGZ1bmN0aW9uKHBvc3RJZCkge1xuICB2YXIgZmlsZUlkcywgcG9zdEF0dGFjaG1lbnRzO1xuICBpZiAocG9zdElkKSB7XG4gICAgcG9zdEF0dGFjaG1lbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY21zX2ZpbGVzXCIpLmZpbmQoe1xuICAgICAgJ3BhcmVudC5vJzogJ2Ntc19wb3N0cycsXG4gICAgICAncGFyZW50Lmlkcyc6IHBvc3RJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIHZlcnNpb25zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBmaWxlSWRzID0gW107XG4gICAgcG9zdEF0dGFjaG1lbnRzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICBpZiAoKGF0dCAhPSBudWxsID8gYXR0LnZlcnNpb25zLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgIHJldHVybiBmaWxlSWRzLnB1c2goYXR0LnZlcnNpb25zWzBdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gXy5wbHVjayhjZnMuZmlsZXMuZmluZCh7XG4gICAgICBfaWQ6IHtcbiAgICAgICAgJGluOiBmaWxlSWRzXG4gICAgICB9LFxuICAgICAgXCJvcmlnaW5hbC50eXBlXCI6IC9pbWFnZVxcLy9cbiAgICB9LCB7XG4gICAgICBzb3J0OiB7XG4gICAgICAgIFwidXBsb2FkZWRBdFwiOiAtMVxuICAgICAgfVxuICAgIH0pLmZldGNoKCksICdfaWQnKTtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdBdHRhY2htZW50cycsIGZ1bmN0aW9uKCkge1xuICB2YXIgZmlsZUlkcywgcG9zdEF0dGFjaG1lbnRzLCBwb3N0SWQ7XG4gIHBvc3RJZCA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMucG9zdElkO1xuICBpZiAocG9zdElkKSB7XG4gICAgcG9zdEF0dGFjaG1lbnRzID0gQ3JlYXRvci5nZXRDb2xsZWN0aW9uKFwiY21zX2ZpbGVzXCIpLmZpbmQoe1xuICAgICAgJ3BhcmVudC5vJzogJ2Ntc19wb3N0cycsXG4gICAgICAncGFyZW50Lmlkcyc6IHBvc3RJZFxuICAgIH0sIHtcbiAgICAgIGZpZWxkczoge1xuICAgICAgICBfaWQ6IDEsXG4gICAgICAgIHZlcnNpb25zOiAxXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgICBmaWxlSWRzID0gW107XG4gICAgcG9zdEF0dGFjaG1lbnRzLmZvckVhY2goZnVuY3Rpb24oYXR0KSB7XG4gICAgICBpZiAoKGF0dCAhPSBudWxsID8gYXR0LnZlcnNpb25zLmxlbmd0aCA6IHZvaWQgMCkgPiAwKSB7XG4gICAgICAgIHJldHVybiBmaWxlSWRzLnB1c2goYXR0LnZlcnNpb25zWzBdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gY2ZzLmZpbGVzLmZpbmQoe1xuICAgICAgX2lkOiB7XG4gICAgICAgICRpbjogZmlsZUlkc1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIHNvcnQ6IHtcbiAgICAgICAgXCJ1cGxvYWRlZEF0XCI6IC0xXG4gICAgICB9XG4gICAgfSkuZmV0Y2goKTtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdTaXRlSWQnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHNpdGVJZDtcbiAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gIHJldHVybiBzaXRlSWQ7XG59KTtcblxuVGVtcGxhdGUucmVnaXN0ZXJIZWxwZXIoJ1NpdGUnLCBmdW5jdGlvbigpIHtcbiAgdmFyIHNpdGVJZDtcbiAgc2l0ZUlkID0gVGVtcGxhdGUuaW5zdGFuY2UoKS5kYXRhLnBhcmFtcy5zaXRlSWQ7XG4gIGlmIChzaXRlSWQpIHtcbiAgICByZXR1cm4gZGIuY21zX3NpdGVzLmZpbmRPbmUoe1xuICAgICAgX2lkOiBzaXRlSWRcbiAgICB9KTtcbiAgfVxufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdJbmRleFBhZ2UnLCBmdW5jdGlvbigpIHtcbiAgdmFyIGRhdGE7XG4gIGRhdGEgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGE7XG4gIGlmICghZGF0YS5wYXJhbXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSBpZiAoZGF0YS5wYXJhbXMuY2F0ZWdvcnlJZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIGlmIChkYXRhLnBhcmFtcy5wb3N0SWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignVGFnUGFnZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgdGFnO1xuICB0YWcgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnRhZztcbiAgaWYgKHRhZykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignVGFnJywgZnVuY3Rpb24oKSB7XG4gIHZhciB0YWc7XG4gIHRhZyA9IFRlbXBsYXRlLmluc3RhbmNlKCkuZGF0YS5wYXJhbXMudGFnO1xuICByZXR1cm4gdGFnO1xufSk7XG5cblRlbXBsYXRlLnJlZ2lzdGVySGVscGVyKCdQb3N0UGFnZScsIGZ1bmN0aW9uKCkge1xuICB2YXIgcG9zdElkO1xuICBwb3N0SWQgPSBUZW1wbGF0ZS5pbnN0YW5jZSgpLmRhdGEucGFyYW1zLnBvc3RJZDtcbiAgaWYgKHBvc3RJZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pO1xuXG5UZW1wbGF0ZS5yZWdpc3RlckhlbHBlcignZXF1YWxzJywgZnVuY3Rpb24oYSwgYikge1xuICByZXR1cm4gYSA9PT0gYjtcbn0pO1xuXG5yZW5kZXJTaXRlID0gZnVuY3Rpb24ocmVxLCByZXMsIG5leHQpIHtcbiAgdmFyIGF1dGhUb2tlbiwgY29va2llcywgaGFzaGVkVG9rZW4sIGh0bWwsIGlzUG9zdEluY1N1YywgbGF5b3V0LCBwb3N0SWQsIHNpdGUsIHRlbXBsYXRlTmFtZSwgdXNlciwgdXNlcklkO1xuICBzaXRlID0gZGIuY21zX3NpdGVzLmZpbmRPbmUoe1xuICAgIF9pZDogcmVxLnBhcmFtcy5zaXRlSWRcbiAgfSk7XG4gIGlmICghc2l0ZSkge1xuICAgIHJlcy53cml0ZUhlYWQoNDA0KTtcbiAgICByZXMuZW5kKFwiU2l0ZSBub3QgZm91bmRcIik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvb2tpZXMgPSBuZXcgQ29va2llcyhyZXEsIHJlcyk7XG4gIHVzZXJJZCA9IGNvb2tpZXMuZ2V0KFwiWC1Vc2VyLUlkXCIpO1xuICBhdXRoVG9rZW4gPSBjb29raWVzLmdldChcIlgtQXV0aC1Ub2tlblwiKTtcbiAgaWYgKHVzZXJJZCAmJiBhdXRoVG9rZW4pIHtcbiAgICBoYXNoZWRUb2tlbiA9IEFjY291bnRzLl9oYXNoTG9naW5Ub2tlbihhdXRoVG9rZW4pO1xuICAgIHVzZXIgPSBNZXRlb3IudXNlcnMuZmluZE9uZSh7XG4gICAgICBfaWQ6IHVzZXJJZCxcbiAgICAgIFwic2VydmljZXMucmVzdW1lLmxvZ2luVG9rZW5zLmhhc2hlZFRva2VuXCI6IGhhc2hlZFRva2VuXG4gICAgfSk7XG4gIH1cbiAgaWYgKChzaXRlICE9IG51bGwgPyBzaXRlLnZpc2liaWxpdHkgOiB2b2lkIDApICE9PSBcInB1YmxpY1wiKSB7XG4gICAgcmVzLndyaXRlSGVhZCg0MDEpO1xuICAgIHJlcy5lbmQoXCJBY2Nlc3MgRGVuaWVkXCIpO1xuICAgIHJldHVybjtcbiAgfVxuICB0ZW1wbGF0ZU5hbWUgPSAnc2l0ZV90aGVtZV8nICsgc2l0ZS50aGVtZTtcbiAgbGF5b3V0ID0gc2l0ZS5sYXlvdXQ7XG4gIGlmICghbGF5b3V0KSB7XG4gICAgbGF5b3V0ID0gQXNzZXRzLmdldFRleHQoJ3RoZW1lcy9kZWZhdWx0Lmh0bWwnKTtcbiAgfVxuICBTU1IuY29tcGlsZVRlbXBsYXRlKCdzaXRlX3RoZW1lXycgKyBzaXRlLnRoZW1lLCBsYXlvdXQpO1xuICBwb3N0SWQgPSByZXEucGFyYW1zLnBvc3RJZDtcbiAgaWYgKHBvc3RJZCkge1xuICAgIGlzUG9zdEluY1N1YyA9IGRiLmNtc19wb3N0cy5kaXJlY3QudXBkYXRlKHtcbiAgICAgIF9pZDogcG9zdElkXG4gICAgfSwge1xuICAgICAgJGluYzoge1xuICAgICAgICB2aWV3Q291bnQ6IDFcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoIWlzUG9zdEluY1N1Yykge1xuICAgICAgY29uc29sZS5lcnJvcihcImFkZFBvc3RWaWV3ZXIgd2hpbGUgcHJldmlld2luZyBzaXRlIHBvc3QgRmFpbGVkLiBjbXNfcG9zdHMudXBkYXRlLiRpbmMgLi4uXCIgKyBwb3N0SWQpO1xuICAgIH1cbiAgfVxuICBodG1sID0gU1NSLnJlbmRlcih0ZW1wbGF0ZU5hbWUsIHtcbiAgICBwYXJhbXM6IHJlcS5wYXJhbXNcbiAgfSk7XG4gIHJldHVybiByZXMuZW5kKGh0bWwpO1xufTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkXCIsIHJlbmRlclNpdGUpO1xuXG5Kc29uUm91dGVzLmFkZChcImdldFwiLCBcIi9zaXRlLzpzaXRlSWQvYy86Y2F0ZWdvcnlJZFwiLCByZW5kZXJTaXRlKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL3AvOnBvc3RJZFwiLCByZW5kZXJTaXRlKTtcblxuSnNvblJvdXRlcy5hZGQoXCJnZXRcIiwgXCIvc2l0ZS86c2l0ZUlkL3QvOnRhZ1wiLCByZW5kZXJTaXRlKTtcbiIsIk1ldGVvci5zdGFydHVwIC0+XG4gICAgXG4gICAgSnNvblJvdXRlcy5hZGQgJ2dldCcsICcvYXZhdGFyL2Ntc19zaXRlcy86c2l0ZUlkJywgKHJlcSwgcmVzLCBuZXh0KSAtPlxuICAgICAgICBzaXRlID0gZGIuY21zX3NpdGVzLmZpbmRPbmUocmVxLnBhcmFtcy5zaXRlSWQpO1xuICAgICAgICBpZiAhc2l0ZVxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCA0MDFcbiAgICAgICAgICAgIHJlcy5lbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgaWYgc2l0ZS5hdmF0YXJcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIgXCJMb2NhdGlvblwiLCBNZXRlb3IuYWJzb2x1dGVVcmwoXCJhcGkvZmlsZXMvYXZhdGFycy9cIiArIHNpdGUuYXZhdGFyKVxuICAgICAgICAgICAgcmVzLndyaXRlSGVhZCAzMDJcbiAgICAgICAgICAgIHJlcy5lbmQoKVxuICAgICAgICAgICAgcmV0dXJuXG5cbiAgICAgICAgdXNlcm5hbWUgPSBzaXRlLm5hbWU7XG4gICAgICAgIGlmICF1c2VybmFtZVxuICAgICAgICAgICAgdXNlcm5hbWUgPSBcIlwiXG5cbiAgICAgICAgcmVzLnNldEhlYWRlciAnQ29udGVudC1EaXNwb3NpdGlvbicsICdpbmxpbmUnXG5cbiAgICAgICAgaWYgbm90IGZpbGU/XG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyICdjb250ZW50LXR5cGUnLCAnaW1hZ2Uvc3ZnK3htbCdcbiAgICAgICAgICAgIHJlcy5zZXRIZWFkZXIgJ2NhY2hlLWNvbnRyb2wnLCAncHVibGljLCBtYXgtYWdlPTMxNTM2MDAwJ1xuXG4gICAgICAgICAgICBjb2xvcnMgPSBbJyNGNDQzMzYnLCcjRTkxRTYzJywnIzlDMjdCMCcsJyM2NzNBQjcnLCcjM0Y1MUI1JywnIzIxOTZGMycsJyMwM0E5RjQnLCcjMDBCQ0Q0JywnIzAwOTY4OCcsJyM0Q0FGNTAnLCcjOEJDMzRBJywnI0NEREMzOScsJyNGRkMxMDcnLCcjRkY5ODAwJywnI0ZGNTcyMicsJyM3OTU1NDgnLCcjOUU5RTlFJywnIzYwN0Q4QiddXG5cbiAgICAgICAgICAgIHBvc2l0aW9uID0gdXNlcm5hbWUubGVuZ3RoICUgY29sb3JzLmxlbmd0aFxuICAgICAgICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dXG5cbiAgICAgICAgICAgIGluaXRpYWxzID0gJydcbiAgICAgICAgICAgIGlmIHVzZXJuYW1lLmNoYXJDb2RlQXQoMCk+MjU1XG4gICAgICAgICAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMSlcbiAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBpbml0aWFscyA9IHVzZXJuYW1lLnN1YnN0cigwLCAyKVxuXG4gICAgICAgICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKClcblxuICAgICAgICAgICAgc3ZnID0gXCJcIlwiXG4gICAgICAgICAgICA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJVVEYtOFwiIHN0YW5kYWxvbmU9XCJub1wiPz5cbiAgICAgICAgICAgIDxzdmcgeG1sbnM9XCJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Z1wiIHBvaW50ZXItZXZlbnRzPVwibm9uZVwiIHdpZHRoPVwiNTBcIiBoZWlnaHQ9XCI1MFwiIHN0eWxlPVwid2lkdGg6IDUwcHg7IGhlaWdodDogNTBweDsgYmFja2dyb3VuZC1jb2xvcjogI3tjb2xvcn07XCI+XG4gICAgICAgICAgICAgICAgPHRleHQgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiB5PVwiNTAlXCIgeD1cIjUwJVwiIGR5PVwiMC4zNmVtXCIgcG9pbnRlci1ldmVudHM9XCJhdXRvXCIgZmlsbD1cIiNmZmZmZmZcIiBmb250LWZhbWlseT1cIkhlbHZldGljYSwgQXJpYWwsIEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWZcIiBzdHlsZT1cImZvbnQtd2VpZ2h0OiA0MDA7IGZvbnQtc2l6ZTogMjhweDtcIj5cbiAgICAgICAgICAgICAgICAgICAgI3tpbml0aWFsc31cbiAgICAgICAgICAgICAgICA8L3RleHQ+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICAgIFwiXCJcIlxuXG4gICAgICAgICAgICByZXMud3JpdGUgc3ZnXG4gICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgIHJldHVyblxuXG4gICAgICAgIHJlcU1vZGlmaWVkSGVhZGVyID0gcmVxLmhlYWRlcnNbXCJpZi1tb2RpZmllZC1zaW5jZVwiXTtcbiAgICAgICAgaWYgcmVxTW9kaWZpZWRIZWFkZXI/XG4gICAgICAgICAgICBpZiByZXFNb2RpZmllZEhlYWRlciA9PSBzaXRlLm1vZGlmaWVkPy50b1VUQ1N0cmluZygpXG4gICAgICAgICAgICAgICAgcmVzLnNldEhlYWRlciAnTGFzdC1Nb2RpZmllZCcsIHJlcU1vZGlmaWVkSGVhZGVyXG4gICAgICAgICAgICAgICAgcmVzLndyaXRlSGVhZCAzMDRcbiAgICAgICAgICAgICAgICByZXMuZW5kKClcbiAgICAgICAgICAgICAgICByZXR1cm5cblxuICAgICAgICByZXMuc2V0SGVhZGVyICdMYXN0LU1vZGlmaWVkJywgc2l0ZS5tb2RpZmllZD8udG9VVENTdHJpbmcoKSBvciBuZXcgRGF0ZSgpLnRvVVRDU3RyaW5nKClcbiAgICAgICAgcmVzLnNldEhlYWRlciAnY29udGVudC10eXBlJywgJ2ltYWdlL2pwZWcnXG4gICAgICAgIHJlcy5zZXRIZWFkZXIgJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGhcblxuICAgICAgICBmaWxlLnJlYWRTdHJlYW0ucGlwZSByZXNcbiAgICAgICAgcmV0dXJuIiwiTWV0ZW9yLnN0YXJ0dXAoZnVuY3Rpb24oKSB7XG4gIHJldHVybiBKc29uUm91dGVzLmFkZCgnZ2V0JywgJy9hdmF0YXIvY21zX3NpdGVzLzpzaXRlSWQnLCBmdW5jdGlvbihyZXEsIHJlcywgbmV4dCkge1xuICAgIHZhciBjb2xvciwgY29sb3JzLCBpbml0aWFscywgcG9zaXRpb24sIHJlZiwgcmVmMSwgcmVxTW9kaWZpZWRIZWFkZXIsIHNpdGUsIHN2ZywgdXNlcm5hbWU7XG4gICAgc2l0ZSA9IGRiLmNtc19zaXRlcy5maW5kT25lKHJlcS5wYXJhbXMuc2l0ZUlkKTtcbiAgICBpZiAoIXNpdGUpIHtcbiAgICAgIHJlcy53cml0ZUhlYWQoNDAxKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHNpdGUuYXZhdGFyKSB7XG4gICAgICByZXMuc2V0SGVhZGVyKFwiTG9jYXRpb25cIiwgTWV0ZW9yLmFic29sdXRlVXJsKFwiYXBpL2ZpbGVzL2F2YXRhcnMvXCIgKyBzaXRlLmF2YXRhcikpO1xuICAgICAgcmVzLndyaXRlSGVhZCgzMDIpO1xuICAgICAgcmVzLmVuZCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB1c2VybmFtZSA9IHNpdGUubmFtZTtcbiAgICBpZiAoIXVzZXJuYW1lKSB7XG4gICAgICB1c2VybmFtZSA9IFwiXCI7XG4gICAgfVxuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtRGlzcG9zaXRpb24nLCAnaW5saW5lJyk7XG4gICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInVuZGVmaW5lZFwiIHx8IGZpbGUgPT09IG51bGwpIHtcbiAgICAgIHJlcy5zZXRIZWFkZXIoJ2NvbnRlbnQtdHlwZScsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICByZXMuc2V0SGVhZGVyKCdjYWNoZS1jb250cm9sJywgJ3B1YmxpYywgbWF4LWFnZT0zMTUzNjAwMCcpO1xuICAgICAgY29sb3JzID0gWycjRjQ0MzM2JywgJyNFOTFFNjMnLCAnIzlDMjdCMCcsICcjNjczQUI3JywgJyMzRjUxQjUnLCAnIzIxOTZGMycsICcjMDNBOUY0JywgJyMwMEJDRDQnLCAnIzAwOTY4OCcsICcjNENBRjUwJywgJyM4QkMzNEEnLCAnI0NEREMzOScsICcjRkZDMTA3JywgJyNGRjk4MDAnLCAnI0ZGNTcyMicsICcjNzk1NTQ4JywgJyM5RTlFOUUnLCAnIzYwN0Q4QiddO1xuICAgICAgcG9zaXRpb24gPSB1c2VybmFtZS5sZW5ndGggJSBjb2xvcnMubGVuZ3RoO1xuICAgICAgY29sb3IgPSBjb2xvcnNbcG9zaXRpb25dO1xuICAgICAgaW5pdGlhbHMgPSAnJztcbiAgICAgIGlmICh1c2VybmFtZS5jaGFyQ29kZUF0KDApID4gMjU1KSB7XG4gICAgICAgIGluaXRpYWxzID0gdXNlcm5hbWUuc3Vic3RyKDAsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaW5pdGlhbHMgPSB1c2VybmFtZS5zdWJzdHIoMCwgMik7XG4gICAgICB9XG4gICAgICBpbml0aWFscyA9IGluaXRpYWxzLnRvVXBwZXJDYXNlKCk7XG4gICAgICBzdmcgPSBcIjw/eG1sIHZlcnNpb249XFxcIjEuMFxcXCIgZW5jb2Rpbmc9XFxcIlVURi04XFxcIiBzdGFuZGFsb25lPVxcXCJub1xcXCI/PlxcbjxzdmcgeG1sbnM9XFxcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwibm9uZVxcXCIgd2lkdGg9XFxcIjUwXFxcIiBoZWlnaHQ9XFxcIjUwXFxcIiBzdHlsZT1cXFwid2lkdGg6IDUwcHg7IGhlaWdodDogNTBweDsgYmFja2dyb3VuZC1jb2xvcjogXCIgKyBjb2xvciArIFwiO1xcXCI+XFxuICAgIDx0ZXh0IHRleHQtYW5jaG9yPVxcXCJtaWRkbGVcXFwiIHk9XFxcIjUwJVxcXCIgeD1cXFwiNTAlXFxcIiBkeT1cXFwiMC4zNmVtXFxcIiBwb2ludGVyLWV2ZW50cz1cXFwiYXV0b1xcXCIgZmlsbD1cXFwiI2ZmZmZmZlxcXCIgZm9udC1mYW1pbHk9XFxcIkhlbHZldGljYSwgQXJpYWwsIEx1Y2lkYSBHcmFuZGUsIHNhbnMtc2VyaWZcXFwiIHN0eWxlPVxcXCJmb250LXdlaWdodDogNDAwOyBmb250LXNpemU6IDI4cHg7XFxcIj5cXG4gICAgICAgIFwiICsgaW5pdGlhbHMgKyBcIlxcbiAgICA8L3RleHQ+XFxuPC9zdmc+XCI7XG4gICAgICByZXMud3JpdGUoc3ZnKTtcbiAgICAgIHJlcy5lbmQoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmVxTW9kaWZpZWRIZWFkZXIgPSByZXEuaGVhZGVyc1tcImlmLW1vZGlmaWVkLXNpbmNlXCJdO1xuICAgIGlmIChyZXFNb2RpZmllZEhlYWRlciAhPSBudWxsKSB7XG4gICAgICBpZiAocmVxTW9kaWZpZWRIZWFkZXIgPT09ICgocmVmID0gc2l0ZS5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZi50b1VUQ1N0cmluZygpIDogdm9pZCAwKSkge1xuICAgICAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgcmVxTW9kaWZpZWRIZWFkZXIpO1xuICAgICAgICByZXMud3JpdGVIZWFkKDMwNCk7XG4gICAgICAgIHJlcy5lbmQoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICByZXMuc2V0SGVhZGVyKCdMYXN0LU1vZGlmaWVkJywgKChyZWYxID0gc2l0ZS5tb2RpZmllZCkgIT0gbnVsbCA/IHJlZjEudG9VVENTdHJpbmcoKSA6IHZvaWQgMCkgfHwgbmV3IERhdGUoKS50b1VUQ1N0cmluZygpKTtcbiAgICByZXMuc2V0SGVhZGVyKCdjb250ZW50LXR5cGUnLCAnaW1hZ2UvanBlZycpO1xuICAgIHJlcy5zZXRIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZmlsZS5sZW5ndGgpO1xuICAgIGZpbGUucmVhZFN0cmVhbS5waXBlKHJlcyk7XG4gIH0pO1xufSk7XG4iXX0=

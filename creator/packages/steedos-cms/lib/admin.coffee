# db.cms_sites.adminConfig = 
#     icon: "globe"
#     color: "blue"
#     tableColumns: [
#         {name: "name"},
#         {name: "order"},
#         {name: "modified"},
#     ]
#     selector: Selector.selectorCheckSpaceAdmin

# db.cms_categories.adminConfig = 
#     icon: "ion ion-ios-albums-outline"
#     color: "blue"
#     tableColumns: [
#         {name: "name"},
#         {name: "order"},
#         {name: "modified"},
#     ]
#     selector: Selector.selectorCheckSpaceAdmin

# db.cms_posts.adminConfig = 
#     icon: "globe"
#     color: "blue"
#     tableColumns: [
#         {name: "title"},
#         {name: "author_name"},
#         {name: "modified"},
#     ]
#     selector: Selector.selectorCheckSpaceAdmin

# Meteor.startup ->

#     @cms_categories = db.cms_categories
#     @cms_sites = db.cms_sites
#     @cms_posts = db.cms_posts
#     @cms_pages = db.cms_pages
#     @cms_tags = db.cms_tags
#     AdminConfig?.collections_add
#         cms_categories: db.cms_categories.adminConfig
#         cms_sites: db.cms_sites.adminConfig
#         cms_posts: db.cms_posts.adminConfig
#         cms_pages: db.cms_pages.adminConfig
#         cms_tags: db.cms_tags.adminConfig


Template.monitor.helpers({

  boxName: function () {
    return Session.get("box");
  },

  categories: function () {
    return WorkflowManager.getSpaceCategories();
  },

  categoryFlows: function (cateId) {
    var forms = db.forms.find({category:cateId});
    var flows = [];
    forms.forEach(function(f){
      db.flows.find({form:f._id}).forEach(function(fl){
        flows.push(fl)
      })
    });
    return flows;
  },

  notCategoryFlows: function () {
    var forms = db.forms.find({category:{$in:[null,""]}});
    var flows = [];
    forms.forEach(function(f){
      db.flows.find({form:f._id}).forEach(function(fl){
        flows.push(fl)
      })
    });
    return flows;
  },

  spaceId: function() {
    return Session.get("spaceId");
  }

});

Template.monitor.events({


  "click [name='selectCategory']": function (event, template) {
    var d = $(event.currentTarget), c = "normal",
        e = d.next();
    if (e.is(".treeview-menu") && e.is(":visible") && !$("body").hasClass("sidebar-collapse")) e.slideUp(c, function() {
        e.removeClass("menu-open")
    }), e.parent("li").removeClass("active");
    else if (e.is(".treeview-menu") && !e.is(":visible")) {
        var f = d.parents("ul").first(),
            g = f.find("ul:visible").slideUp(c);
        g.removeClass("menu-open");
        var h = d.parent("li");
        e.slideDown(c, function() {
            e.addClass("menu-open"), f.find("li.active").removeClass("active"), h.addClass("active");
        })
    }
    e.is(".treeview-menu") && event.preventDefault()
  },


})

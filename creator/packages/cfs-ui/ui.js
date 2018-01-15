/* global Helpers:true */
/* global Template */
/* global FS */

Helpers = {};

// We expose the properties of Helpers on `FS` globally
Template.registerHelper('FS', Helpers);

// Usage: {{#with FS.GetFile collectionName id}}{{/with}}
Helpers.GetFile = function cfsGetFile(collectionName, id) {
  var collection = FS._collections[collectionName];
  return collection ? collection.findOne(id) : null;
};

// Usage: {{> FS.DeleteButton}} or {{#FS.DeleteButton}}Button Text{{/FS.DeleteButton}} (with FS.File as current context)
// Supported Options: any attribute
Helpers.DeleteButton = Template._fs_DeleteButton;

Template._fs_DeleteButton2.events({
  'click button': function(event, template) {
    var fileObj = template.data.fileObj;
    if (!fileObj) {
      return false;
    }
    fileObj.remove();
    return false;
  }
});

// Usage: {{> FS.UploadProgressBar attribute=value}} (with FS.File as current context or not for overall)
Helpers.UploadProgressBar = Template._fs_UploadProgressBar;

Template._fs_UploadProgressBar.helpers({
  getAttsAndFileObj: function getAttsAndFileObj(atts, fileObj) {
    if (atts instanceof FS.File) {
      fileObj = atts;
      atts = {};
    } else {
      atts = atts || {};
    }

    var progressFunc;
    if (fileObj instanceof FS.File) {
      progressFunc = function () {
        return fileObj.uploadProgress();
      };
    } else {
      progressFunc = function () {
        return FS.HTTP.uploadQueue.progress();
      };
    }

    // We clone atts so that we can remove bootstrap or semantic props without losing them for
    // later reactive reruns.
    atts = FS.Utility.extend({}, atts);

    var useBootstrap = false, useSemantic = false, show_percentage = false;
    if (atts.semantic) {
      useSemantic = true;
      if (typeof atts["class"] === "string") {
        atts["class"] += " ui progress";
      } else {
        atts["class"] = "ui progress";
      }
      delete atts.semantic;
    } else if (atts.bootstrap) {
      useBootstrap = true;
      var progress = progressFunc();
      if (typeof atts["class"] === "string") {
        atts["class"] += " progress-bar";
      } else {
        atts["class"] = "progress-bar";
      }
      if (typeof atts.style === "string") {
        atts.style += " width: " + progress + "%;";
      } else {
        atts.style = "width: " + progress + "%;";
      }
      if (atts.showPercent) show_percentage = true;
      atts.role = "progressbar";
      atts["aria-valuenow"] = ''+progress;
      atts["aria-valuemin"] = "0";
      atts["aria-valuemax"] = "100";
      delete atts.bootstrap;
    }

    return {
      progress: progressFunc,
      atts: atts,
      showPercent : show_percentage,
      useBootstrap: useBootstrap,
      useSemantic: useSemantic
    };
  }
});

FS.EventHandlers = {};

// Simplifies some of the repetitive code for making an event handler that does a file insert
FS.EventHandlers.insertFiles = function cfsInsertFiles(collection, options) {
  options = options || {};
  var afterCallback = options.after;
  var metadataCallback = options.metadata;

  function insertFilesHandler(event) {
    FS.Utility.eachFile(event, function (file) {
      var f = new FS.File(file);
      if (metadataCallback) {
        FS.Utility.extend(f, metadataCallback(f));
      }
      collection.insert(f, afterCallback);
    });
  }

  return insertFilesHandler;
};

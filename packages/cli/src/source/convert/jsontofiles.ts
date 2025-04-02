const _ = require("underscore");
//const _data = require(__dirname + '/data/steedosPackage.json');
const fs = require("fs");
const yaml = require("js-yaml");
const path = require("path");

//获取所有layouts
async function getLayouts(layouts) {
  return _.keys(layouts);
}

// 获取layout json数据
async function getLayout(layoutName, layouts) {
  return _.find(layouts, function (layout, name) {
    return name === layoutName;
  });
}

//获取所有对象列表
async function getObjects(obejcts) {
  return _.keys(obejcts);
}

// 获取对象json数据
async function getObject(objectApiName, objects) {
  return _.find(objects, function (object, name) {
    return name === objectApiName;
  });
}

async function getObjectMain(objectName, objects) {
  let obj = {};
  obj["name"] = objectName;
  let object = _.find(objects, function (object, name) {
    return name === objectName;
  });

  _.map(object, function (value, key) {
    if (
      key !== "fields" &&
      key !== "listviews" &&
      key !== "permissions" &&
      key !== "buttons"
    ) {
      obj[key] = value;
    }
  });
  return obj;
}

//获取对象field列表
async function getObjectFields(object) {
  return _.keys(object.fields);
}

// 获取filed详情
async function getObjectField(object, fieldApiName) {
  return _.find(object.fields, function (field, name) {
    return name === fieldApiName;
  });
}

//获取对象listView列表
async function getObjectListViews(object) {
  return _.keys(object.listviews);
}

// 获取listView详情
async function getObjectListView(object, listViewName) {
  return _.find(object.listviews, function (listviews, name) {
    return name === listViewName;
  });
}

//获取对象permissions列表
async function getObjectPermissions(object) {
  return _.keys(object.permissions);
}

// 获取permission详情
async function getObjectPermission(object, permissionName) {
  return _.find(object.permissions, function (listView, name) {
    return name === permissionName;
  });
}

//获取对象buttons列表
async function getObjectButtons(object) {
  return _.keys(object.buttons);
}

// 获取button详情
async function getObjectButton(object, buttonName) {
  return _.find(object.buttons, function (button, name) {
    return name === buttonName;
  });
}

//创建并获取对象的主目录
function getMainObjectsFoldIsExisted(targetPath) {
  let folderName = "";
  let folderNames = targetPath.split(path.sep);

  folderNames.forEach(function (val, index) {
    folderName += val + path.sep;

    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  });
  return folderName;
}

async function permissionsetsTolocal(folderName, fileName, permissionsets) {
  let ymlData = yaml.dump(permissionsets);
  fs.writeFileSync(path.join(folderName, fileName), ymlData);
}

//将permissionsets写入本地
async function permissionsetsToLocalFile(steedosPackage, targetPath) {
  let permissionsets = steedosPackage.permissionsets;
  let sets = _.keys(permissionsets);
  for (const k in sets) {
    if (Object.prototype.hasOwnProperty.call(sets, k)) {
      let setName = sets[k];

      let set = permissionsets[setName];
      set = Object.assign({}, { name: setName }, set);
      let targetPathObj = "";
      if (targetPath.indexOf("permissionsets") < 0) {
        targetPathObj = path.join(targetPath, "permissionsets");
      }

      let setsFolderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = setName + ".permissionset.yml";
      await permissionsetsTolocal(setsFolderName, fileName, set);
    }
  }
  return permissionsets;
}

async function profilesTolocal(folderName, fileName, permissionsets) {
  let ymlData = yaml.dump(permissionsets);
  fs.writeFileSync(path.join(folderName, fileName), ymlData);
}

//将profiles写入本地
async function profilesToLocalFile(steedosPackage, targetPath) {
  let profiles = steedosPackage.profiles;
  let pros = _.keys(profiles);
  for (const k in pros) {
    if (Object.prototype.hasOwnProperty.call(pros, k)) {
      let proName = pros[k];
      let pro = profiles[proName];
      let profile = {};
      if (proName === "supplier" || proName === "customer") {
        profile = Object.assign({}, { name: proName }, pro);
      } else {
        profile = Object.assign({}, { name: proName }, pro);
      }
      let targetPathObj = "";
      if (targetPath.indexOf("profiles") < 0) {
        targetPathObj = path.join(targetPath, "profiles");
      }

      let prosFolderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = proName + ".profile.yml";
      await profilesTolocal(prosFolderName, fileName, profile);
    }
  }
  return profiles;
}

async function clientsToLocalFile(steedosPackage, targetPath) {
  let clients = steedosPackage.clients;
  let clientKeys = _.keys(clients);
  for (const key in clientKeys) {
    if (Object.prototype.hasOwnProperty.call(clientKeys, key)) {
      let clientKey = clientKeys[key];
      let client = clients[clientKey];
      let targetPathObj = "";
      if (targetPath.indexOf("client") < 0) {
        targetPathObj = path.join(targetPath, "client");
      }
      let folderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = clientKey + ".js";
      fs.writeFileSync(path.join(folderName, fileName), client);
    }
  }
}

async function serversToLocalFile(steedosPackage, targetPath) {
  let servers = steedosPackage.servers;
  let serverKeys = _.keys(servers);
  for (const key in serverKeys) {
    if (Object.prototype.hasOwnProperty.call(serverKeys, key)) {
      let serverKey = serverKeys[key];
      let server = servers[serverKey];
      let targetPathObj = "";
      if (targetPath.indexOf("server") < 0) {
        targetPathObj = path.join(targetPath, "server");
      }
      let folderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = serverKey + ".js";
      fs.writeFileSync(path.join(folderName, fileName), server);
    }
  }
}

async function triggersToLocalFile(steedosPackage, targetPath) {
  let triggers = steedosPackage.triggers;
  let triggerKeys = _.keys(triggers);
  for (const key in triggerKeys) {
    if (Object.prototype.hasOwnProperty.call(triggerKeys, key)) {
      let triggerKey = triggerKeys[key];
      let trigger = triggers[triggerKey];
      let targetPathObj = "";
      if (targetPath.indexOf("triggers") < 0) {
        targetPathObj = path.join(targetPath, "triggers");
      }
      let folderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = triggerKey + ".js";
      fs.writeFileSync(path.join(folderName, fileName), trigger);
    }
  }
}

async function functionsToLocalFile(steedosPackage, targetPath) {
  let functions = steedosPackage.functions;
  let functionKeys = _.keys(functions);
  for (const key in functionKeys) {
    if (Object.prototype.hasOwnProperty.call(functionKeys, key)) {
      let functionKey = functionKeys[key];
      let fn = functions[functionKeys];
      let targetPathObj = "";
      if (targetPath.indexOf("functions") < 0) {
        targetPathObj = path.join(targetPath, "functions");
      }
      let folderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = functionKey + ".js";
      fs.writeFileSync(path.join(folderName, fileName), fn);
    }
  }
}

async function applicationsTolocal(folderName, fileName, applications) {
  let ymlData = yaml.dump(applications);
  fs.writeFileSync(path.join(folderName, fileName), ymlData);
}

//将applications写入本地
async function applicationsToLocalFile(steedosPackage, targetPath) {
  let applications = steedosPackage.applications;
  let apps = _.keys(applications);
  for (const k in apps) {
    if (Object.prototype.hasOwnProperty.call(apps, k)) {
      let appName = apps[k];
      let app = applications[appName];
      let visible = app["visible"];
      if (typeof visible == "undefined") {
        app["visible"] = true;
      }
      let targetPathObj = "";
      if (targetPath.indexOf("applications") < 0) {
        targetPathObj = path.join(targetPath, "applications");
      }
      let application = Object.assign({}, { code: appName }, app);

      let appsFolderName = getMainObjectsFoldIsExisted(targetPathObj);
      let fileName = appName + ".app.yml";
      await applicationsTolocal(appsFolderName, fileName, application);
    }
  }
  return applications;
}

async function layoutsToLocal(folderName, fileName, layout) {
  // //创建单个目录
  // try{
  //     fs.statSync(folderName);
  // }catch(e){
  //     //目录不存在的情况下
  //     if(e.code == "ENOENT"){
  //         fs.mkdirSync(folderName);
  //     }
  // }
  let ymlData = yaml.dump(layout);
  fs.writeFileSync(path.join(folderName, fileName), ymlData);
}
//将layouts写入本地
async function layoutsToLocalFile(steedosPackage, targetPath) {
  let layouts = steedosPackage.layouts;
  let outs = await getLayouts(layouts);
  for (let k in outs) {
    let layoutName = outs[k];
    let targetPathObj = "";
    if (targetPath.indexOf("layouts") < 0) {
      targetPathObj = path.join(targetPath, "layouts");
    }

    let layoutsFolderName = getMainObjectsFoldIsExisted(targetPathObj);
    let layout = await getLayout(layoutName, layouts);
    //let folderName = layoutsFolderName + layoutName;
    let fileName = layoutName + ".layout.yml";
    await layoutsToLocal(layoutsFolderName, fileName, layout);
  }
  return layouts;
}

async function objectsToLocal(folderName, fileName, obj) {
  //创建单个对象目录
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  let ymlData = yaml.dump(obj);
  fs.writeFileSync(path.join(folderName, fileName), ymlData);
}

//将objects写入本地
async function objectsToLocalFile(steedosPackage, targetPath) {
  let objects = {};
  let rawObjects = steedosPackage.objects;

  let objs = await getObjects(rawObjects);

  for (let index in objs) {
    let objectName = objs[index];
    let targetPathObj = "";
    if (targetPath.indexOf("objects") < 0) {
      targetPathObj = path.join(targetPath, "objects");
    }

    let objectsFolderName = getMainObjectsFoldIsExisted(targetPathObj);

    let objAttrs = await getObjectMain(objectName, rawObjects);
    let folderName = objectsFolderName + objectName;
    let fileName = objectName + ".object.yml";
    await objectsToLocal(folderName, fileName, objAttrs);
    let rawObject = await getObject(objectName, rawObjects);
    let fields = await fieldsToLocalFile(targetPathObj, rawObject);

    let listViews = await listViewsToLocalFile(targetPathObj, rawObject);

    let permissions = await permissionsToLocalFile(targetPathObj, rawObject);

    let buttons = await buttonsToLocalFile(targetPathObj, rawObject);
    //console.log(buttons);
    objAttrs["fields"] = fields;
    objAttrs["listviews"] = listViews;
    objAttrs["permissions"] = permissions;
    objAttrs["buttons"] = buttons;
    objects[objectName] = objAttrs;
    // setTimeout(async () => {

    // }, 3000);
  }
  return objects;
}

async function fieldToLocal(targetPath, fieldName, field, object) {
  let objectName = object.name;

  let fieldPath = path.join(targetPath, objectName, "fields");

  let folderName = getMainObjectsFoldIsExisted(fieldPath);

  let fileName = fieldName + ".field.yml";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  try {
    let ymlData = yaml.dump(field);
    fs.writeFileSync(path.join(folderName, fileName), ymlData);
  } catch (e) {
    console.log(e);
  }
}

//将fields写入本地
async function fieldsToLocalFile(targetPath, object) {
  let fields = {};
  let rawFields = await getObjectFields(object);

  for (let key in rawFields) {
    let fieldName = rawFields[key];
    let field = await getObjectField(object, fieldName);
    field = Object.assign({}, { name: fieldName }, field);
    fields[fieldName] = field;
    await fieldToLocal(targetPath, fieldName, field, object).catch(
      function (err) {
        console.log("fieldToLocal err", err);
      },
    );
  }
  return fields;
}

async function listViewsToLocal(targetPath, listViewName, listView, object) {
  let objectName = object.name;

  let listViewPath = path.join(targetPath, objectName, "listviews");
  let folderName = getMainObjectsFoldIsExisted(listViewPath);
  let fileName = listViewName + ".listview.yml";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  try {
    let ymlData = yaml.dump(listView);
    fs.writeFileSync(path.join(folderName, fileName), ymlData);
  } catch (e) {
    console.log(e);
  }
}

//将listViews写入本地
async function listViewsToLocalFile(targetPath, object) {
  let listViews = {};
  let listViewsName = await getObjectListViews(object);

  for (let key in listViewsName) {
    let name = listViewsName[key];
    let listView = await getObjectListView(object, name);
    listView = Object.assign({}, { name: name }, listView);
    listViews[name] = listView;
    await listViewsToLocal(targetPath, name, listView, object).catch(
      function (err) {
        console.log("listViewsToLOcal err", err);
      },
    );
  }

  return listViews;
}

async function permissionsToLocal(
  targetPath,
  permissionName,
  permission,
  object,
) {
  let objectName = object.name;

  let permissionPath = path.join(targetPath, objectName, "permissions");
  let folderName = getMainObjectsFoldIsExisted(permissionPath);
  let fileName = permissionName + ".permission.yml";

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  try {
    let ymlData = yaml.dump(permission);
    fs.writeFileSync(path.join(folderName, fileName), ymlData);
  } catch (e) {
    console.log(e);
  }
}

//将permissions写入本地
async function permissionsToLocalFile(targetPath, object) {
  let permissions = {};
  let permissionsName = await getObjectPermissions(object);
  for (let key in permissionsName) {
    let name = permissionsName[key];
    let permission = await getObjectPermission(object, name);
    permission = Object.assign({}, { permission_set_id: name }, permission);
    permissions[name] = permission;
    await permissionsToLocal(targetPath, name, permission, object).catch(
      function (err) {
        console.log("permissionsToLocal err", err);
      },
    );
  }

  return permissions;
}

async function buttonsToLocal(targetPath, buttonName, button, object) {
  let objectName = object.name;

  let buttonPath = path.join(targetPath, objectName, "buttons");
  let folderName = getMainObjectsFoldIsExisted(buttonPath);
  let fileName = buttonName + ".button.yml";

  let jsFileName = buttonName + ".button.js";
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
  try {
    let jsData = button.todo;
    fs.writeFileSync(path.join(folderName, jsFileName), jsData);

    delete button.todo;
    let ymlData = yaml.dump(button);
    fs.writeFileSync(path.join(folderName, fileName), ymlData);
  } catch (e) {
    console.log(e);
  }
}

//将buttons写入本地
async function buttonsToLocalFile(targetPath, object) {
  let buttons = {};
  let buttonsName = await getObjectButtons(object);

  if (buttonsName.length > 0) {
    for (let key in buttonsName) {
      let name = buttonsName[key];

      let button = await getObjectButton(object, name);
      button = Object.assign({}, { name: name }, button);
      buttons[name] = button;

      await buttonsToLocal(targetPath, name, button, object).catch(
        function (err) {
          console.log("buttonsToLocal err", err);
        },
      );
    }
  }
  return buttons;
}
export async function filesTolocalJson(steedosPackageJson, targetPath: string) {
  let steedosPackage: any = {};
  let objects = await objectsToLocalFile(steedosPackageJson, targetPath);
  //console.log(objects);
  let layouts = await layoutsToLocalFile(steedosPackageJson, targetPath);
  //console.log(layouts);
  let applications = await applicationsToLocalFile(
    steedosPackageJson,
    targetPath,
  );

  let permissionsets = await permissionsetsToLocalFile(
    steedosPackageJson,
    targetPath,
  );

  let profiles = await profilesToLocalFile(steedosPackageJson, targetPath);

  let client = await clientsToLocalFile(steedosPackageJson, targetPath);

  let server = await serversToLocalFile(steedosPackageJson, targetPath);

  let triggers = await triggersToLocalFile(steedosPackageJson, targetPath);

  let functions = await functionsToLocalFile(steedosPackageJson, targetPath);

  steedosPackage.layouts = layouts;
  steedosPackage.objects = objects;
  steedosPackage.applications = applications;
  steedosPackage.permissionsets = permissionsets;
  steedosPackage.profiles = profiles;
  steedosPackage.clients = client;
  steedosPackage.servers = server;
  steedosPackage.triggers = triggers;
  steedosPackage.functions = functions;

  // let targetFolderName = './data';
  // try{
  //     fs.statSync(targetFolderName);
  // }catch(e){
  //     //目录不存在的情况下
  //     if(e.code == "ENOENT"){
  //         fs.mkdirSync(targetFolderName);
  //     }
  // }
  // fs.writeFileSync(targetFolderName + '/steedosPackagenew.json', JSON.stringify(steedosPackage));

  return steedosPackage;
}

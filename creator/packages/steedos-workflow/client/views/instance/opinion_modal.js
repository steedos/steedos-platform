Template.opinion_modal.helpers({
    opinions: function() {
        var opinions = [];
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            opinions = o.value.workflow;
        }
        return opinions;
    }
})

Template.opinion_modal.events({

    'click .btn-select-opinion': function(event, template) {
        if($(event.currentTarget).css("zIndex") != "auto"){
            // 触发slip:reorder事件，拖动到最顶部无效区域时会触发该事件，且zIndex属性为"99999"，默认为"auto"
            return;
        }

        var oldVal = Session.get("flow_comment");
        var selectedVal = event.currentTarget.dataset.opinion;
        selectedVal = selectedVal ? selectedVal : "";
        if(template.data.parentNode)
			template.data.parentNode.val(oldVal + selectedVal).trigger("input").focus();
        Modal.hide(template);
    },

    'click .btn-new-opinion': function(event, template) {
        Modal.hide(template);

        swal({
            title: t('instance_opinion_input'),
            type: "input",
            showCancelButton: true,
            closeOnConfirm: false,
            confirmButtonText: t('OK'),
            cancelButtonText: t('Cancel'),
            showLoaderOnConfirm: false
        }, function(inputValue) {
            if (inputValue === false){
                Modal.show('opinion_modal', template.data);
                return false;
            }
            if (inputValue.trim() === "") {
                toastr.error(t('instance_opinion_input'));
                return false
            }

            inputValue = inputValue.trim();
            var opinions = [];
            var o = db.steedos_keyvalues.findOne({
                user: Meteor.userId(),
                key: 'flow_opinions',
                'value.workflow': {
                    $exists: true
                }
            });

            if (o) {
                opinions = o.value.workflow;
                // 判断是否已经存在
                if (opinions.includes(inputValue)) {
                    toastr.error(t('instance_opinion_exists'));
                    return false;
                }

                opinions.unshift(inputValue);
            } else {
                opinions = [inputValue];
            }

            $("body").addClass("loading");
            Meteor.call('setKeyValue', 'flow_opinions', {
                workflow: opinions
            }, function(error, result) {
                $("body").removeClass("loading");
                if (error) {
                    toastr.error(t('instance_opinion_error') + error.message);
                }

                if (result == true) {
                    Modal.show('opinion_modal', template.data);
                    swal.close();
                    toastr.success(t('instance_opinion_add_success'));
                }

            });


        });
    },

    'click .btn-edit-opinion': function(event, template) {
        Modal.hide(template);
        var opinions = [];
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            opinions = o.value.workflow;
            var index = opinions.indexOf(event.currentTarget.dataset.opinion);
            if (index > -1) {
                swal({
                    title: t('instance_opinion_edit'),
                    type: "input",
                    inputValue: opinions[index],
                    showCancelButton: true,
                    closeOnConfirm: false,
                    confirmButtonText: t('OK'),
                    cancelButtonText: t('Cancel'),
                    showLoaderOnConfirm: false
                }, function(inputValue) {
                    if (inputValue === false){
                        Modal.show('opinion_modal', template.data);
                        return false;
                    }
                    if (inputValue.trim() === "") {
                        toastr.error(t('instance_opinion_input'));
                        return false
                    }

                    inputValue = inputValue.trim();
                    var opinions = [];
                    var o = db.steedos_keyvalues.findOne({
                        user: Meteor.userId(),
                        key: 'flow_opinions',
                        'value.workflow': {
                            $exists: true
                        }
                    });

                    if (o) {
                        opinions = o.value.workflow;
                        // 判断是否已经存在
                        var indexOfOpinions = opinions.indexOf(inputValue);
                        if (indexOfOpinions > -1 && indexOfOpinions != index) {
                            toastr.error(t('instance_opinion_exists'));
                            return false;
                        }

                        opinions[index] = inputValue;
                    } else {
                        opinions = [inputValue];
                    }
                    $("body").addClass("loading");
                    Meteor.call('setKeyValue', 'flow_opinions', {
                        workflow: opinions
                    }, function(error, result) {
                        $("body").removeClass("loading");
                        if (error) {
                            toastr.error(t('instance_opinion_error') + error.message);
                        }

                        if (result == true) {
                            Modal.show('opinion_modal', template.data);
                            swal.close();
                            toastr.success(t('instance_opinion_edit_success'));
                        }
                    });

                });
            }
        }
        return false;
    },

    'click .btn-remove-opinion': function(event, template) {
        var opinions = [],targetOpinion;
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            opinions = o.value.workflow;
            targetOpinion = event.currentTarget.dataset.opinion;
            if(targetOpinion == undefined){
                // 某些异常操作下会出现undefined的情况，这时其值为null
                targetOpinion = null;
            }
            var index = opinions.indexOf(targetOpinion);
            if (index > -1) {
                opinions.splice(index, 1);

                $("body").addClass("loading");
                Meteor.call('setKeyValue', 'flow_opinions', {
                    workflow: opinions
                }, function(error, result) {
                    $("body").removeClass("loading");
                    if (error) {
                        toastr.error(t('instance_opinion_error') + error.message);
                    }

                    if (result == true) {
                        toastr.success(t('instance_opinion_remove_success'));
                    }

                });
            }
        }
        return false;
    },

    'click .btn-moveup-opinion': function(event, template) {
        var selected = event.target.dataset.opinion;
        var opinions = [];
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            var opinions = o.value.workflow;
            var index = opinions.indexOf(selected);
            if (index == 0) return;
            var f = opinions[index - 1];
            opinions[index - 1] = selected;
            opinions[index] = f;
            Meteor.call('setKeyValue', 'flow_opinions', {
                workflow: opinions
            }, function(error, result) {

                if (error) {
                    swal({
                        title: "Error!",
                        type: "error",
                        text: error,
                        closeOnConfirm: true,
                        confirmButtonText: t('OK')
                    });
                }

            });
        }
    },

    'click .btn-movedown-opinion': function(event, template) {
        var selected = event.target.dataset.opinion;
        var opinions = [];
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            var opinions = o.value.workflow;
            var index = opinions.indexOf(selected);
            if (index == (opinions.length - 1)) return;
            var f = opinions[index + 1];
            opinions[index + 1] = selected;
            opinions[index] = f;
            Meteor.call('setKeyValue', 'flow_opinions', {
                workflow: opinions
            }, function(error, result) {

                if (error) {
                    swal({
                        title: "Error!",
                        type: "error",
                        text: error,
                        closeOnConfirm: true,
                        confirmButtonText: t('OK')
                    });
                }

            });
        }
    }
})

Template.opinion_modal.onRendered(function(){

    var list = $(".slippylist")[0];
    list.addEventListener('slip:beforereorder', function(event){
        if (/slip-no-reorder/.test(event.target.className)) {
            event.preventDefault();
        }
    }, false);
    list.addEventListener('slip:beforeswipe', function(event){
        // 不做左右方向的移动
        event.preventDefault();
    }, false);
    list.addEventListener('slip:beforewait', function(event){
        //保证class中有instant的才上下移动，否则长按才上下移动
        if (event.target.className.indexOf('instant') >= 0) event.preventDefault();
    }, false);
    list.addEventListener('slip:reorder', function(event){
        var opinions = [];
        var o = db.steedos_keyvalues.findOne({
            user: Meteor.userId(),
            key: 'flow_opinions',
            'value.workflow': {
                $exists: true
            }
        });
        if (o) {
            var opinions = o.value.workflow;
            var movedItem = opinions[event.detail.originalIndex];
            opinions.splice(event.detail.originalIndex, 1); // Remove item from the previous position
            opinions.splice(event.detail.spliceIndex, 0, movedItem); // Insert item in the new position

            event.target.parentNode.insertBefore(event.target, event.detail.insertBefore);

            $("body").addClass("loading");
            Meteor.call('setKeyValue', 'flow_opinions', {
                workflow: opinions
            }, function(error, result) {
                $("body").removeClass("loading");
                if (error) {
                    toastr.error(t('instance_opinion_error') + error.message);
                    Modal.hide('opinion_modal');
                    setTimeout(function(){
                        Modal.show('opinion_modal');
                    },1000);
                }
            });
        }
        return false;
    }, false);
    new Slip(list);
});
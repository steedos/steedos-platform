Template.loginLayout.helpers
        isSteedosForCNUS: ->
                return /^(cn|us)\.steedos.com/.test(location.host)
                

Template.loginLayout.onCreated ->
        self = this;

        $(window).resize ->
                $(".login.content-wrapper").css("min-height", ($(window).height()-50) + "px");


Template.loginLayout.onRendered ->

        $(window).resize();

        if ($("body").hasClass('sidebar-open')) 
                $("body").removeClass('sidebar-open');

Template.loginLayout.events

        'click #btnLogout': (e, t) ->
                FlowRouter.go("/steedos/logout")

        'click #btnSignIn': (e, t) ->
                FlowRouter.go("/steedos/sign-in")
                
        'click #btnSignUp': (e, t) ->
                FlowRouter.go("/steedos/sign-up")

        'click #previousVersion': (e,t)->
                Steedos.openWindow(Steedos.absoluteUrl("system/steedos/"))

        'click #quickGuide': (e, t) ->
                if Steedos.getLocale() == "zh-cn"
                        Steedos.openWindow("http://oss.steedos.com/videos/cn/quick_guide.mp4")
                else
                        Steedos.openWindow("http://oss.steedos.com/videos/us/quick_guide.mp4")


        'click #btnHelp': (e, t) ->
                if Steedos.getLocale() == "zh-cn"
                        Steedos.openWindow("https://www.steedos.com/cn/help/")
                else
                        Steedos.openWindow("https://www.steedos.com/us/help/")
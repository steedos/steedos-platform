
Template.loginLayout.onCreated ->
        self = this

        $(window).resize ->
                $(".login.content-wrapper").css("min-height", ($(window).height()-50) + "px");


Template.loginLayout.onRendered ->

        $(window).resize();

        if ($("body").hasClass('sidebar-open')) 
                $("body").removeClass('sidebar-open');


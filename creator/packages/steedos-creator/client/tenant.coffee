$.getJSON "/accounts/settings",(result) ->
    if result?.tenant
        Session.set("tenant_settings",result.tenant)
    Steedos.settings = Object.assign(Steedos.settings, result.settings || {})

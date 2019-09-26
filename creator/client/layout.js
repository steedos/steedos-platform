if (!Creator)
    Creator = {}

Creator.getLayout = (app_id) => {
    if (FlowRouter.current().path.startsWith("/workflow")){
        //return "workflowLayout";
	    return "creatorLayout";
    }
    else
	    return "creatorLayout";
}
